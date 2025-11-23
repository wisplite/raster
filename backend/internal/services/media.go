package services

import (
	"fmt"
	"github.com/google/uuid"
	"github.com/wisplite/raster/internal/db"
	"github.com/wisplite/raster/internal/models"
	"mime/multipart"
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
	mediaID := uuid.New().String()
	mediaPath := fmt.Sprintf("media/%s/%s.%s", albumPath, mediaID, file.Filename)
	media := models.Media{
		ID:      mediaID,
		AlbumID: albumID,
		Path:    mediaPath,
		Type:    file.Header.Get("Content-Type"),
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
