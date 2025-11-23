import { Upload } from 'lucide-react'
import MediaUploadModal from './MediaUploadModal'
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
            if (!albumId) return

            // TODO: Implement media fetching from API
            // const response = await fetch(...)
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

            {/* Media Grid Placeholder */}
            <div className="flex flex-row items-center justify-start gap-2 w-full px-6 flex-wrap">
                {media.length === 0 && (
                    <p className="text-gray-500 red-hat-text">No media in this album</p>
                )}
                {/* Render media items here */}
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
