"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

interface LoginForm {
  email_or_username: string;
  password: string;
}

export default function Login() {
  const BaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();
  
  const [form, setForm] = useState<LoginForm>({ email_or_username: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  // Load saved credentials if "Remember Me" was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setForm((prev) => ({ ...prev, email_or_username: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const res = await fetch(`${BaseUrl}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email_or_username: form.email_or_username.trim(),
          password: form.password,
        }),
      });
  
      const data = await res.json();
      console.log("Response Data:", data); 
  
      if (!res.ok) {
        const errorMessage =
          data.email_or_username?.[0] || 
          data.password?.[0] || 
          data.detail || 
          "Login failed. Please check your credentials.";
        setError(errorMessage);
      } else if (data.access_token && data.refresh_token) {
        // Store tokens in localStorage
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);

        // Remember Me feature
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", form.email_or_username);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        router.push("/home"); // Redirect after login
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <form
        onSubmit={handleSubmit}
        className="md:border border-[#00C767] md:rounded-xl px-8 py-12 md:shadow-lg w-full max-w-md bg-[#F8F9FF] space-y-6"
      >
        <div className="flex justify-center">
          <Image src="/Logo/longLogo.svg" width={200} height={300} alt="Welcome" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Login here</h1>
          <p className="text-sm text-gray-600">✋ Welcome back, you&apos;ve been missed!</p>
        </div>
        <div className="relative">
          <input
            type="text"
            name="email_or_username"
            value={form.email_or_username}
            required
            onChange={handleInputChange}
            placeholder="Email/Username"
            className="peer w-full border rounded-md py-2 px-3 focus:outline-none focus:border-green-400"
          />
        </div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            required
            onChange={handleInputChange}
            placeholder="Password"
            className="peer w-full border rounded-md py-2 px-3 pr-10 focus:outline-none focus:border-green-400"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            className="mr-2"
          />
          <label htmlFor="rememberMe" className="text-sm text-gray-600">
            Remember me
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#03624C] text-white py-2 rounded-md hover:bg-[#162a21] transition flex justify-center items-center"
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 mr-3 border-t-2 border-white rounded-full"
              viewBox="0 0 24 24"
            ></svg>
          ) : (
            "Login"
          )}
        </button>

        <div className="text-center space-y-2 flex flex-col items-center">
          <p className="text-sm text-gray-600">or continue with</p>
          <button className="flex items-center justify-center space-x-2 bg-[#030F0F] text-white p-2 rounded-md">
            <FaGoogle size={20} />
          </button>
          <p className="text-sm text-gray-600">Don&apos;t have an account? <Link href="/auth/role" className="text-[#00C767]">Register</Link></p>
        </div>
      </form>
    </div>
  );
}
