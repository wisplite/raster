package services

import (
	"time"

	"github.com/google/uuid"
	"github.com/wisplite/raster/internal/db"
	"github.com/wisplite/raster/internal/models"
)

func CreateAccessToken(userID string) (models.AccessToken, error) {
	token := uuid.New().String()
	expires := time.Now().Add(time.Hour * 24 * 30)
	accessToken := models.AccessToken{
		Token:   token,
		UserID:  userID,
		Expires: expires,
	}
	result := db.GetDB().Create(&accessToken)
	if result.Error != nil {
		return models.AccessToken{}, result.Error
	}
	return accessToken, nil
}
