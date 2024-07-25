"use client";
import * as z from "zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useUserContext } from "@/context/userContext";
import { passwordChangeSchema } from "@/schemas/passwordSchema";
import { hide, unhide } from "@/utils/Icons";

function UpdatePassword() {
  const { changePassword } = useUserContext();

  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<z.infer<typeof passwordChangeSchema>>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const onSubmit = handleSubmit(
    async (data: z.infer<typeof passwordChangeSchema>) => {
      changePassword(data.currentPassword, data.newPassword);
    }
  );
  return (
    <form onSubmit={onSubmit}>
      <div className="flex gap-2">
        <div className="relative">
          <label className="text-lg font-semibold dark:gradient-text dark:text-slate-200">
            Current Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            {...register("currentPassword")}
            placeholder="*********"
            className="w-full pl-4 p-2 rounded-md bg-transparent shadow-sm border-2 border-[white] focus:outline-none focus:ring-2 focus:ring-[#7263f3] focus:border-transparent
              dark:bg-[#3C3C3C]/65 dark:border-[#3C3C3C]/65"
          />
          <button
            className="absolute p-1 right-4 top-[43%] text-[22px] text-[#999] opacity-45"
            onClick={togglePassword}
            type="button"
          >
            {showPassword ? unhide : hide}
          </button>
          {errors.currentPassword && (
            <p className="text-red-500">{errors.currentPassword.message}</p>
          )}
        </div>
        <div className="relative">
          <label className="text-lg font-semibold dark:gradient-text dark:text-slate-200">
            New Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            {...register("newPassword")}
            placeholder="*********"
            className="w-full pl-4 p-2 rounded-md bg-transparent shadow-sm border-2 border-[white] focus:outline-none focus:ring-2 focus:ring-[#7263f3] focus:border-transparent
              dark:bg-[#3C3C3C]/65 dark:border-[#3C3C3C]/65"
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
      </div>
      <div className="py-4 flex justify-end">
        <button
          type="submit"
          className="bg-[#7263f3] text-white p-2 rounded-md hover:bg-[#f56693] transition-colors duration-300 ease-in-out"
        >
          Update Password
        </button>
      </div>
    </form>
  );
}

export default UpdatePassword;
