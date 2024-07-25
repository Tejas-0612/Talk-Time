"use client";
import React, { useEffect, useLayoutEffect, useRef } from "react";

import { useChatContext } from "@/context/chatContext";
import { useUserContext } from "@/context/userContext";
import { IMessage } from "@/types/types";
import Sender from "../Sender/Sender";
import Receiver from "../Receiver/Receiver";

function Body() {
  const messageBodyRef = useRef(null) as any;

  const { messages, arrivedMessage } = useChatContext();
  const userId = useUserContext().user._id;

  const scrollToBottom = (behavior: string = "smooth") => {
    if (messageBodyRef.current) {
      messageBodyRef.current.scrollTo({
        top: messageBodyRef.current.scrollHeight,
        behavior,
      });
    }
  };

  useEffect(() => {
    if (arrivedMessage && arrivedMessage.sender !== userId) {
      scrollToBottom("smooth");
    }
  }, [arrivedMessage]);

  useLayoutEffect(() => {
    scrollToBottom("auto");
  }, []); // when initial page load

  useEffect(() => {
    scrollToBottom("auto");
  }, [messages]); // when new message sent

  return (
    <div
      ref={messageBodyRef}
      className=" message-body relative flex-1 p-4 overflow-y-scroll custom-scrollbar"
    >
      <div className="relative flex flex-col ">
        {messages.length > 0 &&
          messages.map((message: IMessage) => {
            return message.sender === userId ? (
              <div key={message?._id} className="self-end mb-2">
                <Sender
                  status={message.status}
                  content={message.content}
                  createdAt={message.createdAt}
                />
              </div>
            ) : (
              <div key={message?._id}>
                <Receiver
                  messageId={message?._id}
                  content={message.content}
                  createdAt={message.createdAt}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Body;
