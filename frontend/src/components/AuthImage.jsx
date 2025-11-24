import { useState, useEffect } from 'react'

export default function AuthImage({ src, token, alt, className, onLoad, ...props }) {
    const [imageSrc, setImageSrc] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        let objectUrl = null
        let active = true
        const controller = new AbortController()

        const fetchImage = async () => {
            setLoading(true)
            setError(false)
            try {
                const response = await fetch(src, {
                    headers: {
                        'Authorization': token
                    },
                    signal: controller.signal
                })

                if (!response.ok) {
                    throw new Error('Failed to load image')
                }

                const blob = await response.blob()
                if (active) {
                    objectUrl = URL.createObjectURL(blob)
                    setImageSrc(objectUrl)
                    setLoading(false)
                    if (onLoad) {
                        setTimeout(() => {
                            onLoad()
                        }, 500)
                    }
                }
            } catch (err) {
                if (active) {
                    console.error("Error loading image:", err)
                    setError(true)
                    setLoading(false)
                }
            }
        }

        if (src && token) {
            fetchImage()
        } else {
            setLoading(false)
        }

        return () => {
            active = false
            controller.abort()
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl)
            }
        }
    }, [src, token])

    if (loading) {
        return <div className={`bg-gray-800 animate-pulse ${className}`} />
    }

    if (error || !imageSrc) {
        return <div className={`bg-gray-800 flex items-center justify-center text-gray-500 ${className}`}>Error</div>
    }

    return <img src={imageSrc} alt={alt} className={className} {...props} />
}

