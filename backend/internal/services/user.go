package services

import (
	"fmt"
	"log"

	"github.com/google/uuid"
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
	userID := uuid.New().String()
	user := models.User{
		ID:       userID,
		Username: username,
		Password: string(hashedPassword),
		IsAdmin:  false,
		IsRoot:   false,
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

func RootUserExists() bool {
	user := models.User{}
	result := db.GetDB().First(&user, "is_root = ?", true)
	if result.Error != nil {
		return false
	}
	return true
}

func SetRootUser(username string) error {
	user := models.User{}
	if RootUserExists() {
		return fmt.Errorf("root user already exists")
	}
	result := db.GetDB().First(&user, "username = ?", username)
	if result.Error != nil {
		return result.Error
	}
	user.IsRoot = true
	user.IsAdmin = true
	user.IsActive = true
	result = db.GetDB().Save(&user)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func GetUserData(authToken string) (models.User, error) {
	user := models.User{}
	accessToken := models.AccessToken{}
	result := db.GetDB().First(&accessToken, "token = ?", authToken)
	if result.Error != nil {
		return models.User{}, fmt.Errorf("invalid access token")
	}
	result = db.GetDB().First(&user, "id = ?", accessToken.UserID)
	if result.Error != nil {
		return models.User{}, fmt.Errorf("user not found")
	}
	userData := models.User{
		ID:       user.ID,
		Username: user.Username,
		IsAdmin:  user.IsAdmin,
		IsRoot:   user.IsRoot,
		IsActive: user.IsActive,
	}
	return userData, nil
}
