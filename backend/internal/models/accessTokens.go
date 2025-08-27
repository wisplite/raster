package models

import "time"

type AccessToken struct {
	Token   string    `gorm:"primaryKey"`
	UserID  string    `gorm:"not null"`
	Expires time.Time `gorm:"not null"`
}
