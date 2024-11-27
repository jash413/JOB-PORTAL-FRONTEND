import React, { useEffect, useContext } from "react";
import { navigate } from "gatsby";
import GlobalContext from "../context/GlobalContext";

const withoutAuth = (WrappedComponent) => {
  return (props) => {
    const gContext = useContext(GlobalContext);
    const userDetails = JSON.parse(gContext?.user);
    const userType = userDetails?.login_type;

    useEffect(() => {
      const currentPath = window.location.pathname;
      if (userType === "EMP" && currentPath === "/") {
        navigate("/profile");
      } else if (userType === "CND" && currentPath === "/") {
        navigate("/profile");
      }
    }, [gContext, userType]);

    return <WrappedComponent {...props} />;
  };
};

export default withoutAuth;
