import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function SignupPage() {
  const [type, setType] = useState('client')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const { signup } = useAuthStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const defaultType = searchParams.get('type') || 'client'

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSignup = async (e) => {
    e.preventDefault()

    if (!formData.email || !formData.password || !formData.name) {
      toast.error('Preencha todos os campos')
      return
    }

    if (formData.password.length < 8) {
      toast.error('Senha deve ter mínimo 8 caracteres')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Senhas não coincidem')
      return
    }

    setIsLoading(true)
    try {
      await signup(formData.email, formData.password, {
        type,
        name: formData.name
      })

      if (type === 'expert') {
        toast.success('Conta criada! Agora complete seu perfil')
        navigate('/onboarding')
      } else {
        toast.success('Conta criada com sucesso!')
        navigate('/marketplace')
      }
    } catch (error) {
      toast.error(error.message || 'Erro ao criar conta')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 px-4 py-12">
        <div className="max-w-md mx-auto card">
          <h1 className="text-3xl font-bold text-center mb-2 text-primary">Criar Conta</h1>
          <p className="text-center text-gray-600 mb-8">
            Junte-se ao Saber Vivo Club
          </p>

          {/* Type Toggle */}
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setType('client')}
              className={`flex-1 py-2 rounded-lg font-semibold transition ${
                type === 'client'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-primary hover:bg-gray-200'
              }`}
            >
              Sou Cliente
            </button>
            <button
              onClick={() => setType('expert')}
              className={`flex-1 py-2 rounded-lg font-semibold transition ${
                type === 'expert'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-primary hover:bg-gray-200'
              }`}
            >
              Sou Especialista
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="name">Nome Completo</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="João Silva"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 8 caracteres"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword">Confirmar Senha</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirme sua senha"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Criando conta...' : 'Criar Conta'}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Já tem conta?{' '}
            <a href="/login" className="text-primary font-semibold hover:text-accent">
              Entrar aqui
            </a>
          </p>

          {/* Info for Experts */}
          {type === 'expert' && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
              ✨ Você terá 35 dias grátis após aprovação do perfil. Depois, escolha um plano.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
