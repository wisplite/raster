import NavBar from '../components/NavBar'
import { useLocation } from 'react-router-dom';
import { useAccount } from '../contexts/useAccount';
import { useEffect, useState } from 'react';
import AlbumList from './components/AlbumList';
import { getServerUrl } from '../hooks/getConstants';
import { useNotifier } from '../contexts/useNotifier';
export default function Gallery() {
    const currentPath = useLocation().pathname;
    const pathList = currentPath.split('/').slice(1);
    const currentAlbumName = pathList[pathList.length - 1];
    const [currentAlbumID, setCurrentAlbumID] = useState("!notfound!"); // set to impossible value to prevent client from fetching root album
    const { fetchUserData, user } = useAccount()
    const { getAccessToken } = useAccount()
    const { showError } = useNotifier()
    useEffect(() => {
        fetchUserData()
    }, [])

    useEffect(() => {
        const getCurrentAlbumID = async () => {
            console.log("currentAlbumName", currentAlbumName)
            console.log("pathList", pathList)
            if (currentAlbumName === 'gallery') {
                setCurrentAlbumID('');
                return;
            }
            const response = await fetch(`${getServerUrl()}/api/albums/getIDFromPath`, {
                method: 'POST',
                headers: {
                    'Authorization': getAccessToken(),
                },
                body: JSON.stringify({
                    path: decodeURIComponent(pathList.slice(1).join('/')),
                }),
            })
            const data = await response.json()
            if (data.error) {
                setCurrentAlbumID("!notfound!")
                showError('Album not found')
            } else {
                setCurrentAlbumID(data.id);
            }
        };
        getCurrentAlbumID();
    }, [currentPath]);

    useEffect(() => {
        console.log("currentAlbumID", currentAlbumID)
    }, [currentAlbumID])

    return (
        <div className="flex flex-col items-center justify-start h-full w-full bg-[#141414]">
            <NavBar path={pathList} />
            <AlbumList currentAlbumName={currentAlbumID} />
        </div>
    )
}