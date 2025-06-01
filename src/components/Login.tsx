import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';

function Login() {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const login = useGoogleLogin({
    onSuccess: tokenResponse => {
      setAccessToken(tokenResponse.access_token);

    },
    onError: error => {
      console.error('Google Sign-In Failed:', error);
    },
  });

  return (
    <div>
      <h2>Login</h2>
      <button onClick={() => login()}>Sign in with Google</button>
      {accessToken && <p>Access Token: {accessToken}</p>}
    </div>
  );
}

export default Login;