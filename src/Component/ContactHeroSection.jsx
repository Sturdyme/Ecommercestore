import React, { useState, useEffect, useRef } from "react";
import { BiChat, BiX } from "react-icons/bi";
import { BsNewspaper } from "react-icons/bs";
import { IoNewspaperOutline } from "react-icons/io5";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../Firebase";
import { getConversationId } from "../Utilities/GetConversationId";

const ContactHeroSection = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const bottomRef = useRef(null);
  const conversationId = getConversationId();

  // 🔥 Listen to messages in real-time
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

    return () => unsubscribe();
  }, [conversationId]);

  // 🔥 Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔥 Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      await addDoc(collection(db, "messages"), {
        text: input,
        conversationId,
        from: "anonymous",
        createdAt: serverTimestamp(),
      });

      setInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <>
      {/* SECTION */}
      <section className="mt-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* CARD 1 */}
          <div className="bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-xl transition duration-300">
            <div className="flex justify-center theme-text-black mb-6">
              <BiChat size={42} />
            </div>

            <h3 className="text-xl font-semibold text-gray-900">
              Live Chat
            </h3>

            <p className="mt-4 text-gray-600 leading-relaxed">
              Have a presale question? Chat live with our team for a faster response.
            </p>

            <button
              onClick={() => setIsChatOpen(true)}
              className="inline-block mt-6 theme-text-black font-medium underline underline-offset-4 hover:text-gray-700 transition"
            >
              Open Live Chat
            </button>
          </div>

          {/* CARD 2 */}
          <div className="bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-xl transition duration-300">
            <div className="flex justify-center theme-text-black mb-6">
              <IoNewspaperOutline size={42} />
            </div>

            <h3 className="text-xl font-semibold text-gray-900">
              Need Support?
            </h3>

            <p className="mt-4 text-gray-600 leading-relaxed">
              Have a presale question? Chat live with our team for a faster response.
            </p>

            <button className="inline-block mt-6 theme-text-black font-medium underline underline-offset-4 hover:text-gray-700 transition"> Explore Help Center</button>
          </div>

          {/* CARD 3 */}
          <div className="bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-xl transition duration-300">
            <div className="flex justify-center theme-text-black mb-6">
              <BsNewspaper size={42} />
            </div>

            <h3 className="text-xl font-semibold text-gray-900">
              My Vogue
            </h3>

            <p className="mt-4 text-gray-600 leading-relaxed">
              Have a presale question? Chat live with our team for a faster response.
            </p>

            <button className="inline-block mt-6 theme-text-black font-medium underline underline-offset-4 hover:text-gray-700 transition">Manage Account </button>
          </div>

        </div>
      </section>

      {/* FLOATING BUTTON */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 bg-purple-600 text-white p-4 rounded-full shadow-xl z-50 hover:bg-purple-700 transition"
        >
          <BiChat size={24} />
        </button>
      )}

      {/* CHATBOX */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 w-80 bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden z-50">

          {/* Header */}
          <div className="bg-purple-600 text-white p-4 flex justify-between items-center">
            <span className="font-semibold">Live Support</span>
            <button onClick={() => setIsChatOpen(false)}>
              <BiX size={22} />
            </button>
          </div>

          {/* Messages */}
          <div className="p-4 h-64 overflow-y-auto text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-2 ${
                  msg.from === "anonymous"
                    ? "text-right"
                    : "text-left"
                }`}
              >
                <span className="inline-block bg-gray-200 px-3 py-2 rounded-lg">
                  {msg.text}
                </span>
              </div>
            ))}
            <div ref={bottomRef}></div>
          </div>

          {/* Input */}
          <form
            onSubmit={sendMessage}
            className="p-3 border-t flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 rounded-lg hover:bg-purple-700 transition"
            >
              Send
            </button>
          </form>

        </div>
      )}
    </>
  );
};

export default ContactHeroSection;
