import { useState } from 'react'
import { useAccount } from '../contexts/useAccount'
import { useNavigate } from 'react-router-dom'
import { useNotifier } from '../contexts/useNotifier'
export default function Login() {
    const { showError } = useNotifier()
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { login } = useAccount()
    const handleLogin = () => {
        login(username, password)
            .then(() => {
                navigate('/gallery')
            })
            .catch((error) => {
                showError(error.message)
            })
    }
    return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-[#141414]">
            <div className="flex flex-col w-full max-w-md px-8">
                <div className="flex flex-col gap-8 border border-[#2B2B2B] rounded-lg p-8 bg-[#1a1a1a]">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold text-white red-hat-mono">Login</h1>
                        <p className="text-sm text-gray-400 red-hat-text">Enter your credentials to continue</p>
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

                    <button className="w-full py-2.5 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition-colors red-hat-mono cursor-pointer" onClick={handleLogin}>
                        Login
                    </button>
                </div>
            </div>
        </div>
    )
}