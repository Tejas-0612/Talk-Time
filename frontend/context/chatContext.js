import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useUserContext } from "./userContext";
import axios from "axios";
import io from "socket.io-client";

const ChatContext = createContext();

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export const ChatProvider = ({ children }) => {
  const { user, setUser } = useUserContext();
  const userId = user?._id;
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [allChatsData, setAllChatsData] = React.useState([]);
  const [selectedChat, setSelectedChat] = React.useState(null);
  const [activeChatData, setActiveChatData] = React.useState({});
  const [socket, setSocket] = React.useState(null);
  const [onlineUsers, setOnlineUsers] = React.useState([]);
  const [arrivedMessage, setArrivedMessage] = React.useState(null);

  useEffect(() => {
    const newSocket = io(serverUrl);

    newSocket.on("connect", () => {
      console.log("Connected to the server");
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Disconnected to the server", reason);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    socket?.emit("add user", user._id);

    socket?.on("get users", (users) => {
      const getOnlineUsers = async () => {
        try {
          const usersOnline = await Promise.all(
            users.map(async (user) => {
              const userData = await getUserById(user.userId);
              return userData;
            })
          );

          const onlineFriends = usersOnline.filter(
            (user) => user._id !== userId
          );

          const isFriends = onlineFriends.filter((friend) =>
            user?.friends?.includes(friend._id)
          );

          setOnlineUsers(isFriends);
        } catch (error) {
          console.log("Error in getting Online Users", error.message);
        }
      };
      getOnlineUsers();
    });

    socket?.on("get message", (data) => {
      setArrivedMessage({
        sender: data.senderId,
        content: data.text,
        createdAt: Date.now(),
      });
    });

    return () => {
      socket?.off("get users");
      socket?.off("get message");
    };
  }, [user]);

  useEffect(() => {
    if (
      arrivedMessage &&
      selectedChat &&
      selectedChat.participants.includes(arrivedMessage.sender)
    ) {
      setMessages((prev) => [...prev, arrivedMessage]);
    }
  }, [arrivedMessage, selectedChat?._id]);

  const getUserById = async (id) => {
    try {
      if (!id) return;

      const res = await axios.get(`${serverUrl}/api/v1/user/${id}`);
      return res.data.data;
    } catch (error) {
      console.log("Error in getUserById", error.message);
    }
  };

  const fetchChats = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${serverUrl}/api/v1/chats/${userId}`);
      setChats(res.data.data);
    } catch (error) {
      console.log("Error in fetchChats", error.message);
    }
  };

  const fetchMessages = async (chatId, limit = 15, offset = 0) => {
    try {
      const res = await axios.get(`${serverUrl}/api/v1/messages/${chatId}`, {
        params: { limit, offset },
      });

      // set messages
      setMessages(res.data.data);
    } catch (error) {
      console.log("Error in fetcMessages", error.message);
    }
  };

  const fetchAllMessages = async (chatId) => {
    if (!chatId) return;
    try {
      const res = await axios.get(`${serverUrl}/api/v1/messages/${chatId}`);

      return res.data;
    } catch (error) {
      console.log("Error in fetchAllMessages", error.message);
    }
  };

  const handleSelectedChat = async (chat) => {
    setSelectedChat(chat);
    const isNotLoggedInUser = chat.participants.find(
      (participant) => participant !== userId
    );
    const data = await getUserById(isNotLoggedInUser);
    setActiveChatData(data);
  };

  const getAllChatsData = async () => {
    try {
      const updatedChats = await Promise.all(
        chats?.map(async (chat) => {
          const participantsData = await Promise.all(
            chat.participants
              .filter((participant) => participant !== userId)
              .map(async (participant) => {
                const user = await getUserById(participant);
                return user;
              })
          );

          return { ...chat, participantsData };
        })
      );
      console.log(updatedChats);
      setAllChatsData(updatedChats);
    } catch (error) {
      console.log("Error in getAllChatsData", error.message);
    }
  };

  const sendMessage = async (data) => {
    try {
      const res = await axios.post(`${serverUrl}/api/v1/message/create`, data);

      setMessages((prev) => [...prev, res.data.data]);

      setChats((prevChats) => {
        const updatedChats = prevChats.map((chat) => {
          if (chat._id === data.chatId) {
            return {
              ...data,
              lastMessage: res.data.data,
              updatedAt: new Date().toISOString(),
            };
          }
          return chat;
        });

        updatedChats.sort((a, b) => {
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        });

        return updatedChats;
      });

      socket.emit("send message", {
        senderId: data.sender,
        receiverId: activeChatData._id,
        text: data.content,
      });

      return res.data.data;
    } catch (error) {
      console.log("There was error sending the message", error.message);
    }
  };

  const createChat = async (senderId, receiverId) => {
    try {
      const res = await axios.post(`${serverUrl}/api/v1/chats`, {
        senderId,
        receiverId,
      });

      setChats((prev) => [...prev, res.data]);
      return res.data;
    } catch (error) {
      console.log("Error is creating a chat", error.message);
    }
  };

  const logoutUser = async () => {
    try {
      await axios.get(`${serverUrl}/api/v1/logout`);

      setChats([]);
      setMessages([]);
      setAllChatsData([]);
      setSelectedChat(null);
      setActiveChatData({});
      setOnlineUsers([]);
      setSocket(null);
      setArrivedMessage(null);
      setSearchResults([]);
      setUser(null);

      toast.success("You have been logged out");

      Router.push("/login");
    } catch (error) {
      console.log("Error in logoutUser", error.message);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [userId]);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat._id);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (chats && user) {
      getAllChatsData();
    }
  }, [chats, user]);

  return (
    <ChatContext.Provider
      value={{
        chats,
        messages,
        getUserById,
        fetchChats,
        fetchMessages,
        fetchAllMessages,
        getAllChatsData,
        sendMessage,
        handleSelectedChat,
        createChat,
        logoutUser,
        allChatsData,
        onlineUsers,
        activeChatData,
        setOnlineUsers,
        selectedChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  return useContext(ChatContext);
};
