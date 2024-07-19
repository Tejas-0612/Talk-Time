"use client";

import React from "react";

import { UserContextProvider } from "../context/userContext";

function UserProvider({ children }: { children: React.ReactNode }) {
  return <UserContextProvider>{children}</UserContextProvider>;
}

export default UserProvider;
