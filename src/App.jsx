import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Signup from './pages/SignUp'
import Home from './pages/Home'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />  
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/expense-tracker" element={<Home />} />
    </Routes>
  )
}

export default App
