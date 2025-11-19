import { createContext, useContext, useState } from 'react'
import { getServerUrl } from '../hooks/getConstants'

const AccountContext = createContext()

export const AccountProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null)
    const [user, setUser] = useState(null)

    const login = async (username, password) => {
        const response = await fetch(`${getServerUrl()}/api/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
        const data = await response.json()
        if (data.error) {
            throw new Error(data.error)
        } else {
            setAccessToken(data.accessToken)
            localStorage.setItem('accessToken', data.accessToken)
            fetchUserData(data.accessToken)
            return true
        }
    }

    const fetchUserData = async (accessToken) => {
        if (!accessToken) {
            accessToken = getAccessToken()
            if (!accessToken) {
                setUser(null)
                return false
            }
        }
        const response = await fetch(`${getServerUrl()}/api/user/getUserData`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        })
        const data = await response.json()
        console.log(data)
        if (data.error) {
            throw new Error(data.error)
        } else {
            setUser(data.userData)
            return true
        }
    }

    const logout = () => {
        setAccessToken(null)
        localStorage.removeItem('accessToken')
        location.reload()
    }

    const getAccessToken = () => {
        if (!accessToken && localStorage.getItem('accessToken')) {
            setAccessToken(localStorage.getItem('accessToken'))
            return localStorage.getItem('accessToken')
        }
        return accessToken
    }

    return <AccountContext.Provider value={{ getAccessToken, logout, login, fetchUserData, user }}>{children}</AccountContext.Provider>
}

export const useAccount = () => {
    const context = useContext(AccountContext)
    if (!context) {
        throw new Error('useAccount must be used within an AccountProvider')
    }
    return context
}