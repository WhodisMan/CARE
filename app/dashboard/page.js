"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [greeting, setGreeting] = useState("Hello");
  const [icon, setIcon] = useState(<Sun className="w-6 h-6 text-yellow-400" />);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good Morning");
      setIcon(<Sun className="w-6 h-6 text-yellow-400" />);
    } else if (hour < 18) {
      setGreeting("Good Afternoon");
      setIcon(<Moon className="w-6 h-6 text-blue-400" />);
    } else {
      setGreeting("Good Evening");
      setIcon(<Moon className="w-6 h-6 text-gray-500" />);
    }
  }, []);

  if (session) {
    return (
      <div
        className={`relative w-full h-screen flex flex-col items-center justify-center transition-all ${
          darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-blue-100 to-blue-200"
        }`}
      >
        {/* Dark Mode Toggle */}
        <button
          className="absolute top-4 right-4 p-2 rounded-full shadow-md transition-all hover:scale-110"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle Dark Mode"
        >
          {darkMode ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-blue-600" />}
        </button>

        {/* Greeting Section */}
        <div
          className={`flex flex-col items-center mb-8 p-6 rounded-xl shadow-lg border border-blue-100 
            ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
        >
          {session.user.image && (
            <Image
              src={session.user.image}
              alt={`${session.user.name}'s Profile Picture`}
              width={70}
              height={70}
              priority
              className="rounded-full border border-blue-300 shadow-sm"
            />
          )}
          <h1 className="text-2xl font-bold mt-4 flex items-center gap-2">
            {icon} {greeting}, {session.user.name}!
          </h1>
        </div>

        {/* Entry Points (Profile, Test, Hospitals, Insights, ChatBot) */}
        <div className="grid grid-cols-2 gap-6">
          {[
            { src: "/profile.svg", label: "Profile", path: "/profile" },
            { src: "/test.svg", label: "Eye Test", path: "/upload" },
            { src: "/hospital.svg", label: "Nearby Hospitals", path: "/hospitals" },
            { src: "/insight.svg", label: "Health Insights", path: "/health-insights" },
            { src: "/chatbot.svg", label: "ChatBot", path: "/chatbot" }, // New ChatBot entry
          ].map((item, index) => (
            <div
              key={index}
              className={`flex flex-col items-center p-6 rounded-lg shadow-md cursor-pointer transition-all hover:translate-y-[-2px] 
                  ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
              onClick={() => router.push(item.path)}
            >
              <Image
                src={item.src}
                alt={`${item.label} Icon`}
                width={80}
                height={80}
                priority
              />
              <p className="mt-2 text-lg font-semibold">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
      <div
        className={`p-8 rounded-2xl shadow-lg border border-blue-100 
          ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
      >
        <h1 className="text-2xl font-bold mb-6 text-blue-800 dark:text-white">
          Welcome to Eye Disease Detection
        </h1>
        <button
          onClick={() => signIn("google")}
          className="px-6 py-2 rounded-lg bg-blue-500 text-white shadow-md hover:bg-blue-600 transition"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}