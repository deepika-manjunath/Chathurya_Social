import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()

    if (!username.trim() || !password) {
      alert("Please enter both username and password")
      return
    }

    try {
      setLoading(true)

      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username: username.trim(),
        password
      })

      // Save JWT token
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("user", JSON.stringify(res.data.user))

      setLoading(false)

      // Redirect to dashboard
      navigate("/dashboard")

    } catch (error) {
      setLoading(false)

      // Show backend error message
      alert(error.response?.data?.message || "Login failed")
    }
  }

  return (
    <div className="min-h-screen bg-base-200">

      <div className="flex items-center justify-center min-h-screen">

        <div className="card w-96 bg-base-100 shadow-xl">

          <div className="card-body">

            <h2 className="card-title text-2xl justify-center">
              Login to continue
            </h2>

            <form onSubmit={handleLogin} className="space-y-3 mt-4">

              <input
                type="text"
                placeholder="Username"
                className="input input-bordered w-full"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                className="input input-bordered w-full"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />

              <button
                type="submit"
                className="btn btn-primary w-full mt-2"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

            </form>

            <p className="text-center text-sm mt-3">
              New member?
              <Link to="/register" className="text-primary ml-1">
                Register here
              </Link>
            </p>

          </div>

        </div>

      </div>

    </div>
  )
}