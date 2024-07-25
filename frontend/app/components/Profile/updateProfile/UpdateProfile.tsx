import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useUserContext } from "@/context/userContext";
import { updateSchema } from "@/schemas/updateSchema";

function UpdateProfile() {
  const { updateUser } = useUserContext();

  const userBio = useUserContext().user?.bio;
  const userName = useUserContext().user?.name;
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<z.infer<typeof updateSchema>>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      name: userName,
      bio: userBio,
    },
  });

  const onSubmit = handleSubmit(async (data: z.infer<typeof updateSchema>) => {
    await updateUser({ bio: data.bio, name: data.name });

    return;
  });

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-2">
        <label
          className={`text-lg font-semibold dark:gradientText dark:text-slate-200`}
        >
          Full Name
        </label>
        <input
          type="text"
          id="name"
          {...register("name")}
          className="w-full pl-4 p-2 rounded-md bg-transparent shadow-sm border-2 border-[white] focus:outline-none focus:ring-2 focus:ring-[#7263f3] focus:border-transparent
             dark:bg-[#3C3C3C]/65 dark:border-[#3C3C3C]/65"
        />
      </div>
      <div>
        <label
          className={`text-lg font-semibold dark:gradientText dark:text-slate-200`}
        >
          Bio
        </label>
        <textarea
          id="bio"
          rows={3}
          {...register("bio")}
          className="w-full pl-4 p-2 rounded-md bg-transparent dark:bg-[#3C3C3C]/65 resize-none
              dark:border-[#3C3C3C]/65 shadow-sm border-2 border-[white] focus:outline-none focus:ring-2 focus:ring-[#7263f3] focus:border-transparent"
        ></textarea>
      </div>

      <div className="py-4 flex justify-end">
        <button
          type="submit"
          className="bg-[#7263f3] text-white p-2 rounded-md hover:bg-[#f56693] transition-colors duration-300 ease-in-out"
        >
          Update Profile
        </button>
      </div>
    </form>
  );
}

export default UpdateProfile;
