import AuthImage from '../../components/AuthImage'
import { getServerUrl } from '../../hooks/getConstants'

export default function ImageViewer({ albumId, mediaId, token, title }) {
    const src = `${getServerUrl()}/api/media/${albumId}/${mediaId}`

    return (
        <div className="flex-1 flex items-center justify-center bg-black relative overflow-hidden h-full">
            <AuthImage
                src={src}
                token={token}
                alt={title}
                className="max-w-full max-h-full object-contain"
            />
        </div>
    )
}

