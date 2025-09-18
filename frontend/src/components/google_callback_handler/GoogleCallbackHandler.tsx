import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DASHBOARD_ROUTE, AUTH_ROUTE } from "../../utils/CONSTANTS.ts";

const GoogleCallbackHandler = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const code = searchParams.get("code");
        const error = searchParams.get("error");

        if (error) {
          navigate(AUTH_ROUTE, { state: { error } });
          return;
        }

        if (!code) {
          navigate(AUTH_ROUTE, { state: { error: "No authorization code" } });
          return;
        }

        setTimeout(() => {
          if (localStorage.getItem("authToken")) {
            navigate(DASHBOARD_ROUTE);
          } else {
            navigate(AUTH_ROUTE, {
              state: { error: "Authentication timeout" },
            });
          }
        }, 2000);
      } catch (err) {
        console.error(err);
        navigate(AUTH_ROUTE, { state: { error: "Authentication failed" } });
      }
    };

    handleGoogleCallback();
  }, [navigate, searchParams]);

  return <div>Processing Google login...</div>;
};

export default GoogleCallbackHandler;
