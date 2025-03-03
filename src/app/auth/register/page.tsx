"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";

interface RegisterForm {
  username: string;
  email: string;
  phone_number: string;
  password: string;
  confirm_password: string;
  rememberMe: boolean;
}

export default function Register() {
  const BaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();
  const searchParams = useSearchParams();

  const isLandlord = searchParams.get("is_landlord") === "true";
  const isRenter = searchParams.get("is_renter") === "true";

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik<RegisterForm>({
    initialValues: {
      username: "",
      email: "",
      phone_number: "",
      password: "",
      confirm_password: "",
      rememberMe: false,
    },
    validationSchema: Yup.object({
      username: Yup.string().min(3, "Must be at least 3 characters").required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
      phone_number: Yup.string()
        .matches(/^\d{10}$/, "Phone number must be 10 digits")
        .required("Required"),
      password: Yup.string().min(6, "Password must be at least 6 characters").required("Required"),
      confirm_password: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${BaseUrl}/auth/register/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: values.username.trim(),
            email: values.email.trim(),
            phone_number: values.phone_number.trim(),
            password: values.password,
            is_landlord: isLandlord,
            is_renter: isRenter,
          }),
        });

        const data = await res.json();
        console.log("Response Data:", data);

        if (!res.ok) {
          let errorMessage = "";
          if (data.errors) {
            if (data.errors.email) errorMessage += `Email: ${data.errors.email[0]}\n`;
            if (data.errors.username) errorMessage += `Username: ${data.errors.username[0]}\n`;
          }
          setError(errorMessage || "Registration failed. Please try again.");
        } else {
          if (values.rememberMe) {
            localStorage.setItem("rememberedEmail", values.email);
          } else {
            localStorage.removeItem("rememberedEmail");
          }
          router.push("/auth/login");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      formik.setFieldValue("email", savedEmail);
      formik.setFieldValue("rememberMe", true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <form
        onSubmit={formik.handleSubmit}
        className="border border-[#00C767] rounded-lg px-6 py-5 shadow-lg w-full max-w-sm bg-white space-y-4"
      >
        <div className="flex justify-center">
          <Image src="/Logo/longLogo.svg" width={150} height={200} alt="Welcome" />
        </div>
        <div className="text-center">
          <h1 className="text-xl font-semibold">Register</h1>
          <p className="text-xs text-gray-600">🚀 Join us and find your dream home!</p>
        </div>

        {/* Input Fields */}
        {["username", "email", "phone_number"].map((field) => (
          <div key={field} className="text-sm">
            <input
              type={field === "email" ? "email" : "text"}
              name={field}
              required
              value={formik.values[field as keyof RegisterForm] as string}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={field.replace("_", " ")}
              className="w-full border rounded-md py-2 px-3 text-sm focus:outline-none focus:border-green-400"
            />
            {formik.touched[field as keyof RegisterForm] && formik.errors[field as keyof RegisterForm] && (
              <p className="text-red-500 text-xs">{formik.errors[field as keyof RegisterForm]}</p>
            )}
          </div>
        ))}

        {/* Password Fields */}
        {[
          { name: "password", show: showPassword, setShow: setShowPassword },
          { name: "confirm_password", show: showConfirmPassword, setShow: setShowConfirmPassword },
        ].map(({ name, show, setShow }) => (
          <div className="relative text-sm" key={name}>
            <input
              type={show ? "text" : "password"}
              name={name}
              required
              value={formik.values[name as keyof RegisterForm] as string}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={name.replace("_", " ")}
              className="w-full border rounded-md py-2 px-3 pr-10 text-sm focus:outline-none focus:border-green-400"
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {show ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
            {formik.touched[name as keyof RegisterForm] &&
              formik.errors[name as keyof RegisterForm] && (
                <p className="text-red-500 text-xs">
                  {formik.errors[name as keyof RegisterForm]}
                </p>
              )}
          </div>
        ))}

        {/* Remember Me */}
        <div className="flex items-center text-xs">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formik.values.rememberMe}
            onChange={(e) => formik.setFieldValue("rememberMe", e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="rememberMe">Remember me</label>
        </div>

        {error && <p className="text-red-500 text-xs text-center whitespace-pre-line">{error}</p>}

        {/* Register Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#03624C] text-white py-2 rounded-md hover:bg-[#162a21] transition flex justify-center items-center"
        >
          {loading ? (
            <svg className="animate-spin h-4 w-4 mr-2 border-t-2 border-white rounded-full" viewBox="0 0 24 24"></svg>
          ) : (
            "Register"
          )}
        </button>

        <div className="text-center text-xs flex flex-col items-center">
          <p>or continue with</p>
          <button className="flex items-center justify-center p-2 bg-[#030F0F] text-white py-2 rounded-md">
            <FaGoogle size={16} />
          </button>
          <p>
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[#00C767]">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
