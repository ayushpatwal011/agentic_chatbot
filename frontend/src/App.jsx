import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Landing from './pages/Landing'
import getCurrentUser from './features/getCurrentUser'
import { useDispatch } from 'react-redux'
import { setUserdata } from './redux/userSlice'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    document.documentElement.classList.remove('dark')
    localStorage.removeItem('theme')
  }, [])

  useEffect(() => {
    const getUser = async () => {
      const data = await getCurrentUser()
      dispatch(setUserdata(data))    
    }
    getUser()
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  )
};

export default App;
