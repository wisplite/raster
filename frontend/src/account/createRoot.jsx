import { useState } from 'react'
import { getServerUrl } from '../hooks/getConstants'
import { useNavigate } from 'react-router-dom'
import { useNotifier } from '../contexts/useNotifier'

export default function CreateRootUser() {
    const navigate = useNavigate()
    const { showError, showSuccess } = useNotifier()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const handleCreateRootUser = async () => {
        const response = await fetch(`${getServerUrl()}/api/user/createUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        })
        const data = await response.json()
        if (data.error) {
            showError(data.error)
        } else {
            const rootResponse = await fetch(`${getServerUrl()}/api/user/setRootUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                }),
            })
            const rootData = await rootResponse.json()
            if (rootData.error) {
                showError(rootData.error)
            } else {
                navigate('/gallery')
                showSuccess('Root user created successfully')
            }
        }
    }
    return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-[#141414]">
            <div className="flex flex-col w-full max-w-md px-8">
                <div className="flex flex-col gap-8 border border-[#2B2B2B] rounded-lg p-8 bg-[#1a1a1a]">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold text-white red-hat-mono">Create Root User</h1>
                        <p className="text-sm text-gray-400 red-hat-text">This is the primary user account for Raster. Make sure to remember your credentials.</p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-400 red-hat-mono">Username</label>
                            <input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                type="text"
                                placeholder="Enter username"
                                className="w-full px-3 py-2.5 bg-[#141414] border border-[#2B2B2B] rounded-md text-white placeholder-gray-600 focus:outline-none focus:border-[#3B3B3B] transition-colors red-hat-text"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-400 red-hat-mono">Password</label>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                placeholder="Enter password"
                                className="w-full px-3 py-2.5 bg-[#141414] border border-[#2B2B2B] rounded-md text-white placeholder-gray-600 focus:outline-none focus:border-[#3B3B3B] transition-colors red-hat-text"
                            />
                        </div>
                    </div>

                    <button className="w-full py-2.5 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition-colors red-hat-mono cursor-pointer" onClick={handleCreateRootUser}>
                        Create
                    </button>
                </div>
            </div>
        </div>
    )
}