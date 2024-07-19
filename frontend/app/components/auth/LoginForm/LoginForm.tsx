"use client";
import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema } from "@/schemas/loginSchema";
import { hide, unhide } from "@/utils/Icons";
import { useUserContext } from "@/context/userContext";
import Link from "next/link";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

  const { loginUser } = useUserContext();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (data: z.infer<typeof loginSchema>) => {
    await loginUser(data);
    return;
  });

  return (
    <div className="relative m-[2rem] px-10 py-14 rounded-lg bg-white w-full max-w-[520px]">
      <div className="relative z-10">
        <h1 className="mb-2 text-center text-[1.35rem] font-medium">
          Login to Your Account
        </h1>
        <p className="mb-8 px-[2rem] text-center text-[#999] text-[14px]">
          Login Now. Don't have an account?{" "}
          <a
            href="/register"
            className="font-bold text-[#2ECC71] hover:text-[#7263F3] transition-all duration-300"
          >
            Register here
          </a>
        </p>
        <form onSubmit={onSubmit}>
          <div className=" flex flex-col">
            <label className="mb-1 text-[#999]">Email</label>
            <input
              {...register("email")}
              type="text"
              className="px-4 py-3 border-[2px] rounded-md outline-[#2ECC71] text-gray-800"
              placeholder="johndoe@gmail.com"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="mt-[1rem] flex flex-col">
            <label className="flex justify-between items-center mb-1 ">
              <p className="text-[#999]">Password</p>
              <Link
                href={"/forgot-password"}
                className="text-xs text-blue-700 hover:underline font-semibold"
              >
                Forgot Password?
              </Link>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className="px-4 py-3 border-[2px] rounded-md outline-[#2ECC71] text-gray-800"
              placeholder="*********"
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-4 pt-10 text-[22px] text-[#999] opacity-45"
            >
              {showPassword ? hide : unhide}
            </button>
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          <div className="flex">
            <button
              type="submit"
              className="mt-[1.5rem] flex-1 px-4 py-3 font-bold bg-[#2ECC71] text-white rounded-md hover:bg-[#1abc9c] transition-colors"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
