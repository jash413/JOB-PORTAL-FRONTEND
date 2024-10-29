import React, { useEffect, useContext, useState } from "react";
import { navigate } from "gatsby";
import { Oval } from "react-loader-spinner";
import GlobalContext from "../context/GlobalContext";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const gContext = useContext(GlobalContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const isAuthenticated = gContext?.authenticated;
      const isAuthVerified = gContext?.authVerified;
      const currentPath = window.location.pathname;

      if (!isAuthenticated) {
        navigate("/");
        toast.warn("You need to log in to access this page.");
      } else if (!isAuthVerified && currentPath !== "/candidate-profile") {
        navigate("/");
        toast.warn(
          "You need to complete verification steps to access this page."
        );
      } else {
        setLoading(false);
      }
    }, [gContext]);

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen min-w-screen">
          <Oval
            height={50}
            width={50}
            color="#4fa94d"
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="#4fa94d"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
