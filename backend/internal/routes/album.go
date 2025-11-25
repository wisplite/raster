package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/wisplite/raster/internal/services"
)

func RegisterAlbumRoutes(rg *gin.RouterGroup) {
	album := rg.Group("/albums")
	album.POST("/getAlbumsInParent", func(c *gin.Context) {
		accessToken := c.GetHeader("Authorization")
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
	album.POST("/getAlbum", func(c *gin.Context) {
		accessToken := c.GetHeader("Authorization")
		var request struct {
			ID string `json:"id"`
		}
		if err := c.ShouldBindJSON(&request); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		album, err := services.GetAlbum(request.ID, accessToken)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, album)
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
		if err := c.ShouldBindJSON(&request); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		result, err := services.CreateAlbum(accessToken, request.Title, request.Description, request.ParentID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, result)
	})
	album.POST("/editAlbum", func(c *gin.Context) {
		accessToken := c.GetHeader("Authorization")
		if accessToken == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		var request struct {
			ID         string                 `json:"id"`
			Properties map[string]interface{} `json:"properties"`
		}
		if err := c.ShouldBindJSON(&request); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		result, err := services.EditAlbum(accessToken, request.ID, request.Properties)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, result)
	})

	album.POST("/getIDFromPath", func(c *gin.Context) {
		var request struct {
			Path string `json:"path"`
		}
		if err := c.ShouldBindJSON(&request); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		id, err := services.GetIDFromPath(request.Path)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Album not found"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"id": id})
	})
}
