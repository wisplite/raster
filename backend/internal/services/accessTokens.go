package services

import (
	"fmt"
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

func ValidateAccessToken(accessToken string) (string, error) {
	accessTokenModel := models.AccessToken{}
	result := db.GetDB().First(&accessTokenModel, "token = ?", accessToken)
	if result.Error != nil {
		return "", result.Error
	}
	if accessTokenModel.Expires.Before(time.Now()) {
		return "", fmt.Errorf("access token expired")
	}
	return accessTokenModel.UserID, nil
}
