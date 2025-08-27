package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/wisplite/raster/internal/db"
	"github.com/wisplite/raster/internal/routes"
)

func main() {
	if !db.Init() {
		log.Fatal("failed to initialize database")
	}

	r := gin.Default()

	routes.RegisterRoutes(r)

	r.Run(":8080")
}
