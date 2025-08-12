import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}users/login`,
        { email, password }
      );
      const data = await response.data;
      dispatch(setToken(data));
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error: unknown) {
      const errorMessage =
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message?: string }).message
          : "An error occurred";
      toast.error(`Login failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}users/register`, {
        name,
        email,
        password,
        role: "employee",
      });
      toast.success("Account created! Please log in.");
      setIsLogin(true);
      setName("");
      setEmail("");
      setPassword("");
    } catch (error: unknown) {
      const errorMessage =
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message?: string }).message
          : "An error occurred";
      toast.error(`Signup failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-purple-50 to-purple-100 p-10">

      <div className="hidden md:flex flex-col justify-center w-1/2 bg-gradient-to-tr from-purple-700 to-purple-500 text-white p-16 rounded-l-3xl relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-purple-400 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-300 rounded-full blur-3xl opacity-50"></div>

        <h1 className="text-4xl font-extrabold mb-10 drop-shadow-lg">
          Welcome to Your Employee Dashboard
        </h1>
        <p className="mb-10 text-lg leading-relaxed drop-shadow max-w-md">
          Manage your work efficiently with powerful features:
        </p>
        <div className="flex justify-center ">

          <div className="grid grid-cols-2 gap-6 max-w-md">
            {[{
              title: "Sorting & Filtering",
              desc: "Quickly find what you need by sorting and filtering data."
            }, {
              title: "Powerful Search",
              desc: "Instantly search through records with smart search features."
            }, {
              title: "Editing & Updates",
              desc: "Easily edit and update employee details in real time."
            }, {
              title: "Role Management",
              desc: "Manage employee roles and control access levels securely."
            }].map(({ title, desc }, i) => (
              <div
                key={i}
                className="rounded-xl p-6 cursor-pointer bg-white/14 backdrop-blur-md shadow-md transition transform duration-300 ease-in-out hover:shadow-lg hover:scale-[1.04]"
              >
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-sm opacity-90">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>





      {/* Right Side - Auth Form */}
      <div className="flex flex-col justify-center w-full md:w-1/2 bg-white shadow-xl rounded-r-3xl p-10 max-w-md  relative">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-gray-500 text-center mb-8">
          {isLogin
            ? "Test Credentials: admin@example.com / admin123"
            : "Sign up to get started"}
        </p>

        <form
          className="space-y-6"
          onSubmit={isLogin ? handleLogin : handleSignup}
        >
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring focus:ring-purple-100 outline-none transition"
                disabled={loading}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring focus:ring-purple-100 outline-none transition"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring focus:ring-purple-100 outline-none transition"
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-lg transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-grow h-px bg-gray-200"></div>
          <span className="px-3 text-gray-400 text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-200"></div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-purple-600 hover:underline font-medium"
                type="button"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-purple-600 hover:underline font-medium"
                type="button"
              >
                Log in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
