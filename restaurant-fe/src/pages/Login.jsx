import { useState } from 'react'
import LoginForm from '../components/auth/LoginForm'
import { useNavigate } from 'react-router-dom'
import { loginApi } from '../service/authservice'
import { jwtDecode } from 'jwt-decode'

function Login() {
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async ({ username, password }) => {
    setError('')
    try {
      console.log({ username, password })
      const res = await loginApi({ username, password })
      console.log("Đăng nhập thành công:", res.data)

      const token = res.data.result.token
      // Lưu token vào localStorage
      localStorage.setItem('token', token)

      // Giải mã JWT để lấy role
      const decoded = jwtDecode(token)
      console.log("Token payload:", decoded)
      const role = decoded.scope

      // Navigate theo role
      if (role === 'ADMIN') {
        navigate('/admin', { replace: true })
      } else if (role === 'STAFF') {
        navigate('/staff', { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    } catch (err) {
      console.error("Đăng nhập thất bại:", err)
      setError(err.response?.data?.message || 'Đăng nhập thất bại')
    }
  }

  return (
    <LoginForm onSubmit={handleLogin} error={error} />
  )
}

export default Login
