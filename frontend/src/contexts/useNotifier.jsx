import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react'

const NotifierContext = createContext()

export const useNotifier = () => {
    const context = useContext(NotifierContext)
    if (!context) {
        throw new Error('useNotifier must be used within a NotifierProvider')
    }
    return context
}

export const NotifierProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([])

    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, [])

    const addNotification = useCallback((message, type = 'info', duration = 5000) => {
        const id = Date.now() + Math.random()
        setNotifications((prev) => [...prev, { id, message, type, duration }])
    }, [])

    const showError = useCallback((message, duration = 5000) => {
        addNotification(message, 'error', duration)
    }, [addNotification])

    const showSuccess = useCallback((message, duration = 3000) => {
        addNotification(message, 'success', duration)
    }, [addNotification])

    const showInfo = useCallback((message, duration = 3000) => {
        addNotification(message, 'info', duration)
    }, [addNotification])

    const showUpdate = useCallback((message, duration = 3000) => {
        addNotification(message, 'info', duration)
    }, [addNotification])

    return (
        <NotifierContext.Provider value={{ showError, showSuccess, showInfo, showUpdate }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
                {notifications.map((notification) => (
                    <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onClose={() => removeNotification(notification.id)}
                    />
                ))}
            </div>
        </NotifierContext.Provider>
    )
}

const NotificationItem = ({ notification, onClose }) => {
    const { message, type, duration } = notification
    const [isExiting, setIsExiting] = useState(false)

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                setIsExiting(true)
            }, duration)
            return () => clearTimeout(timer)
        }
    }, [duration])

    useEffect(() => {
        if (isExiting) {
            const timer = setTimeout(() => {
                onClose()
            }, 300) // Match animation duration
            return () => clearTimeout(timer)
        }
    }, [isExiting, onClose])

    const getIcon = () => {
        switch (type) {
            case 'error':
                return <AlertCircle className="w-5 h-5 text-red-500" />
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-500" />
            default:
                return <Info className="w-5 h-5 text-blue-500" />
        }
    }

    const getBorderColor = () => {
        switch (type) {
            case 'error':
                return 'border-red-500/50'
            case 'success':
                return 'border-green-500/50'
            default:
                return 'border-[#2B2B2B]'
        }
    }

    return (
        <div
            className={`
        pointer-events-auto
        flex items-center gap-3 
        bg-[#141414] border ${getBorderColor()} 
        px-4 py-3 rounded-md shadow-lg 
        min-w-[300px] max-w-[400px]
        transition-all duration-300 ease-in-out
        ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
      `}
        >
            {getIcon()}
            <p className="text-white red-hat-text text-sm flex-1">{message}</p>
            <button
                onClick={() => setIsExiting(true)}
                className="text-gray-400 hover:text-white transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    )
}

