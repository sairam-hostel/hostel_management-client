import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import img from "./sairam campus.jpg";
import logo from "./Sairam-instuition.png"
import api from "../../utils/api";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("student"); // "student" or "admin"
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (role === "admin") {
      setLoading(true);
      try {
        const response = await api.post("/bf1/auth/login", { email, password });
        const data = response.data;

        if (data.success) {
          console.log("Login successful:", data);
          localStorage.setItem('token', data.data.access_token);
          navigate("/admin");
        } else {
          setError(data.message || "Login failed.");
        }
      } catch (err) {
        console.error("Login error:", err);
        setError(err.response?.data?.message || "Login failed. Please check your credentials.");
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(true);
      try {
        const response = await api.post("/bs1/auth/login", { email, password });
        const data = response.data;

        console.log("Student Login successful:", data);

        // robustly find the token
        const token = data.access_token || data.data?.access_token || data.token;

        if (token) {
          localStorage.setItem('token', token);
          navigate("/student");
        } else {
          console.error("Token not found in response", data);
          setError("Login successful but token missing. Check console.");
        }
      } catch (err) {
        console.error("Student Login error:", err);
        setError(err.response?.data?.message || "Login failed. Please check your credentials.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <main className="flex h-screen w-full bg-gray-50">
      {/* Left Side - Image */}
      <div className="hidden lg:flex flex-[1.5] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <img
          src={img}
          alt="Sairam Campus"
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute bottom-10 left-10 z-20 text-white">
          <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
          <p className="text-lg opacity-90">Manage your hostel experience with ease.</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12 lg:p-24 bg-white relative">
        <div className="w-full max-w-md space-y-8">
          {/* Header & Logo */}
          <div className="text-center">
            <div className="mx-auto h-20 w-auto flex items-center justify-center mb-6">
              <img src={logo} alt="Sairam Logo" className="h-full object-contain" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Sign in to your account
            </h2>

            {/* Role Toggle */}
            <div className="mt-6 flex justify-center">
              <div className="bg-gray-100 p-1 rounded-lg inline-flex">
                <button
                  onClick={() => { setRole("student"); setError(""); }}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${role === "student"
                    ? "bg-white text-purple-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  Student
                </button>
                <button
                  onClick={() => { setRole("admin"); setError(""); }}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${role === "admin"
                    ? "bg-white text-purple-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  Admin
                </button>
              </div>
            </div>

            <p className="mt-4 text-sm text-gray-600">
              Or{" "}
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                contact support
              </a>{" "}
              if you have issues.
            </p>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                    placeholder={role === "admin" ? "admin@sairam.edu.in" : "student@sairam.edu.in"}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 cursor-pointer">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Sairam Institutions
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Version Number */}
        <div className="absolute bottom-4 right-4 text-xs text-gray-400">
          v1.0.0
        </div>
      </div>
    </main>
  );
};

export default Login;
