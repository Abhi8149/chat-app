import './App.css'
import { SignUp } from './Authintication/SignUp'
import { Routes,Route } from 'react-router-dom'
function App() {

  return (
    <>
    <Routes>
     <Route path="/signup"  element={<SignUp/>}/>
    </Routes>
    </>
  )
}

export default App
