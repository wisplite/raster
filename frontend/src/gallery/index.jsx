import NavBar from '../components/NavBar'
import { useLocation } from 'react-router-dom';
import { useAccount } from '../contexts/useAccount';
import { useEffect } from 'react';
export default function Gallery() {
    const currentPath = useLocation().pathname;
    const pathList = currentPath.split('/').slice(1);
    const { fetchUserData, user } = useAccount()

    useEffect(() => {
        fetchUserData()
    }, [])

    return (
        <div className="flex flex-col items-center justify-start h-full w-full bg-[#141414]">
            <NavBar path={pathList} />
        </div>
    )
}