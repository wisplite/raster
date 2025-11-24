package services

import (
	"encoding/json"
	"fmt"
	"image"
	_ "image/jpeg"
	_ "image/png"
	"mime/multipart"
	"os"
	"path/filepath"

	"github.com/disintegration/imaging"
	"github.com/google/uuid"
	"github.com/rwcarlsen/goexif/exif"
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

	// Extract metadata (dimensions and file info)
	var meta datatypes.JSON
	metadataMap := map[string]interface{}{
		"originalFilename": file.Filename,
		"fileSize":         file.Size,
		"contentType":      file.Header.Get("Content-Type"),
	}

	src, err := file.Open()
	if err == nil {
		defer src.Close()
		cfg, format, err := image.DecodeConfig(src)
		if err == nil {
			metadataMap["width"] = cfg.Width
			metadataMap["height"] = cfg.Height
			metadataMap["format"] = format

			// Check for EXIF orientation
			src.Seek(0, 0)
			x, err := exif.Decode(src)
			if err == nil {
				orient, err := x.Get(exif.Orientation)
				if err == nil {
					val, err := orient.Int(0)
					if err == nil {
						if val >= 5 && val <= 8 {
							metadataMap["width"] = cfg.Height
							metadataMap["height"] = cfg.Width
						}
					}
				}
			}
		}
	}

	b, _ := json.Marshal(metadataMap)
	meta = datatypes.JSON(b)

	mediaID := uuid.New().String()
	mediaPath := fmt.Sprintf("media/%s/%s.%s", albumPath, mediaID, file.Filename)
	media := models.Media{
		ID:          mediaID,
		AlbumID:     albumID,
		Path:        mediaPath,
		Type:        file.Header.Get("Content-Type"),
		Title:       file.Filename,
		Description: "",
		Metadata:    meta,
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

func GetAllMediaInPublicAlbum(albumID string) ([]models.Media, error) {
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

func GetThumbnail(albumID string, mediaID string, width int, height int) (string, error) {
	media, err := GetMedia(albumID, mediaID)
	if err != nil {
		return "", err
	}

	if width == 0 {
		width = 200
	}
	if height == 0 {
		height = 200
	}

	cacheDir := "cache/thumbnails"
	if err := os.MkdirAll(cacheDir, 0755); err != nil {
		return "", err
	}

	ext := filepath.Ext(media.Path)
	if ext == "" {
		ext = ".jpg"
	}
	thumbName := fmt.Sprintf("%s_%dx%d%s", mediaID, width, height, ext)
	thumbPath := filepath.Join(cacheDir, thumbName)

	if _, err := os.Stat(thumbPath); err == nil {
		return thumbPath, nil
	}

	srcImage, err := imaging.Open(media.Path)
	if err != nil {
		return "", err
	}

	f, err := os.Open(media.Path)
	if err == nil {
		x, err := exif.Decode(f)
		f.Close()
		if err == nil {
			orient, err := x.Get(exif.Orientation)
			if err == nil {
				val, err := orient.Int(0)
				if err == nil {
					switch val {
					case 3:
						srcImage = imaging.Rotate180(srcImage)
					case 6:
						srcImage = imaging.Rotate270(srcImage)
					case 8:
						srcImage = imaging.Rotate90(srcImage)
					}
				}
			}
		}
	}

	dstImage := imaging.Fill(srcImage, width, height, imaging.Center, imaging.Lanczos)

	err = imaging.Save(dstImage, thumbPath)
	if err != nil {
		return "", err
	}

	return thumbPath, nil
}
