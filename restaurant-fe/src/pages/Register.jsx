import RegisterForm from '../components/auth/RegisterForm'
import { useNavigate } from 'react-router-dom'
import { registerApi } from '../service/authservice'

function Register() {
  const navigate = useNavigate()

  const handleRegister = async (data) => {
    await registerApi(data)
    navigate('/login')
  }

  return <RegisterForm onSubmit={handleRegister} />

}

export default Register
