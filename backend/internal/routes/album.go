package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/wisplite/raster/internal/services"
)

func RegisterAlbumRoutes(rg *gin.RouterGroup) {
	album := rg.Group("/albums")
	album.GET("/getPublic", func(c *gin.Context) {
		albums, err := services.GetPublicAlbums()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, albums)
	})
}
