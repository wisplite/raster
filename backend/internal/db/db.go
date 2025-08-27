package db

import (
	"log"

	"github.com/glebarez/sqlite"
	"github.com/wisplite/raster/internal/models"
	"gorm.io/gorm"
)

var db *gorm.DB

func Init() bool {
	database, err := gorm.Open(sqlite.Open("raster.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to connect database: ", err)
		return false
	}

	// Run migrations
	err = database.AutoMigrate(
		&models.Album{},
	)
	if err != nil {
		log.Fatal("failed to migrate database: ", err)
		return false
	}

	db = database

	return true
}

func GetDB() *gorm.DB {
	return db
}
