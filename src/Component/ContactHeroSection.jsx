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

const ContactHeroSection = ({ forceOpen, onClose }) => {
  // 1. Single source of truth for visibility
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const conversationId = getConversationId();

  // 2. Sync internal state with the 'forceOpen' prop from Parent
  useEffect(() => {
    if (forceOpen) setIsChatOpen(true);
  }, [forceOpen]);

  // 3. Close Handler: Resets local state AND parent state
  const handleClose = () => {
    setIsChatOpen(false);
    if (onClose) onClose(); // Critically important!
  };

  // 4. Firebase Listener
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

  // 5. Auto Scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      {/* SUPPORT CARDS SECTION */}
      <section className="mt-24 px-6 mb-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <SupportCard 
            icon={<BiChat size={42} />} 
            title="Live Chat" 
            desc="Have a presale question? Chat live with our team." 
            actionText="Open Live Chat"
            onClick={() => setIsChatOpen(true)}
          />
          <SupportCard 
            icon={<IoNewspaperOutline size={42} />} 
            title="Need Support?" 
            desc="Explore our documentation and help articles." 
            actionText="Explore Help Center"
          />
          <SupportCard 
            icon={<BsNewspaper size={42} />} 
            title="My Account" 
            desc="Manage your orders, returns, and profile settings." 
            actionText="Manage Account"
          />
        </div>
      </section>

      {/* FLOATING ACTION BUTTON */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 bg-purple-600 text-white p-4 rounded-full shadow-2xl z-50 hover:scale-110 transition-transform"
        >
          <BiChat size={24} />
        </button>
      )}

      {/* CHAT WINDOW */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden z-[999] border border-gray-100 animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-purple-600 text-white p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-semibold">Support Team</span>
            </div>
            <button onClick={handleClose} className="hover:bg-purple-500 rounded-full p-1 transition">
              <BiX size={24} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="p-4 h-80 overflow-y-auto bg-gray-50 flex flex-col gap-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.from === "anonymous" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                  msg.from === "anonymous" 
                  ? "bg-purple-600 text-white rounded-tr-none" 
                  : "bg-white text-gray-800 rounded-tl-none"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef}></div>
          </div>

          {/* Input Form */}
          <form onSubmit={sendMessage} className="p-4 bg-white border-t flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="How can we help?"
              className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button type="submit" className="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition">
              <BiChat size={20} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

// Sub-component for clean code
const SupportCard = ({ icon, title, desc, actionText, onClick }) => (
  <div className="bg-white rounded-2xl shadow-sm p-8 text-center hover:shadow-md transition border border-gray-50 flex flex-col items-center">
    <div className="text-purple-600 mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
    <p className="mt-2 text-gray-500 text-sm">{desc}</p>
    <button 
      onClick={onClick}
      className="mt-6 text-purple-600 font-semibold underline underline-offset-4 hover:text-purple-800 transition text-sm"
    >
      {actionText}
    </button>
  </div>
);

export default ContactHeroSection;