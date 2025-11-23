import { PlusIcon } from 'lucide-react'
import AlbumCreateModal from './AlbumCreateModal'
import { useState, useEffect } from 'react'
import { getServerUrl } from '../../hooks/getConstants'
import { useAccount } from '../../contexts/useAccount'
export default function AlbumList({ currentAlbumName }) {
    const { getAccessToken } = useAccount()
    const [open, setOpen] = useState(false)
    const [albums, setAlbums] = useState([])
    const getAlbums = async () => {
        console.log('Getting albums in parent', currentAlbumName)
        if (currentAlbumName === 'gallery') { // Root album
            const response = await fetch(`${getServerUrl()}/api/albums/getAlbumsInParent`, {
                method: 'POST',
                headers: {
                    'Authorization': getAccessToken(),
                },
                body: JSON.stringify({
                    parentId: "",
                }),
            })
            const data = await response.json()
            console.log('Albums', data)
            setAlbums(data)
        } else {
            setAlbums([])
        }
    }
    useEffect(() => {
        if (!open) {
            getAlbums()
        }
    }, [currentAlbumName, open])
    return (
        <div className="flex flex-col items-center justify-start h-full w-full bg-[#141414]">
            <div className="flex flex-row items-center justify-between gap-2 w-full px-6 py-4">
                <h1 className="text-xl font-bold text-white red-hat-mono">Albums</h1>
                <PlusIcon className="w-6 h-6 cursor-pointer" color="white" onClick={() => setOpen(true)} />
            </div>
            <div className="flex flex-row items-center justify-start gap-2 w-full px-6 flex-wrap">
                {albums.map((album) => (
                    <div className="flex flex-row items-center justify-start gap-2 w-1/8 aspect-square border border-[#2B2B2B] rounded-md px-6 py-4">
                        <p className="text-white red-hat-mono">{album.Title}</p>
                    </div>
                ))}
            </div>
            <AlbumCreateModal open={open} onOpenChange={setOpen} />
        </div>
    )
}