import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useEdgeStore } from "@/lib/edgestore";

import { useUserContext } from "@/context/userContext";
import { logout } from "@/utils/Icons";
import UpdateProfile from "./updateProfile/UpdateProfile";
import UpdatePassword from "./updatePassword/UpdatePassword";

function Profile() {
  const { edgestore } = useEdgeStore();

  const { logOutUser, updateUser } = useUserContext();

  const avatar = useUserContext().user?.avatar;

  const [file, setFile] = useState<File>();

  const handleUploadImage = async () => {
    if (file) {
      const res = await edgestore.publicFiles.upload({
        file,
        options: { temporary: false },
      });

      const { url } = res;

      updateUser({ avatar: url });
    }
  };

  useEffect(() => {
    handleUploadImage();
  }, [file]);

  return (
    <div className="px-12 pb-8 overflow-y-scroll custom-scrollbar">
      <h3
        className={`pt-6 pb-8 flex justify-center text-3xl font-black dark:gradient-text dark:text-white`}
      >
        My Profile
      </h3>

      <div className="flex flex-col">
        <div className="group relative self-center">
          <Image
            src={avatar}
            alt="profile"
            width={300}
            height={300}
            className="aspect-square rounded-full object-cover border-2 border-[white] cursor-pointer hover:scale-105 transition-transform
            duration-300 ease-in-out shadow-sm select-text  dark:border-[#3C3C3C]/65"
          />
          <input
            type="file"
            name="file"
            id="file"
            onChange={(e) => {
              // @ts-ignore
              setFile(e.target?.files[0]);
            }}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
          <span className="absolute top-0 w-full h-full rounded-full cursor-pointer flex items-center justify-center bg-black bg-opacity-50 text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out pointer-events-none">
            Change Image
          </span>
        </div>

        <UpdateProfile />

        <UpdatePassword />

        <div className="pt-4 self-center">
          <button
            onClick={logOutUser}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-300 ease-in-out"
          >
            {logout} Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
