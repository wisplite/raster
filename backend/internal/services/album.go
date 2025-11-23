package services

import (
	"fmt"
	"regexp"
	"strings"

	"github.com/google/uuid"
	"github.com/wisplite/raster/internal/db"
	"github.com/wisplite/raster/internal/models"
	"gorm.io/gorm"
)

func GetAlbumsInParent(parentID string, authToken string) ([]models.Album, error) {
	userID, err := ValidateAccessToken(authToken)
	if err != nil {
		return []models.Album{}, err
	}
	accessLevel, err := CheckUserAlbumAccess(userID, parentID)
	if err != nil {
		return []models.Album{}, err
	}
	if accessLevel < 1 {
		return []models.Album{}, fmt.Errorf("user does not have permission to view albums in this parent")
	}
	albums := []models.Album{}
	result := db.GetDB().Where("private = ?", false).Where("parent_id = ?", parentID).Find(&albums)
	if result.Error != nil {
		return []models.Album{}, result.Error
	}
	filteredAlbums := []models.Album{}
	for _, album := range albums {
		if album.Private {
			accessLevel, err := CheckUserAlbumAccess(userID, album.ID)
			if err != nil {
				return []models.Album{}, err
			}
			if accessLevel < 1 {
				continue
			}
		}
		filteredAlbums = append(filteredAlbums, album)
	}
	return filteredAlbums, nil
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
	if !regexp.MustCompile(`^[a-zA-Z0-9\s\-_]+$`).MatchString(title) {
		return models.Album{}, fmt.Errorf("title can only contain alphanumeric characters, spaces, and hyphens/underscores")
	}
	// check for duplicate title in parent
	existingAlbum := models.Album{}
	result := db.GetDB().First(&existingAlbum, "title = ? AND parent_id = ?", title, parentID)
	if result.Error != nil && result.Error != gorm.ErrRecordNotFound {
		return models.Album{}, result.Error
	}
	if existingAlbum.ID != "" {
		return models.Album{}, fmt.Errorf("album with this title already exists in this parent")
	}
	albumID := uuid.New().String()
	newAlbum := models.Album{
		ID:          albumID,
		Title:       title,
		Description: description,
		ParentID:    parentID,
		Thumbnail:   "",
	}
	newAlbumResult := db.GetDB().Create(&newAlbum)
	if newAlbumResult.Error != nil {
		return models.Album{}, result.Error
	}
	return newAlbum, nil
}

func CheckUserAlbumAccess(userID string, albumID string) (int, error) {
	userAccess := models.UserAlbumAccess{}
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

func GetIDFromPath(path string) (string, error) {
	currentParentID := ""
	segments := strings.Split(path, "/")

	for _, segment := range segments {
		if segment == "" {
			continue
		}

		var album models.Album
		result := db.GetDB().Where("title = ? AND parent_id = ?", segment, currentParentID).First(&album)
		if result.Error != nil {
			return "", result.Error
		}
		currentParentID = album.ID
	}

	return currentParentID, nil
}
