import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

export default function Register() {
  const [username, setUsername] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleRegister(e) {
    e.preventDefault()

    if (!username.trim() || !name.trim() || !email.trim() || !password) {
      alert("Please fill all fields")
      return
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    try {
      setLoading(true)
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        username: username.trim(),
        name: name.trim(),
        email: email.trim(),
        password
      })

      setLoading(false)
      alert(`User created! Your Member ID: ${res.data.memberId}`)
      navigate("/") // redirect to login

    } catch (error) {
      setLoading(false)
      alert(error.response?.data?.message || "Registration failed")
    }
  }

  return (
    <div className="min-h-screen bg-base-200">

      <div className="flex items-center justify-center min-h-screen">

        <div className="card w-96 bg-base-100 shadow-xl">

          <div className="card-body">

            <h2 className="card-title text-2xl justify-center">
              Join the Community
            </h2>

            <form onSubmit={handleRegister} className="space-y-3 mt-4">

              <input
                type="text"
                placeholder="Username"
                className="input input-bordered w-full"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />

              <input
                type="text"
                placeholder="Full Name"
                className="input input-bordered w-full"
                value={name}
                onChange={e => setName(e.target.value)}
              />

              <input
                type="email"
                placeholder="Email"
                className="input input-bordered w-full"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                className="input input-bordered w-full"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />

              <input
                type="password"
                placeholder="Confirm Password"
                className="input input-bordered w-full"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />

              <button
                type="submit"
                className="btn btn-primary w-full mt-2"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>

            </form>

            <p className="text-center text-sm mt-3">
              Already a member?
              <Link to="/" className="text-primary ml-1">
                Login here
              </Link>
            </p>

          </div>

        </div>

      </div>

    </div>
  )
}