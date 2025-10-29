package services

import (
	"github.com/wisplite/raster/internal/db"
	"github.com/wisplite/raster/internal/models"
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
