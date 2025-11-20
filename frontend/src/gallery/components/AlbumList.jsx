import { PlusIcon } from 'lucide-react'
import AlbumCreateModal from './AlbumCreateModal'
import { useState } from 'react'
export default function AlbumList() {
    const [open, setOpen] = useState(false)
    return (
        <div className="flex flex-col items-center justify-start h-full w-full bg-[#141414]">
            <div className="flex flex-row items-center justify-between gap-2 w-full px-6 py-4">
                <h1 className="text-xl font-bold text-white red-hat-mono">Albums</h1>
                <PlusIcon className="w-6 h-6 cursor-pointer" color="white" onClick={() => setOpen(true)} />
            </div>
            <AlbumCreateModal open={open} onOpenChange={setOpen} />
        </div>
    )
}