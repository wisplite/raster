export default function MetadataPanel({ mediaItem }) {
    if (!mediaItem) return <div className="w-80 bg-[#1A1A1A] h-full border-l border-[#2B2B2B] p-4 text-white">Loading...</div>

    return (
        <div className="w-80 bg-[#1A1A1A] h-full border-l border-[#2B2B2B] p-6 text-white overflow-y-auto flex-shrink-0">
            <h2 className="text-xl font-bold mb-6 red-hat-mono break-words">{mediaItem.Title}</h2>

            <div className="space-y-6">
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Details</h3>
                    <div className="bg-[#222] rounded p-3 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Type</span>
                            <span className="text-white">{mediaItem.Type || 'Unknown'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Size</span>
                            {/* Placeholder for size formatting if not available */}
                            <span className="text-white">{mediaItem.Metadata?.fileSize ? (mediaItem.Metadata.fileSize / 1024 / 1024).toFixed(2) + ' MB' : 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Uploaded</span>
                            <span className="text-white">{mediaItem.CreatedAt ? new Date(mediaItem.CreatedAt).toLocaleDateString() : '-'}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">EXIF Data</h3>
                    <p className="text-xs text-gray-500 italic">Metadata editing not yet implemented.</p>
                    {/* Placeholder for EXIF data */}
                    <div className="bg-[#222] rounded p-3 space-y-2 text-sm opacity-50">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Camera</span>
                            <span className="text-white">-</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">ISO</span>
                            <span className="text-white">-</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Aperture</span>
                            <span className="text-white">-</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

