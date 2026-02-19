import AuthImage from '../../components/AuthImage'
import { getServerUrl } from '../../hooks/getConstants'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Loader2, ZoomIn, ZoomOut } from 'lucide-react'

const MIN_SCALE = 1
const MAX_SCALE = 8

export default function ImageViewer({ albumId, mediaId, token, title }) {
    const src = `${getServerUrl()}/api/media/${albumId}/${mediaId}`
    const [loaded, setLoaded] = useState(false)
    const [scale, setScale] = useState(1)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [zoomControlVisible, setZoomControlVisible] = useState(false)

    const containerRef = useRef(null)
    const scaleRef = useRef(1)
    const positionRef = useRef({ x: 0, y: 0 })
    const draggingRef = useRef(false)
    const dragOrigin = useRef({ x: 0, y: 0 })
    const lastTouchDist = useRef(null)

    // Keep refs in sync with state
    useEffect(() => { scaleRef.current = scale }, [scale])
    useEffect(() => { positionRef.current = position }, [position])

    // Reset on image change
    useEffect(() => {
        setScale(1)
        setPosition({ x: 0, y: 0 })
        scaleRef.current = 1
        positionRef.current = { x: 0, y: 0 }
        setLoaded(false)
    }, [mediaId])

    const clamp = useCallback((pos, s) => {
        if (!containerRef.current) return pos
        const { clientWidth: w, clientHeight: h } = containerRef.current
        const maxX = (w * (s - 1)) / 2
        const maxY = (h * (s - 1)) / 2
        return {
            x: Math.max(-maxX, Math.min(maxX, pos.x)),
            y: Math.max(-maxY, Math.min(maxY, pos.y)),
        }
    }, [])

    // Zoom towards a specific point (ox, oy) in container-local coordinates
    const zoomTowards = useCallback((newScale, ox, oy) => {
        const s = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale))
        const factor = s / scaleRef.current
        const { clientWidth: w, clientHeight: h } = containerRef.current
        const cx = ox - w / 2
        const cy = oy - h / 2
        const newPos = s === MIN_SCALE
            ? { x: 0, y: 0 }
            : clamp({
                x: positionRef.current.x * factor + cx * (1 - factor),
                y: positionRef.current.y * factor + cy * (1 - factor),
            }, s)
        scaleRef.current = s
        positionRef.current = newPos
        setScale(s)
        setPosition(newPos)
    }, [clamp])

    // Wheel zoom
    useEffect(() => {
        const container = containerRef.current
        if (!container) return
        const onWheel = (e) => {
            e.preventDefault()
            const rect = container.getBoundingClientRect()
            const ox = e.clientX - rect.left
            const oy = e.clientY - rect.top
            const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15
            zoomTowards(scaleRef.current * factor, ox, oy)
        }
        container.addEventListener('wheel', onWheel, { passive: false })
        return () => container.removeEventListener('wheel', onWheel)
    }, [zoomTowards])

    // Mouse drag
    const handleMouseDown = useCallback((e) => {
        if (scaleRef.current <= 1 || e.button !== 0) return
        draggingRef.current = true
        setIsDragging(true)
        dragOrigin.current = {
            x: e.clientX - positionRef.current.x,
            y: e.clientY - positionRef.current.y,
        }
        e.preventDefault()
    }, [])

    const handleMouseMove = useCallback((e) => {
        if (!draggingRef.current) return
        const newPos = clamp(
            { x: e.clientX - dragOrigin.current.x, y: e.clientY - dragOrigin.current.y },
            scaleRef.current,
        )
        positionRef.current = newPos
        setPosition(newPos)
    }, [clamp])

    const handleMouseUp = useCallback(() => {
        draggingRef.current = false
        setIsDragging(false)
    }, [])

    const handleDoubleClick = useCallback(() => {
        scaleRef.current = 1
        positionRef.current = { x: 0, y: 0 }
        setScale(1)
        setPosition({ x: 0, y: 0 })
    }, [])

    // Touch handlers — touchmove must be non-passive to call preventDefault
    const handleTouchStart = useCallback((e) => {
        if (e.touches.length === 2) {
            draggingRef.current = false
            setIsDragging(false)
            const dx = e.touches[0].clientX - e.touches[1].clientX
            const dy = e.touches[0].clientY - e.touches[1].clientY
            lastTouchDist.current = Math.sqrt(dx * dx + dy * dy)
        } else if (e.touches.length === 1 && scaleRef.current > 1) {
            draggingRef.current = true
            setIsDragging(true)
            dragOrigin.current = {
                x: e.touches[0].clientX - positionRef.current.x,
                y: e.touches[0].clientY - positionRef.current.y,
            }
        }
    }, [])

    useEffect(() => {
        const container = containerRef.current
        if (!container) return
        const onTouchMove = (e) => {
            e.preventDefault()
            if (e.touches.length === 2) {
                const dx = e.touches[0].clientX - e.touches[1].clientX
                const dy = e.touches[0].clientY - e.touches[1].clientY
                const dist = Math.sqrt(dx * dx + dy * dy)
                if (lastTouchDist.current) {
                    const rect = container.getBoundingClientRect()
                    const ox = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left
                    const oy = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top
                    zoomTowards(scaleRef.current * (dist / lastTouchDist.current), ox, oy)
                }
                lastTouchDist.current = dist
            } else if (e.touches.length === 1 && draggingRef.current) {
                const newPos = clamp(
                    { x: e.touches[0].clientX - dragOrigin.current.x, y: e.touches[0].clientY - dragOrigin.current.y },
                    scaleRef.current,
                )
                positionRef.current = newPos
                setPosition(newPos)
            }
        }
        container.addEventListener('touchmove', onTouchMove, { passive: false })
        return () => container.removeEventListener('touchmove', onTouchMove)
    }, [zoomTowards, clamp])

    const handleTouchEnd = useCallback(() => {
        lastTouchDist.current = null
        draggingRef.current = false
        setIsDragging(false)
    }, [])

    const zoomIn = useCallback(() => {
        if (!containerRef.current) return
        const { clientWidth: w, clientHeight: h } = containerRef.current
        zoomTowards(scaleRef.current * 1.5, w / 2, h / 2)
    }, [zoomTowards])

    const zoomOut = useCallback(() => {
        if (!containerRef.current) return
        const { clientWidth: w, clientHeight: h } = containerRef.current
        zoomTowards(scaleRef.current / 1.5, w / 2, h / 2)
    }, [zoomTowards])

    useEffect(() => {
        // while zooming, show the zoom control
        setZoomControlVisible(true)
        if (isDragging) return
        const timer = setTimeout(() => {
            setZoomControlVisible(false)
        }, 1000)
        return () => clearTimeout(timer)
    }, [scale, isDragging])

    return (
        <div
            ref={containerRef}
            className="flex-1 flex items-center justify-center bg-black relative overflow-hidden select-none"
            style={{ cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default', touchAction: 'none' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <AuthImage
                src={src}
                token={token}
                alt={title}
                className={`max-w-full max-h-full object-contain absolute ${loaded ? 'block' : 'hidden'}`}
                style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    transformOrigin: 'center',
                    willChange: 'transform',
                }}
                onLoad={() => setLoaded(true)}
                draggable={false}
            />
            {!loaded && (
                <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center">
                    <AuthImage
                        src={`${getServerUrl()}/api/media/thumb/${albumId}/${mediaId}`}
                        token={token}
                        alt={title}
                        className="max-w-full max-h-full object-contain w-full h-full"
                    />
                    <Loader2 className="w-10 h-10 text-white animate-spin absolute bottom-5 right-5" />
                </div>
            )}
            <div
                className="absolute bottom-4 right-4 flex items-center gap-1 bg-[#222]/50 rounded-full px-2 py-1.5 backdrop-blur-sm "
                onMouseEnter={() => setZoomControlVisible(true)}
                onMouseLeave={() => setZoomControlVisible(false)}
                style={{ opacity: zoomControlVisible ? 1 : 0, transition: 'opacity 0.2s ease-in-out' }}
                onMouseDown={e => e.stopPropagation()}
            >
                <button
                    onClick={zoomOut}
                    disabled={scale <= MIN_SCALE}
                    className="text-white/80 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors p-1.5 cursor-pointer"
                >
                    <ZoomOut size={16} />
                </button>
                <button
                    onClick={handleDoubleClick}
                    className="text-white/60 hover:text-white transition-colors text-xs font-mono w-10 text-center cursor-pointer"
                >
                    {Math.round(scale * 100)}%
                </button>
                <button
                    onClick={zoomIn}
                    disabled={scale >= MAX_SCALE}
                    className="text-white/80 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors p-1.5 cursor-pointer"
                >
                    <ZoomIn size={16} />
                </button>
            </div>
        </div>
    )
}
