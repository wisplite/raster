package models

import (
	"time"

	"gorm.io/datatypes"
)

type Media struct {
	ID          string         `gorm:"primaryKey"`
	Title       string         `gorm:"not null"`
	Description string         `gorm:"not null"`
	Tags        datatypes.JSON `gorm:"type:json"`
	AlbumID     string         `gorm:"not null"`
	Path        string         `gorm:"not null"`
	Type        string         `gorm:"not null"`  // MIME type
	Metadata    datatypes.JSON `gorm:"type:json"` // Metadata about the media.
	CreatedAt   time.Time
	UpdatedAt   time.Time
}
