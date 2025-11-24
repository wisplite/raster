import { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import ImageViewer from './components/ImageViewer'
import MetadataPanel from './components/MetadataPanel'
import { useAccount } from '../contexts/useAccount'
import { getServerUrl } from '../hooks/getConstants'
import { useNotifier } from '../contexts/useNotifier'
import { ArrowLeft } from 'lucide-react'

export default function Viewer() {
    const { albumId, mediaId } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const { getAccessToken } = useAccount()
    const { showError } = useNotifier()
    const [mediaItem, setMediaItem] = useState(location.state?.mediaItem || null)

    useEffect(() => {
        if (mediaItem) return

        const fetchMediaDetails = async () => {
            try {
                // Use '' if albumId is 'root'
                const targetAlbumId = albumId === 'root' ? '' : albumId

                const response = await fetch(`${getServerUrl()}/api/media/getAllMediaInAlbum?albumId=${targetAlbumId}`, {
                    headers: {
                        'Authorization': getAccessToken()
                    }
                })

                const data = await response.json()

                if (data.error) {
                    showError(data.error)
                } else {
                    const found = data.media.find(m => m.ID === mediaId)
                    if (found) {
                        setMediaItem(found)
                    } else {
                        showError("Media not found")
                    }
                }
            } catch (err) {
                showError("Failed to fetch media details")
            }
        }

        fetchMediaDetails()
    }, [albumId, mediaId, getAccessToken, showError, mediaItem])

    const handleBack = () => {
        if (window.history.state && window.history.state.idx > 0) {
            navigate(-1)
        } else {
            // Fallback if opened directly
            navigate('/gallery')
        }
    }

    return (
        <div className="flex flex-col h-screen w-full bg-[#141414]">
            <div className="flex items-center h-14 px-4 border-b border-[#2B2B2B] bg-[#141414] flex-shrink-0 gap-4">
                <button onClick={handleBack} className="text-gray-400 hover:text-white transition-colors p-1 cursor-pointer">
                    <ArrowLeft size={20} />
                </button>
                <span className="text-white font-medium truncate red-hat-mono">
                    {mediaItem ? mediaItem.Title : 'Loading...'}
                </span>
            </div>

            <div className="flex flex-1 overflow-hidden">
                <ImageViewer
                    albumId={albumId === 'root' ? '' : albumId}
                    mediaId={mediaId}
                    token={getAccessToken()}
                    title={mediaItem?.Title || ''}
                />
                <MetadataPanel mediaItem={mediaItem} />
            </div>
        </div>
    )
}

