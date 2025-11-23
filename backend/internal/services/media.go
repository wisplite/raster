package services

import (
	"encoding/json"
	"fmt"
	"image"
	_ "image/jpeg"
	_ "image/png"
	"mime/multipart"

	"github.com/google/uuid"
	"github.com/wisplite/raster/internal/db"
	"github.com/wisplite/raster/internal/models"
	"gorm.io/datatypes"
)

func UploadMedia(file *multipart.FileHeader, albumID string, accessToken string) (models.Media, error) {
	userID, err := ValidateAccessToken(accessToken)
	if err != nil {
		return models.Media{}, err
	}
	accessLevel, err := CheckUserAlbumAccess(userID, albumID)
	if err != nil {
		return models.Media{}, err
	}
	if accessLevel < 1 {
		return models.Media{}, fmt.Errorf("user does not have permission to upload media to this album")
	}
	albumPath := albumID
	if albumID == "" {
		albumPath = "root"
	}

	// Extract metadata (dimensions)
	var meta datatypes.JSON
	src, err := file.Open()
	if err == nil {
		defer src.Close()
		cfg, _, err := image.DecodeConfig(src)
		if err == nil {
			m := map[string]int{
				"width":  cfg.Width,
				"height": cfg.Height,
			}
			b, _ := json.Marshal(m)
			meta = datatypes.JSON(b)
		}
	}

	mediaID := uuid.New().String()
	mediaPath := fmt.Sprintf("media/%s/%s.%s", albumPath, mediaID, file.Filename)
	media := models.Media{
		ID:       mediaID,
		AlbumID:  albumID,
		Path:     mediaPath,
		Type:     file.Header.Get("Content-Type"),
		Metadata: meta,
	}
	result := db.GetDB().Create(&media)
	if result.Error != nil {
		return models.Media{}, result.Error
	}
	return media, nil
}

func GetAllMediaInAlbum(albumID string, accessToken string) ([]models.Media, error) {
	userID, err := ValidateAccessToken(accessToken)
	if err != nil {
		return []models.Media{}, err
	}
	accessLevel, err := CheckUserAlbumAccess(userID, albumID)
	if err != nil {
		return []models.Media{}, err
	}
	if accessLevel < 0 {
		return []models.Media{}, fmt.Errorf("user does not have permission to view media in this album")
	}
	media := []models.Media{}
	result := db.GetDB().Where("album_id = ?", albumID).Find(&media)
	if result.Error != nil {
		return []models.Media{}, result.Error
	}
	return media, nil
}

func GetMedia(albumID string, mediaID string) (models.Media, error) {
	media := models.Media{}
	result := db.GetDB().First(&media, "album_id = ? AND id = ?", albumID, mediaID)
	if result.Error != nil {
		return models.Media{}, result.Error
	}
	return media, nil
}
