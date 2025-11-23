package models

import (
	"time"

	"gorm.io/datatypes"
)

type Album struct {
	ID          string         `gorm:"primaryKey"`
	Title       string         `gorm:"not null"`
	Description string         `gorm:"not null"`
	Tags        datatypes.JSON `gorm:"type:json"`
	Private     bool           `gorm:"not null"`
	// Public albums have a default access level of 0 for all visitors, including guests.
	// Private albums require a user with access to be logged in to view, or a magic link to be used.
	ParentID  string `gorm:"not null"` // The ID of the parent album, if any. This is an empty string for root albums.
	Thumbnail string `gorm:"not null"` // The media ID of the thumbnail for the album.
	CreatedAt time.Time
	UpdatedAt time.Time
}

type UserAlbumAccess struct {
	UserID      string `gorm:"not null"`
	AlbumID     string `gorm:"not null"`
	AccessLevel int    `gorm:"not null"` // 0: View, 1: Upload, 2: Edit, 3: Edit/Delete, 4: Admin (manage other users)
	CreatedAt   time.Time
	UpdatedAt   time.Time
}
