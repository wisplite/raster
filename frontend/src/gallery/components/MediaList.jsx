import { EllipsisVertical, Upload } from 'lucide-react'
import MediaUploadModal from './MediaUploadModal'
import AuthImage from '../../components/AuthImage'
import { useState, useEffect } from 'react'
import { getServerUrl } from '../../hooks/getConstants'
import { useAccount } from '../../contexts/useAccount'
import { useNotifier } from '../../contexts/useNotifier'
import { useNavigate } from 'react-router-dom'
export default function MediaList({ albumId, albumName }) {
    const { getAccessToken } = useAccount()
    const [open, setOpen] = useState(false)
    const [media, setMedia] = useState([])
    const [aspectRatios, setAspectRatios] = useState({})
    const { showError } = useNotifier()
    const navigate = useNavigate()
    useEffect(() => {
        let ignore = false;
        const getMedia = async () => {
            const response = await fetch(`${getServerUrl()}/api/media/getAllMediaInAlbum?albumId=${albumId}`, {
                method: 'GET',
                headers: {
                    'Authorization': getAccessToken(),
                },
            })
            const data = await response.json()
            if (ignore) return
            if (data.error) {
                showError(data.error)
            } else {
                setMedia(data.media)
            }
        }
        getMedia()
        return () => { ignore = true; }
    }, [albumId])

    const handleImageLoad = (id, event) => {
        const { naturalWidth, naturalHeight } = event.target
        if (naturalWidth && naturalHeight) {
            setAspectRatios(prev => ({
                ...prev,
                [id]: naturalWidth / naturalHeight
            }))
        }
    }

    useEffect(() => {
        console.log(media)
    }, [media])

    return (
        <div className="flex flex-col items-center justify-start w-full bg-[#141414]">
            <div className="flex flex-row items-center justify-between gap-2 w-full px-6 py-4">
                <h1 className="text-xl font-bold text-white red-hat-mono">Media</h1>
                <Upload className="w-6 h-6 cursor-pointer" color="white" onClick={() => setOpen(true)} />
            </div>
            <MediaUploadModal
                open={open}
                onOpenChange={setOpen}
                albumId={albumId}
                albumName={albumName}
            />

            {/* Media Grid */}
            <div className="flex flex-wrap justify-start gap-2 w-full px-6">
                {media.length === 0 && (
                    <p className="text-gray-500 red-hat-text">No media in this album</p>
                )}
                {media.map((item) => {
                    let ar = 1;
                    // Try to get aspect ratio from metadata (new uploads) or fallback to loaded state (old uploads)
                    if (item.Metadata && item.Metadata.width && item.Metadata.height) {
                        ar = item.Metadata.width / item.Metadata.height;
                    } else if (aspectRatios[item.ID]) {
                        ar = aspectRatios[item.ID];
                    }

                    return (
                        <div
                            key={item.ID}
                            style={{
                                aspectRatio: ar,
                                flexGrow: ar,
                                flexBasis: `${220 * ar}px`,
                            }}
                            className="relative bg-[#1A1A1A] rounded-md overflow-hidden border border-[#2B2B2B] min-w-[100px] hover:scale-102 transition-all duration-300 cursor-pointer"
                            onClick={() => {
                                navigate(`/viewer/${albumId ? albumId : 'root'}/${item.ID}`)
                            }}
                        >
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#1A1A1A] via-transparent to-transparent flex items-start justify-start opacity-0 hover:opacity-100 transition-all duration-300">
                                <p className="text-white text-sm truncate max-w-[100%] p-2 red-hat-mono">{item.Title}</p>
                                <button className="text-white px-1 py-1 rounded-md absolute top-2 right-2 cursor-pointer z-50" onClick={(e) => {
                                    e.stopPropagation()
                                    setOpen(true)
                                }}>
                                    <EllipsisVertical className="w-4 h-4" />
                                </button>
                            </div>
                            <AuthImage
                                src={`${getServerUrl()}/api/media/thumb/${albumId ? albumId : 'root'}/${item.ID}`}
                                token={getAccessToken()}
                                alt={item.Title}
                                className="w-full h-full object-cover"
                                onLoad={(e) => handleImageLoad(item.ID, e)}
                            />
                        </div>
                    )
                })}
                {/* Spacer to prevent the last row from expanding to fill width if it has few items */}
                <div style={{ flexGrow: 9999, flexBasis: '50%' }}></div>
            </div>

            <MediaUploadModal
                open={open}
                onOpenChange={setOpen}
                albumId={albumId}
                albumName={albumName}
            />
        </div>
    )
}
