package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/wisplite/raster/internal/services"
)

func RegisterAlbumRoutes(rg *gin.RouterGroup) {
	album := rg.Group("/albums")
	album.GET("/getAlbumsInParent", func(c *gin.Context) {
		accessToken := c.GetHeader("Authorization")
		if accessToken == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		var request struct {
			ParentID string `json:"parentId"`
		}
		if err := c.ShouldBindJSON(&request); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		albums, err := services.GetAlbumsInParent(request.ParentID, accessToken)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, albums)
	})
	album.POST("/createAlbum", func(c *gin.Context) {
		accessToken := c.GetHeader("Authorization")
		if accessToken == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		var request struct {
			Title       string `json:"title"`
			Description string `json:"description"`
			ParentID    string `json:"parentId"`
		}
		result, err := services.CreateAlbum(accessToken, request.Title, request.Description, request.ParentID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, result)
	})
}
