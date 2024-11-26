import React, { useEffect, useContext, useState } from "react";
import { navigate } from "gatsby";
import { Oval } from "react-loader-spinner";
import GlobalContext from "../context/GlobalContext";
import { toast } from "react-toastify";

const withoutAuth = (WrappedComponent) => {
  return (props) => {
    const gContext = useContext(GlobalContext);
    const [loading, setLoading] = useState(true);
    const userDetails = JSON.parse(gContext?.user);
    const userType = userDetails?.login_type; // "CND" or "EMP"

    useEffect(() => {
      const currentPath = window.location.pathname;
      if (userType === "EMP" && currentPath === "/") {
        navigate("/profile");
      } else if (userType === "CND" && currentPath === "/") {
        navigate("/profile");
      } else {
        setLoading(false);
      }
    }, [gContext, userType]);

    if (loading) {
      return (
        <div
          className="d-flex align-items-center justify-content-center text-center"
          style={{
            height: "70vh",
            width: "100vw",
          }}
        >
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

export default withoutAuth;
