package services

import (
	"log"

	"github.com/wisplite/raster/internal/db"
	"github.com/wisplite/raster/internal/models"
	"golang.org/x/crypto/bcrypt"
)

func CreateUser(username string, password string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal("failed to hash password: ", err)
		return err
	}
	user := models.User{
		Username: username,
		Password: string(hashedPassword),
		IsAdmin:  false,
		IsActive: false,
	}
	result := db.GetDB().Create(&user)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func Login(username string, password string) (models.AccessToken, error) {
	user := models.User{}
	result := db.GetDB().First(&user, "username = ?", username)
	if result.Error != nil {
		return models.AccessToken{}, result.Error
	}
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return models.AccessToken{}, err
	}
	accessToken, err := CreateAccessToken(user.ID)
	if err != nil {
		return models.AccessToken{}, err
	}
	return accessToken, nil
}
