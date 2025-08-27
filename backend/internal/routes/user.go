package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/wisplite/raster/internal/services"
)

func RegisterUserRoutes(rg *gin.RouterGroup) {
	user := rg.Group("/user")
	user.POST("/createUser", func(c *gin.Context) {
		username := c.PostForm("username")
		password := c.PostForm("password")
		err := services.CreateUser(username, password)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "User created successfully"})
	})
	user.POST("/login", func(c *gin.Context) {
		username := c.PostForm("username")
		password := c.PostForm("password")
		accessToken, err := services.Login(username, password)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Login successful", "accessToken": accessToken.Token})
	})
}
