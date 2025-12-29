import { useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../auth/api"; // Import Axios instance
import { AuthContext } from "./AuthProvider";
import { toast } from "@/components/ui/use-toast";

const GoogleAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useContext(AuthContext) as any; // Using any to bypass strict type check if interface not fully exported, or we can import the type

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    // Backend seems to return 'token' instead of 'access' sometimes
    const accessToken = params.get("access") || params.get("token");
    const refreshToken = params.get("refresh");

    if (accessToken) {
      // Store access token in sessionStorage
      sessionStorage.setItem("access_token", accessToken);
      if (refreshToken) {
        sessionStorage.setItem("refresh_token", refreshToken);
      }

      // Fetch user info
      api.get("/social-auth/user-info/", {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
        .then(response => {
          const { username, email } = response.data;
          sessionStorage.setItem("username", username);
          sessionStorage.setItem("email", email);

          // Update Context!
          if (setUser) {
            setUser({ token: accessToken, username, email });
          }

          toast({
            title: "Login Successful",
            description: `Welcome ${username}!`,
          });

          navigate("/");
        })
        .catch(error => {
          console.error("Failed to fetch user info", error);
          toast({
            title: "Login Failed",
            description: "Could not retrieve user details.",
            variant: "destructive"
          });
          navigate("/login");
        });

    } else {
      console.error("Google login failed - no token in URL", location.search, location.hash);

      const paramsObj = Object.fromEntries(params.entries());
      console.log("Full Params:", paramsObj);

      toast({
        title: "Login Failed",
        description: `No token received. Params: ${JSON.stringify(paramsObj)}`,
        variant: "destructive",
        duration: 5000
      });
      // navigate("/login"); // Commented out to see the toast
    }
  }, [location, navigate, setUser]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Processing Login...</h2>
        <p className="text-muted-foreground">Please wait while we verify your credentials.</p>
      </div>
    </div>
  );
};

export default GoogleAuthCallback;
