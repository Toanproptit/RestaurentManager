import { useState } from 'react'
import LoginForm from '../components/LoginForm'
import { useNavigate } from 'react-router-dom'
import { login } from '../auth/mock'

function Login() {
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (data) => {
    console.log("Bắt đầu login", data)

    try {
      const user = await login(data)
      console.log("Login success", user)

      localStorage.setItem('user', JSON.stringify(user))
      console.log("Đã đăng nhập")

      if (user.role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else if (user.role === "STAFF") {
        navigate("/staff", { replace: true });
      } else {
        // fallback an toàn
        navigate("/login");
      }
    } catch (err) {
      console.error("Login fail:", err)
      setError(err)
    }
  }


  return (
    <LoginForm onSubmit={handleLogin} error={error} />
  )
}

export default Login
