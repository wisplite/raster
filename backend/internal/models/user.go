package models

import "time"

type User struct {
	ID        string `gorm:"primaryKey"`
	Username  string `gorm:"not null unique"`
	Password  string `gorm:"not null"`
	IsAdmin   bool   `gorm:"not null"`
	IsRoot    bool   `gorm:"not null"`
	IsActive  bool   `gorm:"not null"`
	CreatedAt time.Time
	UpdatedAt time.Time
}
