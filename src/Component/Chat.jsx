import React, { useEffect, useRef, useState } from "react";
import { db } from "../Firebase";
import { collection, addDoc, query, orderBy, onSnapshot, where } from "firebase/firestore";
import { getConversationId } from "../Utilities/GetConversationId";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const bottomRef = useRef(null);
  const conversationId = getConversationId();

  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      where("conversationId", "==", conversationId),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(data);
    });

    return unsubscribe;
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    await addDoc(collection(db, "messages"), {
      text: input,
      conversationId,
      from: "anonymous",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    setInput("");
  };

  return (
    <div className="flex flex-col h-[520px] w-full max-w-md bg-white rounded-xl shadow-md">
      {/* Header */}
      <div className="border-b px-4 py-3 font-semibold text-gray-700">
        Anonymous Chat
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          const isReply = msg.from === "firebase";

          return (
            <div
              key={msg.id}
              className={`flex ${isReply ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl text-sm leading-relaxed
                  ${
                    isReply
                      ? "bg-gray-200 text-gray-800 rounded-bl-none"
                      : "bg-blue-600 text-white rounded-br-none"
                  }
                `}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={sendMessage}
        className="flex items-center gap-2 border-t p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message…"
          className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </div>
  );
}

  



