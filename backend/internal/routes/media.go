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
	media.GET("/getAllMediaInAlbum", func(c *gin.Context) {
		accessToken := c.GetHeader("Authorization")
		albumID := c.Query("albumId")
		media, err := services.GetAllMediaInAlbum(albumID, accessToken)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"media": media})
	})
	media.GET("/:albumId/:mediaId", func(c *gin.Context) {
		albumID := c.Param("albumId")
		mediaID := c.Param("mediaId")
		if albumID == "root" {
			albumID = ""
		}
		accessToken := c.GetHeader("Authorization")
		userID, err := services.ValidateAccessToken(accessToken)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		accessLevel, err := services.CheckUserAlbumAccess(userID, albumID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		if accessLevel < 0 {
			c.JSON(http.StatusForbidden, gin.H{"error": "user does not have permission to view media in this album"})
			return
		}
		mediaData, err := services.GetMedia(albumID, mediaID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.File(mediaData.Path)
	})
}
