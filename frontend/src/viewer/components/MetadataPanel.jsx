export default function MetadataPanel({ mediaItem, open, onOpenChange }) {
    if (!mediaItem) return <div className="w-80 bg-[#1A1A1A] h-full border-l border-[#2B2B2B] p-4 text-white">Loading...</div>
    const formatAperture = (aperture) => {
        const aperatureNumbers = aperture.toString().split('/')
        const numerator = aperatureNumbers[0]
        const denominator = aperatureNumbers[1]
        const fStop = numerator / denominator
        return fStop.toFixed(1)
    }
    return (
        <div className={`w-full md:w-80 bg-[#1A1A1A] h-72 md:h-full border-t md:border-t-0 md:border-l border-[#2B2B2B] p-6 text-white overflow-y-auto flex-shrink-0 ${open ? 'block' : 'hidden'}`}>
            <h2 className="text-xl font-bold mb-6 red-hat-display break-words">{mediaItem.Title}</h2>

            <div className="space-y-6">
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Details</h3>
                    <div className="bg-[#222] rounded p-3 space-y-2 text-sm red-hat-mono">
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
                        <div className="flex justify-between">
                            <span className="text-gray-500">Dimensions</span>
                            <span className="text-white">{mediaItem.Metadata?.width + 'x' + mediaItem.Metadata?.height || '-'}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-2 red-hat-mono">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">EXIF Data</h3>
                    <div className="bg-[#222] rounded p-3 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Camera</span>
                            <span className="text-white">{mediaItem.Metadata?.exif?.model.replaceAll('"', '') || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">ISO</span>
                            <span className="text-white">{mediaItem.Metadata?.exif?.iso || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Aperture</span>
                            <span className="text-white">{"f/" + formatAperture(mediaItem.Metadata?.exif?.aperture) || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Shutter Speed</span>
                            <span className="text-white">{mediaItem.Metadata?.exif?.exposureTime + 's' || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Focal Length</span>
                            <span className="text-white">{mediaItem.Metadata?.exif?.focalLength + 'mm' || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Lens</span>
                            <span className="text-white">{mediaItem.Metadata?.exif?.lensModel.replaceAll('"', '') || '-'}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-2 red-hat-mono">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Description</h3>
                    <div className="bg-[#222] rounded p-3 space-y-2 text-sm">
                        <p className="text-white">{mediaItem.Description || '-'}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

