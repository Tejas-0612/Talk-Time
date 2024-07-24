"use client";

import useRedirect from "@/hooks/useUserRedirect";
import { useGlobalContext } from "@/context/globalContext";
import { useChatContext } from "@/context/chatContext";

import MainContent from "./components/MainContent/MainContent";
import FriendProfile from "./components/FriendProfile/FriendProfile";
import TextArea from "./components/Messages/TextArea/TextArea";
import Header from "./components/Messages/Header/Header";
import Body from "./components/Messages/Body/Body";
import Profile from "./components/Profile/Profile";
import Sidebar from "./components/Sidebar/Sidebar";
import Online from "./components/Online/Online";

export default function Home() {
  useRedirect("/login");

  const { showFriendProfile, showProfile } = useGlobalContext();
  const { selectedChat } = useChatContext();

  return (
    <div className="relative px-[10rem] py-10 h-full">
      <main
        className="h-full flex backdrop-blur-sm rounded-3xl bg-white/65 dark:bg-[#262626]/90 border-2 border-white
        dark:border-[#3C3C3C]/65 shadow-sm overflow-hidden"
      >
        <Sidebar />
        <div className="flex-1 flex">
          <div className="relative flex-1 border-r-2 border-white dark:border-[#3C3C3C]/60">
            {!showProfile && !selectedChat && <MainContent />}

            {!showProfile && selectedChat && <Header />}
            {!showProfile && selectedChat && <Body />}

            <div className="absolute w-full px-4 pb-4 left-0 bottom-0">
              {!showProfile && selectedChat && <TextArea />}
            </div>

            {showProfile && (
              <div className="flex flex-col items-center justify-center h-full">
                <Profile />
              </div>
            )}
          </div>
          <div className="w-[35%]">
            {!showFriendProfile && <Online />}
            {showFriendProfile && <FriendProfile />}
          </div>
        </div>
      </main>
    </div>
  );
}
