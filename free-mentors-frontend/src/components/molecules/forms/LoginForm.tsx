import { useState, FormEvent, ChangeEvent } from 'react'

interface LoginFormData {
  username: string
  password: string
}

export const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: ''
  })

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Login logic
    console.log('Login attempt', formData)
  }

  return (
    <div className="min-h-screen flex font-onest">
      {/* Left Side - Blue Background */}
      <div className="w-1/2 bg-primary flex items-center justify-center relative overflow-hidden">
        <div className="text-white text-center z-10 px-12">
          <h1 className="text-4xl font-bold mb-4">Free Mentors</h1>
          <p className="text-white/80">
            Connect with experienced professionals and accelerate your career growth
          </p>
        </div>

        {/* Background Decorative Elements */}
        <div 
          className="
            absolute 
            top-0 
            left-0 
            w-full 
            h-full 
            opacity-20 
            bg-gradient-to-br 
            from-primary-light 
            to-primary-dark
          "
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-1/2 bg-white flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-2 text-text-primary">
            Login
          </h2>
          <p className="mb-8 text-text-secondary text-sm">
            Enter your login credentials to access your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-4">
              <label 
                htmlFor="username" 
                className="block text-sm font-medium text-text-secondary mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="
                  w-full 
                  px-4 
                  py-3 
                  border 
                  border-gray-300 
                  rounded-custom 
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-primary 
                  focus:border-transparent
                  text-sm
                "
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="mb-2">
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-text-secondary mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="
                  w-full 
                  px-4 
                  py-3 
                  border 
                  border-gray-300 
                  rounded-custom 
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-primary 
                  focus:border-transparent
                  text-sm
                "
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="flex justify-end mb-6">
              <a 
                href="/forgot-password" 
                className="
                  text-sm 
                  text-primary 
                  hover:underline 
                  transition-colors
                "
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="
                w-full 
                bg-primary 
                text-white 
                py-3 
                rounded-custom 
                hover:bg-primary-dark 
                transition-colors 
                font-semibold 
                text-sm
              "
            >
              Login
            </button>
          </form>

          <div className="border-t my-6 border-gray-300 relative">
            <span 
              className="
                absolute 
                left-1/2 
                top-1/2 
                transform 
                -translate-x-1/2 
                -translate-y-1/2 
                bg-white 
                px-4 
                text-text-muted 
                text-sm
              "
            >
              Or
            </span>
          </div>

          <div className="text-center">
            <p className="text-text-secondary text-sm mb-4">
              Don't have an account?
            </p>
            <a 
              href="/register"
              className="
                w-full 
                inline-block 
                border 
                border-primary 
                text-primary 
                py-3 
                rounded-custom 
                hover:bg-secondary 
                transition-colors 
                font-semibold 
                text-sm
              "
            >
              Open account
            </a>
          </div>

          <div className="text-center mt-8 text-xs text-text-muted">
            <p>
              By logging in, you agree to our{' '}
              <a 
                href="/terms" 
                className="text-primary hover:underline"
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a 
                href="/privacy" 
                className="text-primary hover:underline"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}