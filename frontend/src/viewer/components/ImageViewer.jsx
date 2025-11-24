import AuthImage from '../../components/AuthImage'
import { getServerUrl } from '../../hooks/getConstants'
import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function ImageViewer({ albumId, mediaId, token, title }) {
    const src = `${getServerUrl()}/api/media/${albumId}/${mediaId}`
    const [loaded, setLoaded] = useState(false)

    return (
        <div className="flex-1 flex items-center justify-center bg-black relative overflow-hidden h-full">
            <AuthImage
                src={src}
                token={token}
                alt={title}
                className={`max-w-full max-h-full object-contain absolute ${loaded ? 'block' : 'hidden'}`}
                onLoad={() => {
                    setLoaded(true)
                }}
            />
            {/* loading image */}
            {!loaded && (
                <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center">
                    <AuthImage
                        src={`${getServerUrl()}/api/media/thumb/${albumId}/${mediaId}`}
                        token={token}
                        alt={title}
                        className="max-w-full max-h-full object-contain w-full h-full"
                    />
                    <Loader2 className="w-10 h-10 text-white animate-spin absolute bottom-5 right-5" />
                </div>
            )}
        </div>
    )
}

