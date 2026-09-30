import { useState } from 'react'

import './App.css'

import type RegisterDto from './api/auth/dto/RegisterDto'
import { postRegisterUser } from './api/auth/AuthService';

function App() {

  const [registerData,setRegisterData] = useState<RegisterDto>();

  const registerNewUser = () => {
    let data: RegisterDto = {
      email: "user2@example.com",
      password: "stringst",
      username: "stringst2",
      firstName: "string",
      lastName: "string",
      birthDate: "2026-09-29",
      roles: ""
    }
    console.log(postRegisterUser(data));
  }

  console.log("BACKEND URL:", import.meta.env.VITE_URL_BASE_BACKEND);
  return (
    <>
      <button onClick={registerNewUser}>Test</button>
    </>
  )
}

export default App
