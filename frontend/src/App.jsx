import { Navigate, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Viewer from './viewer'
import Gallery from './gallery'
import Login from './account/login'
import { getServerUrl } from './hooks/getConstants'
import { useEffect } from 'react'
import CreateRootUser from './account/createRoot'
import { AccountProvider } from './contexts/useAccount'
import { NotifierProvider } from './contexts/useNotifier'

function RedirectHandler() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-[#141414]">
    </div>
  )
}

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  useEffect(() => {
    const checkRootUser = async () => {
      const response = await fetch(`${getServerUrl()}/api/user/rootUserExists`)
      const data = await response.json()
      if (data.exists) {
        // Only navigate to gallery if we're on the root path
        if (location.pathname === '/') {
          navigate('/gallery')
        }
      } else {
        // Always redirect to onboarding if root user doesn't exist
        if (location.pathname !== '/onboarding/createRootUser') {
          navigate('/onboarding/createRootUser')
        }
      }
    }
    checkRootUser()
  }, [location.pathname, navigate])
  return (
    <NotifierProvider>
      <AccountProvider>
        <Routes>
          <Route path="/" element={<RedirectHandler />} />
          <Route path="/gallery/*" element={<Gallery />} />
          <Route path="/viewer/:albumId/:mediaId" element={<Viewer />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding/createRootUser" element={<CreateRootUser />} />
        </Routes>
      </AccountProvider>
    </NotifierProvider>
  )
}

export default App
