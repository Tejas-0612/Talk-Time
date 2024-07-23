"use client";

import React from "react";

import { UserContextProvider } from "../context/userContext";
import { GlobalProvider } from "../context/globalContext";
import { ChatProvider } from "@/context/chatContext";

function UserProvider({ children }: { children: React.ReactNode }) {
  return (
    <UserContextProvider>
      <GlobalProvider>
        <ChatProvider>{children}</ChatProvider>
      </GlobalProvider>
    </UserContextProvider>
  );
}

export default UserProvider;
