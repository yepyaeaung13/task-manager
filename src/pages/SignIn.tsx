import { getNewAccessToken } from "../utils/utils";
import { getUserInfo } from "../services/googleAuth.service";
import { GoogleLogin } from "@react-oauth/google";

export default function SignIn() {
  const loginWithGoogle = async () => {
    try {
      const accessToken = await getNewAccessToken();
      localStorage.setItem("google_access_token", accessToken);
      const userInfo = await getUserInfo();
      localStorage.setItem("user_info", JSON.stringify(userInfo));
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Failed to get access token:", err);
      return;
    }
  };

  return (
    <div className="h-[100dvh] flex justify-center items-center bg-gray-100">
      <div className="flex flex-col justify-between items-center p-10 rounded-xl shadow-xl bg-white md:w-96 w-full md:h-96 h-full text-center">
        <h1 className="text-2xl font-bold mb-4">Hi, Welcome Back! 👋</h1>
        <GoogleLogin onSuccess={loginWithGoogle} />
        <div className="font-bold w-full flex justify-between">
          <p>Don’t have an account?</p>
          <a href="/signup" className="text-primary-text underline">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
