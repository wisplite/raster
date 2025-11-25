import { File, Folder } from 'lucide-react'
import { useState, useEffect } from 'react'
import Modal from '../../components/Modal'
import { useAccount } from '../../contexts/useAccount'
import { getServerUrl } from '../../hooks/getConstants'
import { useNotifier } from '../../contexts/useNotifier'
import { ArrowLeft } from 'lucide-react'
export default function FilePicker({ currentAlbum }) {
    const [selectedFile, setSelectedFile] = useState(null)
    const [selectedAlbum, setSelectedAlbum] = useState(currentAlbum)
    const [currentPath, setCurrentPath] = useState([])
    const [albums, setAlbums] = useState([])
    const [media, setMedia] = useState([])
    const [filePickerOpen, setFilePickerOpen] = useState(false)
    const { getAccessToken } = useAccount()
    const { showError } = useNotifier()
    useEffect(() => {
        const getAlbum = async () => {
            const response = await fetch(`${getServerUrl()}/api/albums/getAlbumsInParent`, {
                method: 'POST',
                headers: {
                    'Authorization': getAccessToken(),
                },
                body: JSON.stringify({
                    parentId: selectedAlbum.ID,
                }),
            })
            const data = await response.json()
            if (data.error) {
                showError(data.error)
            } else {
                setAlbums(data)
            }
        }
        const getAlbumInfo = async () => {
            const response = await fetch(`${getServerUrl()}/api/albums/getAlbum`, {
                method: 'POST',
                headers: {
                    'Authorization': getAccessToken(),
                },
                body: JSON.stringify({
                    id: selectedAlbum.ID,
                }),
            })
            const data = await response.json()
            if (data.error) {
                showError(data.error)
            } else {
                setSelectedAlbum(data)
            }
        }
        const reconstructPath = async () => {
            if (!selectedAlbum?.ID) {
                setCurrentPath(['gallery'])
                return
            }

            const pathSegments = []
            let albumTemp = selectedAlbum

            while (albumTemp) {
                if (albumTemp.Title) {
                    pathSegments.unshift(albumTemp.Title)
                }

                const parentId = albumTemp.ParentID ?? albumTemp.parentID ?? ''
                if (!parentId) {
                    break
                }

                const response = await fetch(`${getServerUrl()}/api/albums/getAlbum`, {
                    method: 'POST',
                    headers: {
                        'Authorization': getAccessToken(),
                    },
                    body: JSON.stringify({
                        id: parentId,
                    }),
                })

                const data = await response.json()
                if (data.error) {
                    showError(data.error)
                    break
                }

                if (!data?.ID || data.ID === albumTemp.ID) {
                    break
                }

                albumTemp = data
            }
            pathSegments.unshift("gallery")

            setCurrentPath(pathSegments)
        }
        if (selectedAlbum && selectedAlbum.fetchinfo) {
            getAlbumInfo()
        }
        getAlbum()
        reconstructPath()
    }, [selectedAlbum])
    return (
        <div className="flex flex-row gap-2 border border-[#2B2B2B] rounded-lg p-2 cursor-pointer" onClick={() => {
            setFilePickerOpen(true)
        }}>
            <File className="w-6 h-6" />
            <p className="text-white red-hat-mono">{selectedFile?.name || 'No image selected'}</p>
            <Modal open={filePickerOpen} onOpenChange={setFilePickerOpen} title="Select File">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-2 items-center justify-start">
                        <ArrowLeft className="w-6 h-6 cursor-pointer" onClick={() => {
                            setSelectedAlbum({ ID: selectedAlbum.ParentID, fetchinfo: true })
                        }} />
                        <p className="text-white red-hat-mono">{currentPath.join(' / ')}</p>
                    </div>
                    {albums.map((album) => (
                        <div key={album.ID} className="flex flex-row gap-2 cursor-pointer hover:bg-[#2B2B2B] rounded-md p-2 border border-[#2B2B2B]" onClick={() => {
                            setSelectedAlbum(album)
                        }}>
                            <Folder className="w-6 h-6" />
                            <p className="text-white red-hat-mono">{album.Title}</p>
                        </div>
                    ))}
                    <hr className="border-[#2B2B2B] my-2" />
                    {media.length === 0 && (
                        <p className="text-white red-hat-mono">No media found</p>
                    )}
                    {media.length > 0 && (
                        <div className="flex flex-col gap-2">
                            {media.map((m) => (
                                <div key={m.ID} className="flex flex-row gap-2 cursor-pointer hover:bg-[#2B2B2B] rounded-md p-2 border border-[#2B2B2B]">
                                    <File className="w-6 h-6" />
                                    <p className="text-white red-hat-mono">{m.Title}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    )
}