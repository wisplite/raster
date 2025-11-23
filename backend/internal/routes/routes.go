package routes

import "github.com/gin-gonic/gin"

func RegisterRoutes(r *gin.Engine) {
	rg := r.Group("/api")
	RegisterAlbumRoutes(rg)
	RegisterUserRoutes(rg)
	RegisterMediaRoutes(rg)
}
