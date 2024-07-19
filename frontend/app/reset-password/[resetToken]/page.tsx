"use client";
import * as z from "zod";
import { useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useUserContext } from "@/context/userContext";
import { passwordResetSchema } from "@/schemas/passwordSchema";
import { hide, unhide } from "@/utils/Icons";

interface Props {
  params: {
    resetToken: string;
  };
}

function page({ params }: Props) {
  const { resetToken } = params;

  const { resetPassword } = useUserContext();
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<z.infer<typeof passwordResetSchema>>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      confirmPassword: "",
      newPassword: "",
    },
  });

  const onSubmit = handleSubmit(
    async (data: z.infer<typeof passwordResetSchema>) => {
      const { newPassword, confirmPassword } = data;
      if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match!");
      }
      resetPassword(resetToken, data.newPassword);
    }
  );
  return (
    <main className="auth-page w-full h-full flex justify-center items-center">
      <div className="m-[2rem] px-10 py-14 rounded-lg bg-white max-w-[520px] w-full">
        <div className="relative z-10">
          <h1 className="mb-2 text-center text-[1.35rem] font-medium">
            Reset Your Password!
          </h1>
          <form onSubmit={onSubmit}>
            <div className="relative mt-[1rem] flex flex-col">
              <label className="mb-1 text-[#999]">Current Password</label>
              <input
                type={showPassword ? "text" : "password"}
                {...register("newPassword")}
                placeholder="*********"
                className="px-4 py-3 border-[2px] rounded-md outline-[#2ECC71] text-gray-800"
              />
              <button
                className="absolute p-1 right-4 top-[43%] text-[22px] text-[#999] opacity-45"
                onClick={togglePassword}
                type="button"
              >
                {showPassword ? unhide : hide}
              </button>
              {errors.newPassword && (
                <p className="text-red-500">{errors.newPassword.message}</p>
              )}
            </div>
            <div className="relative mt-[1rem] flex flex-col">
              <label className="mb-1 text-[#999]">New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                {...register("confirmPassword")}
                placeholder="*********"
                className="px-4 py-3 border-[2px] rounded-md outline-[#2ECC71] text-gray-800"
              />
              <button
                className="absolute p-1 right-4 top-[43%] text-[22px] text-[#999] opacity-45"
                onClick={togglePassword}
                type="button"
              >
                {showPassword ? unhide : hide}
              </button>
              {errors.confirmPassword && (
                <p className="text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
            <div className="flex">
              <button
                type="submit"
                className="mt-[1.5rem] flex-1 px-4 py-3 font-bold bg-[#2ECC71] text-white rounded-md hover:bg-[#1abc9c] transition-colors"
              >
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default page;
