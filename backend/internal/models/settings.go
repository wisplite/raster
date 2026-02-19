package models

// Settings are stored in the database as key-value pairs.
type Settings struct {
	Key       string    `json:"key" gorm:"primaryKey"`
	Value     string    `json:"value"`
}