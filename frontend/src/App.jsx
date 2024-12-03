import './App.css'
import { Routes,Route } from 'react-router-dom'
import Home from './Pages/Home'
import Signup from './Pages/Signup'
import Chat from './Pages/Chat'
import Login from './Pages/Login'
import Settings from './Pages/Settings'

function App() {
  return (
    <>
      <Routes>
        <Route path='/'element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/chat' element={<Chat/>}/>
        <Route path='/setting' element={<Settings/>}/>
      </Routes>
    </>
  )
}

export default App
