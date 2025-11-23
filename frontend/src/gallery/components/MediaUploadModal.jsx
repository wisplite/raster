import Modal from '../../components/Modal'
import { useAccount } from '../../contexts/useAccount'
import { useState, useRef } from 'react'
import { X, Upload, FileImage, FileVideo, Trash2 } from 'lucide-react'
import { useNotifier } from '../../contexts/useNotifier'
import { getServerUrl } from '../../hooks/getConstants'
export default function MediaUploadModal({ open, onOpenChange, trigger, albumName, albumId }) {
    const { getAccessToken } = useAccount()
    const [files, setFiles] = useState([])
    const fileInputRef = useRef(null)
    const { showError, showSuccess } = useNotifier()
    const handleFileSelect = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).map(file => ({
                file,
                progress: 0,
                status: 'pending',
                id: Math.random().toString(36).substring(7)
            }))
            setFiles(prev => [...prev, ...newFiles])
        }
        // Reset input so the same file can be selected again if needed
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const removeFile = (id) => {
        setFiles(prev => prev.filter(f => f.id !== id))
    }

    const handleUpload = async () => {
        // Placeholder for server-side logic hook
        const performUpload = async (fileWrapper) => {
            // TODO: Implement actual server upload here
            // Example:
            // const formData = new FormData()
            // formData.append('file', fileWrapper.file)
            // formData.append('albumId', albumId)
            // await fetch('/api/upload', { method: 'POST', body: formData, ... })

            const formData = new FormData()
            formData.append('file', fileWrapper.file)
            formData.append('albumId', albumId)
            const response = await fetch(`${getServerUrl()}/api/media/uploadMedia`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': getAccessToken(),
                },
            })
            const data = await response.json()
            if (data.error) {
                showError(data.error)
            } else {
                setFiles(prev => prev.map(f => f.id === fileWrapper.id ? { ...f, status: 'completed' } : f))
                showSuccess('Media uploaded successfully')
            }
        }

        // Start uploads
        files.forEach(fileWrapper => {
            if (fileWrapper.status === 'pending') {
                performUpload(fileWrapper)
            }
        })
    }

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    return (
        <Modal open={open} onOpenChange={onOpenChange} trigger={trigger} title={`Upload to ${albumName || 'Album'}`}>
            <div className="flex flex-col gap-4">
                {/* File Selection Area */}
                <div
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#2B2B2B] rounded-lg cursor-pointer hover:border-[#3B3B3B] transition-colors bg-[#1A1A1A]"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-gray-400 text-sm font-medium red-hat-text">Click to select files</p>
                    <p className="text-gray-600 text-xs mt-1 red-hat-text">Images and Videos</p>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileSelect}
                    />
                </div>

                {/* File List */}
                {files.length > 0 && (
                    <div className="flex flex-col gap-2 max-h-[40vh] overflow-y-auto pr-1">
                        {files.map((fileWrapper) => (
                            <div key={fileWrapper.id} className="flex flex-col gap-2 bg-[#1A1A1A] p-3 rounded-md border border-[#2B2B2B]">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        {fileWrapper.file.type.startsWith('video') ? (
                                            <FileVideo className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                        ) : (
                                            <FileImage className="w-5 h-5 text-green-400 flex-shrink-0" />
                                        )}
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="text-white text-sm truncate red-hat-text" title={fileWrapper.file.name}>
                                                {fileWrapper.file.name}
                                            </span>
                                            <span className="text-gray-500 text-xs red-hat-mono">
                                                {formatFileSize(fileWrapper.file.size)}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFile(fileWrapper.id)}
                                        className="text-gray-500 hover:text-red-400 transition-colors p-1"
                                        disabled={fileWrapper.status === 'uploading'}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full h-1.5 bg-[#2B2B2B] rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-300 ${fileWrapper.status === 'completed' ? 'bg-green-500' :
                                            fileWrapper.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                                            }`}
                                        style={{ width: `${fileWrapper.progress}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Upload Button */}
                <button
                    className={`w-full py-2.5 bg-[#2B2B2B] text-white rounded-md font-medium transition-colors red-hat-mono ${files.length === 0 || files.every(f => f.status === 'completed')
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-[#3B3B3B] cursor-pointer'
                        }`}
                    onClick={handleUpload}
                    disabled={files.length === 0 || files.every(f => f.status === 'completed')}
                >
                    {files.some(f => f.status === 'uploading') ? 'Uploading...' : 'Upload Files'}
                </button>
            </div>
        </Modal>
    )
}
