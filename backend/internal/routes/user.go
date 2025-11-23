package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/wisplite/raster/internal/services"
)

func RegisterUserRoutes(rg *gin.RouterGroup) {
	user := rg.Group("/user")
	user.POST("/createUser", func(c *gin.Context) {
		var request struct {
			Username string `json:"username"`
			Password string `json:"password"`
		}
		if err := c.ShouldBindJSON(&request); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		err := services.CreateUser(request.Username, request.Password)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "User created successfully"})
	})
	user.POST("/setRootUser", func(c *gin.Context) {
		var request struct {
			Username string `json:"username"`
		}
		if err := c.ShouldBindJSON(&request); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		err := services.SetRootUser(request.Username)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Root user set successfully"})
	})
	user.POST("/login", func(c *gin.Context) {
		var request struct {
			Username string `json:"username"`
			Password string `json:"password"`
		}
		if err := c.ShouldBindJSON(&request); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		accessToken, err := services.Login(request.Username, request.Password)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Login successful", "accessToken": accessToken.Token})
	})
	user.GET("/rootUserExists", func(c *gin.Context) {
		exists := services.RootUserExists()
		c.JSON(http.StatusOK, gin.H{"exists": exists})
	})
	user.GET("/getUserData", func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		userData, err := services.GetUserData(authHeader)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"userData": userData})
	})
}
