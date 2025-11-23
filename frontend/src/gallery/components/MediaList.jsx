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
    const { showError } = useNotifier()

    useEffect(() => {
        let ignore = false;
        const getMedia = async () => {
            // TODO: Implement media fetching from API
            // const response = await fetch(...)
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
                console.log("data.media", data.media)
                setMedia(data.media)
            }
        }
        getMedia()
        return () => { ignore = true; }
    }, [albumId])

    return (
        <div className="flex flex-col items-center justify-start w-full bg-[#141414]">
            <div className="flex flex-row items-center justify-between gap-2 w-full px-6 py-4">
                <h1 className="text-xl font-bold text-white red-hat-mono">Media</h1>
                <Upload className="w-6 h-6 cursor-pointer" color="white" onClick={() => setOpen(true)} />
            </div>

            {/* Media Grid */}
            <div className="flex flex-row items-center justify-start gap-2 w-full px-6 flex-wrap">
                {media.length === 0 && (
                    <p className="text-gray-500 red-hat-text">No media in this album</p>
                )}
                {media.map((media) => (
                    <div key={media.id} className="flex flex-col items-center justify-center w-24 h-24 bg-[#1A1A1A] rounded-md border border-[#2B2B2B]">
                        <AuthImage
                            src={`${getServerUrl()}/api/media/${albumId ? albumId : 'root'}/${media.ID}`}
                            token={getAccessToken()}
                            alt={media.Title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
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
