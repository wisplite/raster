import { Upload } from 'lucide-react'
import MediaUploadModal from './MediaUploadModal'
import AuthImage from '../../components/AuthImage'
import { useState, useEffect } from 'react'
import { getServerUrl } from '../../hooks/getConstants'
import { useAccount } from '../../contexts/useAccount'
import { useNotifier } from '../../contexts/useNotifier'

export default function MediaList({ albumId, albumName }) {
    const { getAccessToken } = useAccount()
    const [open, setOpen] = useState(false)
    const [media, setMedia] = useState([])
    const [aspectRatios, setAspectRatios] = useState({})
    const { showError } = useNotifier()

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

    return (
        <div className="flex flex-col items-center justify-start w-full bg-[#141414]">
            <div className="flex flex-row items-center justify-between gap-2 w-full px-6 py-4">
                <h1 className="text-xl font-bold text-white red-hat-mono">Media</h1>
                <Upload className="w-6 h-6 cursor-pointer" color="white" onClick={() => setOpen(true)} />
            </div>

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
                                height: '220px',
                                flexGrow: ar,
                                flexBasis: `${220 * ar}px`,
                            }}
                            className="relative bg-[#1A1A1A] rounded-md overflow-hidden border border-[#2B2B2B] min-w-[100px]"
                        >
                            <AuthImage
                                src={`${getServerUrl()}/api/media/${albumId ? albumId : 'root'}/${item.ID}`}
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
