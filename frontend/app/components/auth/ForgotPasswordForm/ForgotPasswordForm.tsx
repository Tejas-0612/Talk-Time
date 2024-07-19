"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useUserContext } from "@/context/userContext";
import { passwordForgetSchema } from "@/schemas/passwordSchema";

function ForgotPasswordForm() {
  const { forgotPasswordEmail } = useUserContext();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<z.infer<typeof passwordForgetSchema>>({
    resolver: zodResolver(passwordForgetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = handleSubmit(
    async (data: z.infer<typeof passwordForgetSchema>) => {
      forgotPasswordEmail(data.email);
    }
  );
  return (
    <div className="ml-0 mt-0 m-[2rem] px-10 py-14 rounded-lg bg-white max-w-[520px] w-full">
      <div className="relative z-10">
        <h1 className="mb-2 text-center text-[1.35rem] font-medium">
          Reset Your Password!
        </h1>
        <form onSubmit={onSubmit}>
          <div className="relative mt-[1rem] flex flex-col">
            <label className="mb-1 text-[#999]">Email</label>
            <input
              type="text"
              {...register("email")}
              placeholder="*********"
              className="px-4 py-3 border-[2px] rounded-md outline-[#2ECC71] text-gray-800"
            />

            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
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
  );
}

export default ForgotPasswordForm;
