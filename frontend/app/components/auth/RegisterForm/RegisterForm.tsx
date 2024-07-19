"use client";
import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { hide, unhide } from "@/utils/Icons";
import { useUserContext } from "@/context/userContext";
import { registerSchema } from "@/schemas/registerSchema";

function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

  const { registerUser } = useUserContext();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(
    async (data: z.infer<typeof registerSchema>) => {
      await registerUser(data);

      return;
    }
  );

  return (
    <div className="relative m-[2rem] px-10 py-14 rounded-lg bg-white w-full max-w-[520px]">
      <div className="relative z-10">
        <h1 className="mb-2 text-center text-[1.35rem] font-medium">
          Register for an Account
        </h1>
        <p className="mb-8 px-[2rem] text-center text-[#999] text-[14px]">
          Create an account. Already have an account?{" "}
          <a
            href="/login"
            className="font-bold text-[#2ECC71] hover:text-[#7263F3] transition-all duration-300"
          >
            Login here
          </a>
        </p>
        <form onSubmit={onSubmit}>
          <div className="flex flex-col">
            <label className="mb-1 text-[#999]">Full Name</label>
            <input
              type="text"
              {...register("name")}
              className="px-4 py-3 border-[2px] rounded-md outline-[#2ECC71] text-gray-800"
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="mt-[1rem] flex flex-col">
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
            <label className="mb-1 text-[#999]">Password</label>
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
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
