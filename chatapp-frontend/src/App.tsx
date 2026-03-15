
import './App.css'
import {  Routes, Route } from 'react-router-dom'
import LandingPage from './Pages/LandingPage'
import LoginPages from './Pages/LoginPage'
import RegisterPage from './Pages/RegisterPage'
import ChatHomePage from './Pages/HomePage'
// import ProtectedRoute from './api/ProtectedRoute'

function App() {

  return (
    <Routes>
      <Route path='/' element={<LandingPage/>} />
      <Route path='/login' element={<LoginPages/>} />
      <Route path='/register' element={<RegisterPage/>} />
      {/* Protected Route */}
      <Route
        path="/homepage"
        element={
          
            <ChatHomePage />
          
        }
      />
    </Routes>
    
  )
}

export default App
