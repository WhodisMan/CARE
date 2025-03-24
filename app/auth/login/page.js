/*se client"; // Add this at the very top
import { signIn } from "next-auth/react";

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <button
          onClick={() => signIn("google")}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
*/

/*"use client"; // Add this at the very top
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Sign in to Your Account</h1>
      <button
        onClick={() => signIn("google")}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Sign in with Google
      </button>
    </div>
  );
}
*/
/*"use client";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { FaGoogle } from "react-icons/fa";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100">
      <motion.div
        className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Sign In</h1>
        <button
          onClick={() => signIn("google")}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition"
        >
          <FaGoogle className="text-xl" />
          Sign in with Google
        </button>
      </motion.div>
    </div>
  );
}*/

"use client";

import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function loginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Redirect to dashboard if signed in
    //if (status === "authenticated") {
    //  router.push("/dashboard");
    //}
  }, [status, router]);

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/upload" });
  };

  if (!isClient || status === "loading") return null;

  return (
    <section className="flex justify-center items-center h-screen bg-gray-100">
      <div className="relative p-10 rounded-2xl shadow-2xl w-[400px] h-[300px] flex flex-col justify-center items-center bg-gradient-to-r from-blue-200 via-white to-blue-300 animate-gradient">
        <h1 className="mb-6 text-center text-3xl font-bold animate-slide-in text-blue-800">
          Welcome to CARE
        </h1>
        <button
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center gap-2 p-4 w-full max-w-[250px] bg-white rounded-lg shadow-md hover:shadow-lg transition"
        >
          <img
            src="https://www.material-tailwind.com/logos/logo-google.png"
            alt="google"
            className="h-6 w-6"
          />
          <span className="text-gray-800 font-medium">Sign in with Google</span>
        </button>
      </div>
      <style jsx>{`
        @keyframes gradientMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-gradient {
          background-size: 300% 300%;
          animation: gradientMove 5s ease infinite;
        }

        .animate-slide-in {
          animation: slideIn 1s ease-out;
        }
      `}</style>
    </section>
  );
}
