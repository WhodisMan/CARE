"use client";

import { useState, useRef, useEffect } from "react";
import BackButton from "@/components/BackButton";

export default function ChatBotPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const botResponse = { sender: "bot", text: data.response };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorResponse = { 
        sender: "bot", 
        text: "Sorry, I encountered an error processing your request. Please try again later." 
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-screen">
      {/* Header row with back button and centered title */}
      <div className="absolute top-4 left-0 right-0 z-10 flex items-center justify-center">
        <div className="absolute left-4">
          <BackButton />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center">CARE Bot</h1>
      </div>

      <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-900">
        <div className="p-4 bg-blue-600 text-white text-lg font-bold shadow-md">
          ChatBot
        </div>

        {/* Centered chat container */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-2xl mx-auto h-full flex flex-col">
            {/* Messages container with hidden scrollbar */}
            <div className="flex-1 overflow-y-auto space-y-4 pb-4 scrollbar-hide">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`p-3 rounded-lg shadow-md max-w-[80%] whitespace-pre-wrap break-words ${
                      message.sender === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 text-black dark:bg-gray-700 dark:text-white"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-lg shadow-md bg-gray-300 text-black dark:bg-gray-700 dark:text-white">
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Input container with send button on the right */}
        <div className="p-4 bg-white dark:bg-gray-800 shadow-md">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message here..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                rows={1}
                disabled={isLoading}
                className="flex-1 px-4 py-3 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 resize-y min-h-[60px] max-h-[200px] scrollbar-hide"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading}
                className="h-[60px] px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}