package routes

import (
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
	"github.com/wisplite/raster/internal/services"
)

func RegisterMediaRoutes(rg *gin.RouterGroup) {
	media := rg.Group("/media")
	media.POST("/uploadMedia", func(c *gin.Context) {
		file, err := c.FormFile("file")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		accessToken := c.GetHeader("Authorization")
		albumID := c.PostForm("albumId")
		media, err := services.UploadMedia(file, albumID, accessToken)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		if err := os.MkdirAll(filepath.Dir(media.Path), 0755); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create directory"})
			return
		}

		if err := c.SaveUploadedFile(file, media.Path); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to save file"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"media": media})
	})
}
