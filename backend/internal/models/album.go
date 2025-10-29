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
	CreatedAt   time.Time
	UpdatedAt   time.Time
}
