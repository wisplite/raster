import Modal from '../../components/Modal'
import { getServerUrl } from '../../hooks/getConstants'
import { useAccount } from '../../contexts/useAccount'
import { useState, useEffect } from 'react'
import { useNotifier } from '../../contexts/useNotifier'
import FilePicker from './FilePicker'
export default function AlbumEditModal({ open, onOpenChange, trigger, id, startTitle, startDescription, currentAlbum }) {
    const { getAccessToken } = useAccount()
    const [title, setTitle] = useState(startTitle || '')
    const [description, setDescription] = useState(startDescription || '')
    const { showError } = useNotifier()
    const handleEditAlbum = async () => {
        const response = await fetch(`${getServerUrl()}/api/albums/editAlbum`, {
            method: 'POST',
            headers: {
                'Authorization': getAccessToken(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
                properties: {
                    title: title,
                    description: description,
                }
            })
        })
        const data = await response.json()
        if (data.error) {
            showError(data.error)
        } else {
            onOpenChange(false)
        }
    }
    useEffect(() => {
        if (open) {
            setTitle(startTitle || '')
            setDescription(startDescription || '')
        }
    }, [open])
    return (
        <Modal open={open} onOpenChange={onOpenChange} trigger={trigger} title="Edit Album">
            <div className="flex flex-col gap-2">
                <p className="text-white red-hat-mono">Name</p>
                <input type="text" placeholder="Name" className="w-full px-3 py-2.5 bg-[#141414] border border-[#2B2B2B] rounded-md text-white placeholder-gray-600 focus:outline-none focus:border-[#3B3B3B] transition-colors red-hat-text" value={title} onChange={(e) => setTitle(e.target.value)} />
                <p className="text-white red-hat-mono">Description</p>
                <textarea type="text" placeholder="Description" className="w-full h-[20vh] px-3 py-2.5 bg-[#141414] border border-[#2B2B2B] rounded-md text-white placeholder-gray-600 focus:outline-none focus:border-[#3B3B3B] transition-colors red-hat-text resize-none" value={description} onChange={(e) => setDescription(e.target.value)} />
                <p className="text-white red-hat-mono">Thumbnail</p>
                <FilePicker currentAlbum={currentAlbum} />
                <button className="w-full py-2.5 bg-[#2B2B2B] hover:bg-[#3B3B3B] text-white rounded-md font-medium transition-colors red-hat-mono cursor-pointer mt-2" onClick={handleEditAlbum}>Save Changes</button>
            </div>
        </Modal>
    )
}