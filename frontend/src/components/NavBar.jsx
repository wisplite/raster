import { Link } from 'react-router-dom'
import { ChevronDown, LogIn, LogOut, UserIcon, Settings } from 'lucide-react'
import * as Popover from '@radix-ui/react-popover'
import { useState } from 'react';
import { useAccount } from '../contexts/useAccount';
export default function NavBar({ path }) {
    const [open, setOpen] = useState(false);
    const { user, logout } = useAccount();
    return (
        <div className="flex flex-row items-center justify-between h-1/10 w-full px-6 py-2 border-b border-[#2B2B2B]">
            <div className="flex flex-row items-center justify-start gap-2">
                {path.map((item, index) => (
                    <div className="flex flex-row items-center justify-start gap-2 red-hat-mono">
                        <Link to={`/${path.slice(0, index + 1).join('/')}`} key={item} className={`text-white ${index === path.length - 1 ? 'font-bold' : ''}`}>
                            {decodeURIComponent(item)}
                        </Link>
                        {index !== path.length - 1 && <p className="text-white red-hat-mono">/</p>}
                    </div>
                ))}
            </div>

            <div className="flex flex-row items-center justify-start gap-2">
                <Popover.Root open={open} onOpenChange={setOpen}>
                    <Popover.Trigger className="flex flex-row items-center justify-start gap-0 cursor-pointer">
                        <UserIcon className="w-6 h-6 text-white cursor-pointer" />
                        {/* <ChevronDown className={`w-4 h-4 text-white ${open ? 'rotate-180' : ''}`} /> */}
                    </Popover.Trigger>
                    <Popover.Content align="end" sideOffset={8} className="w-56 z-50">
                        <div className="flex flex-col bg-[#141414] border border-[#2B2B2B] rounded-lg shadow-xl overflow-hidden">
                            <div className="px-4 py-3 border-b border-[#2B2B2B] bg-[#1A1A1A]">
                                <p className="text-xs text-gray-400 mb-0.5 font-medium red-hat-mono">Signed in as</p>
                                <p className="text-sm text-white font-bold truncate red-hat-text">{user?.Username || 'Guest'}</p>
                            </div>

                            <div className="p-1.5 flex flex-col gap-0.5">
                                {user ? (
                                    <>
                                        <button className="flex items-center gap-3 px-3 py-2 w-full text-left text-sm text-gray-300 hover:text-white hover:bg-[#2B2B2B] rounded-md transition-all group cursor-pointer">
                                            <Settings className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                                            <span className="font-medium red-hat-text">Settings</span>
                                        </button>

                                        <button
                                            onClick={logout}
                                            className="flex items-center gap-3 px-3 py-2 w-full text-left text-sm text-gray-300 hover:text-white hover:bg-[#2B2B2B] rounded-md transition-all group cursor-pointer"
                                        >
                                            <LogOut className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                                            <span className="font-medium red-hat-text">Sign Out</span>
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        to="/login"
                                        className="flex items-center gap-3 px-3 py-2 w-full text-left text-sm text-gray-300 hover:text-white hover:bg-[#2B2B2B] rounded-md transition-all group cursor-pointer"
                                    >
                                        <LogIn className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                                        <span className="font-medium red-hat-text">Sign In</span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </Popover.Content>
                </Popover.Root>
            </div>
        </div>
    )
}