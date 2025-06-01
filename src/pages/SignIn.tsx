import { getNewAccessToken } from "../utils/utils";
import { getUserInfo } from "../services/googleAuth.service";
import GoogleLogo from "../components/icons/GoogleLogo";
import { useState } from "react";
import IconLoading from "../components/icons/IconLoading";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const loginWithGoogle = async () => {
    try {
      const accessToken = await getNewAccessToken();
      setLoading(true);
      localStorage.setItem("google_access_token", accessToken);
      const userInfo = await getUserInfo();
      localStorage.setItem("user_info", JSON.stringify(userInfo));
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Failed to get access token:", err);
      return;
    }
    setLoading(false);
  };

  return (
    <div className="h-[100dvh] flex justify-center items-center bg-gray-100">
      <div className="flex flex-col justify-between p-10 rounded-xl shadow-xl bg-white md:w-96 w-full md:h-96 h-full text-center">
        <h1 className="text-2xl font-bold mb-4">Hi, Welcome Back! 👋</h1>
        <button
          className="w-full bg-secondary flex items-center justify-center gap-3 border border-border-color px-2 py-2 rounded-lg cursor-pointer hover:border-gray-500 "
          onClick={loginWithGoogle}
        >
          <GoogleLogo />
          Sign in with Google
          {loading && <IconLoading />}
        </button>
        <div className="font-bold flex justify-between">
          <p>Don’t have an account?</p>
          <a href="/signup" className="text-primary-text underline">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
