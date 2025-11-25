import { PlusIcon, EllipsisVertical } from 'lucide-react'
import AlbumCreateModal from './AlbumCreateModal'
import { useState, useEffect } from 'react'
import { getServerUrl } from '../../hooks/getConstants'
import { useAccount } from '../../contexts/useAccount'
import { useNavigate } from 'react-router-dom'
import { useNotifier } from '../../contexts/useNotifier'
import AlbumEditModal from './AlbumEditModal'
export default function AlbumList({ currentAlbumName }) {
    const { getAccessToken } = useAccount()
    const [open, setOpen] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [editingAlbum, setEditingAlbum] = useState(null)
    const [albums, setAlbums] = useState([])
    const navigate = useNavigate()
    const { showError } = useNotifier()
    useEffect(() => {
        let ignore = false;
        const getAlbums = async () => {
            console.log('Getting albums in parent', currentAlbumName)
            const parentId = currentAlbumName === 'gallery' ? "" : currentAlbumName;
            try {
                const response = await fetch(`${getServerUrl()}/api/albums/getAlbumsInParent`, {
                    method: 'POST',
                    headers: {
                        'Authorization': getAccessToken(),
                    },
                    body: JSON.stringify({
                        parentId: parentId,
                    }),
                })
                const data = await response.json()
                if (!ignore) {
                    if (data.error) {
                        setAlbums([])
                        showError('Failed to get albums')
                    } else {
                        setAlbums(data)
                    }
                }
            } catch (error) {
                if (!ignore) {
                    setAlbums([])
                    showError('Failed to get albums')
                }
            }
        }

        if (!open && !openEdit && currentAlbumName !== null) {
            getAlbums()
        }
        return () => { ignore = true; }
    }, [currentAlbumName, open, openEdit])
    return (
        <div className="flex flex-col items-center justify-start h-min w-full bg-[#141414]">
            <div className="flex flex-row items-center justify-between gap-2 w-full px-6 py-4">
                <h1 className="text-xl font-bold text-white red-hat-mono">Albums</h1>
                <PlusIcon className="w-6 h-6 cursor-pointer" color="white" onClick={() => setOpen(true)} />
            </div>
            <div className="flex flex-row items-center justify-start gap-2 w-full px-6 flex-wrap">
                {albums.map((album) => (
                    <div
                        key={album.ID}
                        className="flex flex-row items-center justify-start gap-2 w-1/8 aspect-square border border-[#2B2B2B] rounded-md px-6 py-4 cursor-pointer"
                        onClick={() => {
                            // Get current path and append the album's title
                            const currentPath = window.location.pathname;
                            // Remove leading and trailing slashes, split to parts
                            const pathParts = currentPath.replace(/^\/|\/$/g, '').split('/');
                            // Only append if not already the last part (avoid duplicate navigation)
                            if (pathParts[pathParts.length - 1] !== album.Title) {
                                navigate(`${currentPath.replace(/\/$/, '')}/${encodeURIComponent(album.Title)}`);
                            } else {
                                navigate(currentPath); // Or optionally do nothing/navigate to self
                            }
                        }}
                    >
                        <p className="text-white red-hat-mono">{album.Title}</p>
                        <EllipsisVertical className="w-6 h-6 cursor-pointer" color="white" onClick={(e) => {
                            e.stopPropagation()
                            setEditingAlbum(album)
                            setOpenEdit(true)
                        }} />
                    </div>
                ))}
            </div>
            <AlbumCreateModal open={open} onOpenChange={setOpen} parentId={currentAlbumName === 'gallery' ? '' : currentAlbumName} />
            {editingAlbum && (
                <AlbumEditModal
                    open={openEdit}
                    onOpenChange={setOpenEdit}
                    id={editingAlbum.ID}
                    startTitle={editingAlbum.Title}
                    startDescription={editingAlbum.Description}
                    currentAlbum={editingAlbum}
                />
            )}
        </div>
    )
}