import Modal from '../../components/Modal'
import { getServerUrl } from '../../hooks/getConstants'
import { useAccount } from '../../contexts/useAccount'
import { useState } from 'react'
export default function AlbumCreateModal({ open, onOpenChange, trigger, parentId }) {
    const { getAccessToken } = useAccount()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const handleCreateAlbum = async () => {
        const response = await fetch(`${getServerUrl()}/api/albums/createAlbum`, {
            method: 'POST',
            headers: {
                'Authorization': getAccessToken(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                description: description,
                parentId: parentId
            })
        })
        const data = await response.json()
        if (data.error) {
            console.error(data.error)
        } else {
            onOpenChange(false)
        }
    }
    return (
        <Modal open={open} onOpenChange={onOpenChange} trigger={trigger} title="Create Album">
            <div className="flex flex-col gap-2">
                <input type="text" placeholder="Name" className="w-full px-3 py-2.5 bg-[#141414] border border-[#2B2B2B] rounded-md text-white placeholder-gray-600 focus:outline-none focus:border-[#3B3B3B] transition-colors red-hat-text" value={title} onChange={(e) => setTitle(e.target.value)} />
                <textarea type="text" placeholder="Description" className="w-full h-[20vh] px-3 py-2.5 bg-[#141414] border border-[#2B2B2B] rounded-md text-white placeholder-gray-600 focus:outline-none focus:border-[#3B3B3B] transition-colors red-hat-text resize-none" value={description} onChange={(e) => setDescription(e.target.value)} />
                <button className="w-full py-2.5 bg-[#2B2B2B] hover:bg-[#3B3B3B] text-white rounded-md font-medium transition-colors red-hat-mono cursor-pointer mt-2" onClick={handleCreateAlbum}>Create Album</button>
            </div>
        </Modal>
    )
}