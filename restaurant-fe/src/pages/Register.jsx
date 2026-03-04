import { register } from '../auth/mock'
import RegisterForm from '../components/auth/RegisterForm'
import { useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()

  const handleRegister = async (data) => {
    await register(data)
    navigate('/login')
  }

  return <RegisterForm onSubmit={handleRegister} />
  
}

export default Register
