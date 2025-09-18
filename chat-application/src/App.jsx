import { Navigate, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Profile from "./pages/Profile"

import {Toaster} from 'react-hot-toast'
import { useContext } from "react"
import { AuthContext } from "./shopContext/AuthContext"
function App() {

const {authUser}=useContext(AuthContext);
console.log(authUser);
  return (
    <div className="bg-[url('./src/chat-app-assets/bgImage.svg')] bg-contain">
      <Toaster/>
        <Routes>
        <Route path='/' element={authUser?<Home/>:<Navigate to='/login'/>} />
        <Route path='/login' element={authUser?<Navigate to='/' />:<Login/>} />
        
        <Route path='/profile' element={authUser?<Profile/>:<Navigate to='/login'/>} />
      </Routes>
      
      
    </div>
  )
}

export default App
