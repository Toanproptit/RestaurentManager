const users = [
  {
    id: 1,
    user:"Toan",
    email: 'admin@gmail.com',
    password: '123456',
    role: 'STAFF'
  },
  {
    id: 2,
    user: 'admin',
    email: 'Admin@gmail.com',
    password: 'admin',
    role: 'ADMIN'
  }
]

export const login = ({ username, password }) => {
  const user = users.find(
    u => u.user === username && u.password === password
  )

  if (!user) {
    return Promise.reject('Email hoặc mật khẩu sai')
  }

  return Promise.resolve({
    id: user.id,
    email: user.email,
    role: user.role,
    token: 'fake-jwt-token'
  })
}

export const register = ({ email, password }) => {
  return Promise.resolve({
    id: Date.now(),
    email,
    role: 'STAFF'
  })
}