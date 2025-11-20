import Modal from '../../components/Modal'
export default function AlbumCreateModal({ open, onOpenChange, trigger }) {
    return (
        <Modal open={open} onOpenChange={onOpenChange} trigger={trigger} title="Create Album">
            <div className="flex flex-col gap-2">
                <input type="text" placeholder="Name" className="w-full px-3 py-2.5 bg-[#141414] border border-[#2B2B2B] rounded-md text-white placeholder-gray-600 focus:outline-none focus:border-[#3B3B3B] transition-colors red-hat-text" />
                <textarea type="text" placeholder="Description" className="w-full h-[20vh] px-3 py-2.5 bg-[#141414] border border-[#2B2B2B] rounded-md text-white placeholder-gray-600 focus:outline-none focus:border-[#3B3B3B] transition-colors red-hat-text resize-none" />
                <button className="w-full py-2.5 bg-[#2B2B2B] hover:bg-[#3B3B3B] text-white rounded-md font-medium transition-colors red-hat-mono cursor-pointer mt-2">Create Album</button>
            </div>
        </Modal>
    )
}