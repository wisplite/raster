package services

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/wisplite/raster/internal/db"
	"github.com/wisplite/raster/internal/models"
	"gorm.io/gorm"
)

func GetPublicAlbums() ([]models.Album, error) {
	albums := []models.Album{}
	result := db.GetDB().Where("private = ?", false).Find(&albums)
	if result.Error != nil {
		return []models.Album{}, result.Error
	}
	return albums, nil
}

func GetAlbum(id string, authToken string) (models.Album, error) {
	// TODO: Add authentication
	album := models.Album{}
	result := db.GetDB().First(&album, "id = ?", id)
	if result.Error != nil {
		return models.Album{}, result.Error
	}
	return album, nil
}

func CreateAlbum(accessToken string, title string, description string, parentID string) (models.Album, error) {
	userID, err := ValidateAccessToken(accessToken)
	if err != nil {
		return models.Album{}, err
	}
	if userID == "" {
		return models.Album{}, fmt.Errorf("invalid access token")
	}
	accessLevel, err := CheckUserAlbumAccess(userID, parentID)
	if err != nil {
		return models.Album{}, err
	}
	if accessLevel < 2 {
		return models.Album{}, fmt.Errorf("user does not have permission to create albums in this parent")
	}
	albumID := uuid.New().String()
	album := models.Album{
		ID:          albumID,
		Title:       title,
		Description: description,
		ParentID:    parentID,
	}
	result := db.GetDB().Create(&album)
	if result.Error != nil {
		return models.Album{}, result.Error
	}
	return album, nil
}

func CheckUserAlbumAccess(userID string, albumID string) (int, error) {
	userAccess := models.UserAccess{}
	result := db.GetDB().First(&userAccess, "user_id = ? AND album_id = ?", userID, albumID)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			userData, err := GetUserByID(userID)
			if err != nil {
				return -1, err
			}
			if userData.IsAdmin || userData.IsRoot {
				return 4, nil // Admin access
			}
			return -1, nil // No access
		}
		return -1, result.Error
	}
	return userAccess.AccessLevel, nil
}
