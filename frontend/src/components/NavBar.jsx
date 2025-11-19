import { Link } from 'react-router-dom'
import { ChevronDown, LogIn, LogOut, UserIcon } from 'lucide-react'
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
                            {item}
                        </Link>
                        {index !== path.length - 1 && <p className="text-white">/</p>}
                    </div>
                ))}
            </div>
            <div className="flex flex-row items-center justify-start gap-2">
                <Popover.Root open={open} onOpenChange={setOpen}>
                    <Popover.Trigger className="flex flex-row items-center justify-start gap-0 cursor-pointer">
                        <UserIcon className="w-6 h-6 text-white cursor-pointer" />
                        <ChevronDown className={`w-4 h-4 text-white ${open ? 'rotate-180' : ''}`} />
                    </Popover.Trigger>
                    <Popover.Content align="end" sideOffset={8}>
                        <div className="flex flex-col items-center justify-start gap-2 bg-[#141414] border px-4 py-2 border-[#2B2B2B] rounded-md p-2  ">
                            <p className="text-white red-hat-text">Logged in as: {user?.Username || 'Guest'}</p>
                            <hr className="w-full border-[#2B2B2B]" />
                            {user ? (
                                <div className="flex flex-row items-center justify-start gap-2">
                                    <p className="text-white cursor-pointer red-hat-text" onClick={logout}>Log Out</p>
                                    <LogOut className="w-4 h-4 text-white cursor-pointer" onClick={logout} />
                                </div>
                            ) : (
                                <div className="flex flex-row items-center justify-start gap-2">
                                    <Link to="/login" className="text-white red-hat-text">Log In</Link>
                                    <LogIn className="w-4 h-4 text-white cursor-pointer" />
                                </div>
                            )}
                        </div>
                    </Popover.Content>
                </Popover.Root>
            </div>
        </div>
    )
}