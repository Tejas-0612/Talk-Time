import Image from "next/image";
import { Fragment, useEffect, useState } from "react";

import ChatItem from "../ChatItem/ChatItem";
import SearchInput from "../SearchInput/SearchInput";
import { useUserContext } from "@/context/userContext";
import { useGlobalContext } from "@/context/globalContext";
import { useChatContext } from "@/context/chatContext";
import FriendRequests from "../FriendRequests/FriendRequests";
import SearchResults from "../SearchResults/SearchResults";
import { IChat, IUser } from "@/types/types";
import { navButtons } from "@/utils/constants";
import { archive, chat, database, group, moon, sun } from "@/utils/Icons";

function Sidebar() {
  const { user, updateUser, searchResults } = useUserContext();
  const { avatar, friendRequests } = user;

  const { allChatsData, handleSelectedChat, selectedChat } = useChatContext();
  const { showProfile, handleProfileToggle, handleViewChange, currentView } =
    useGlobalContext();

  const [activeNav, setActiveNav] = useState(navButtons[0].id);

  const lightTheme = () => {
    updateUser({ theme: "light" });
  };

  const darkTheme = () => {
    updateUser({ theme: "dark" });
  };

  useEffect(() => {
    if (user.theme) {
      document.documentElement.className = user.theme;
    }
  }, [user.theme]);

  return (
    <div className="w-[25rem] flex border-r-2 border-white dark:border-[#3C3C3C]/60">
      <div className="p-4 flex flex-col justify-between items-center border-r-2 border-white dark:border-[#3C3C3C]/60">
        <div
          className="profile flex flex-col items-center "
          onClick={() => handleProfileToggle(true)}
        >
          <Image
            src={avatar}
            alt="profile"
            width={50}
            height={50}
            className="aspect-square rounded-full object-cover border-2 border-white dark:border-[#3c3c3c]/65 cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out shadow-sm select-text"
          />
        </div>
        <div className="w-full relative py-4 flex flex-col items-center gap-8 text-[#454e56] text-lg border-2 border-white dark:border-[#3C3C3C]/65 round-[30px] shadow-sm">
          {navButtons.map((nav, i: number) => {
            return (
              <button
                key={nav.id}
                className={`${
                  activeNav === i && `active-nav dark:gradient-text`
                } relative p-1 flex items-center text-[#454e56] dark:text-white/65`}
                onClick={() => {
                  setActiveNav(nav.id);
                  handleViewChange(nav.slug);
                  handleProfileToggle(false);
                }}
              >
                {nav.icon}

                {nav.notification && (
                  <span className="absolute -top-2 right-0 w-4 h-4 bg-[#f00] text-white text-xs rounded-full flex items-center justify-center">
                    {friendRequests?.length > 0 ? friendRequests.length : "0"}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="p-2 text-[#454e56] text-xl flex flex-col gap-2 border-2 border-white dark:border-[#3C3C3C]/65 rounded-[30px] shadow-sm dark:text-white/65">
          <button
            className={`${
              user?.theme === "light"
                ? `inline-block bg-clip-text text-transparent bg-gradient-to-r from-[#7263f3] to-[#f56693]`
                : ""
            }`}
            onClick={() => lightTheme()}
          >
            {sun}
          </button>
          <span className="w-full h-[2px] bg-white dark:bg-[#3C3C3C]/60"></span>
          <button
            className={`${user?.theme === "dark" && "text-white"}`}
            onClick={() => darkTheme()}
          >
            {moon}
          </button>
        </div>
      </div>
      <div className="pb-4 flex-1">
        <h2 className="px-4 mt-6 font-bold text-2xl dark:gradient-text dark:text-white">
          Messages{" "}
        </h2>
        <div className="px-4 mt-2">
          <SearchInput />
        </div>

        {searchResults?.data?.length > 0 && (
          <div className="mt-4">
            <h4
              className={`px-4 grid grid-cols-[22px_1fr] items-center font-bold dark:gradient-text dark:text-slate-200`}
            >
              {database} Search Results
            </h4>
            <SearchResults />
          </div>
        )}

        {currentView === "all-chats" && (
          <div className="mt-8">
            <h4 className="px-4 grid grid-cols-[22px_1fr] items-center font-bold dark:gradient-text dark:text-slate-200">
              {chat} <span>All Chats</span>
            </h4>

            <div className="mt-2">
              {allChatsData.map((chat: IChat, i: number) => {
                return (
                  <Fragment key={i}>
                    {chat?.participantsData?.map((participant: IUser) => {
                      return (
                        <ChatItem
                          key={participant._id}
                          user={participant}
                          active={!showProfile && selectedChat?._id == chat._id}
                          chatId={chat._id}
                          onClick={() => {
                            handleProfileToggle(false);
                            handleSelectedChat(chat);
                          }}
                        />
                      );
                    })}
                  </Fragment>
                );
              })}
            </div>
          </div>
        )}

        {currentView === "archived" && (
          <div className="mt-8">
            <h4
              className={`px-4 grid grid-cols-[22px_1fr] items-center font-bold dark:gradient-text dark:text-slate-200`}
            >
              <span>{archive}</span> <span>Archived</span>
            </h4>
            <div className="mt-2">
              <p className="px-4 py-2 text-[#454e56] dark:text-white/65">
                No archived chats
              </p>
            </div>
          </div>
        )}

        {currentView === "requests" && (
          <div className="mt-8">
            <h4
              className={`px-4 grid grid-cols-[22px_1fr] items-center font-bold dark:gradient-text dark:text-slate-200`}
            >
              <span className="w-[20px] mr-2">{group}</span>
              <span>Friend Requests</span>
            </h4>

            <div className="mt-2">
              {friendRequests?.length > 0 ? (
                <FriendRequests />
              ) : (
                <p className="px-4 py-2 text-[#454e56] dark:text-white/65">
                  There are no friend requests
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
