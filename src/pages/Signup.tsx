import { getNewAccessToken } from "../utils/utils";
import { getUserInfo } from "../services/googleAuth.service";
// import GoogleLogo from "../components/icons/GoogleLogo";
import { GoogleLogin } from "@react-oauth/google";

export default function SignUp() {
  const loginWithGoogle = async () => {
    // This function is not used but can be kept for future use
    try {
      const accessToken = await getNewAccessToken();
      localStorage.setItem("google_access_token", accessToken);
      const userInfo = await getUserInfo();
      localStorage.setItem("user_info", JSON.stringify(userInfo));
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Failed to get access token:", err);
      return; // Don't continue if we don't have access
    }
  };

  return (
    <div className="h-[100dvh] flex justify-center items-center bg-gray-100">
      <div className="flex flex-col justify-between p-10 rounded-xl shadow-xl bg-white md:w-96 w-full md:h-96 h-full text-center">
        <h1 className="text-2xl font-bold mb-4">Create an account</h1>
        {/* <button
          className="w-full bg-secondary flex items-center justify-center gap-3 border border-border-color px-2 py-2 rounded-lg cursor-pointer hover:border-gray-500 "
          onClick={loginWithGoogle}
        >
          <GoogleLogo />
          Sign up with Google
        </button> */}
        <GoogleLogin onSuccess={loginWithGoogle} />
        <div className="font-bold flex justify-between">
          <p>Already have an account?</p>
          <a href="/" className="text-primary-text underline">
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}
