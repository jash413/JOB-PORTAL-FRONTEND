import React, { useEffect, useContext, useState } from "react";
import { navigate } from "gatsby";
import { Oval } from "react-loader-spinner";
import GlobalContext from "../context/GlobalContext";
import { toast } from "react-toastify";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const gContext = useContext(GlobalContext);
    const [loading, setLoading] = useState(true);
    const userDetails = JSON.parse(gContext?.user);
    const userType = userDetails?.login_type; // "CND" or "EMP"

    useEffect(() => {
      const isAuthenticated = gContext?.authenticated;
      const isAuthVerified = gContext?.authVerified;
      const currentPath = window.location.pathname;

      if (!isAuthenticated) {
        navigate("/");
        toast.warn("You need to log in to access this page.");
      } else if (!isAuthVerified && currentPath !== "/profile") {
        navigate("/profile");
        if (userDetails?.user_approval_status === 0) {
          toast.warn(
            "Your account is pending approval. You will be notified once it is approved."
          );
        } else if (
          userDetails?.email_ver_status === 0 ||
          userDetails?.phone_ver_status === 0
        ) {
          toast.warn(
            "You need to complete verification steps to access this page."
          );
        }
      } else {
        const allowedPathsForCND = [
          "/job-pages",
          "/profile",
          "/company-profile",
          "/essential",
          "/search-jobs",
          "/my-applications",
          "/job-details",
        ];
        const allowedPathsForEMP = [
          "/profile",
          "/dashboard-main",
          "/dashboard-jobs",
          "/dashboard-applicants",
          "/dashboard-candidates",
          "/dashboard-not-allowed-candidates",
          "/dashboard-request-access",
          "/essential",
        ];

        if (userType === "EMP" && currentPath === "/") {
          navigate("/profile");
        } else if (
          userType === "CND" &&
          !allowedPathsForCND.some((path) => currentPath.includes(path))
        ) {
          navigate("/");
          toast.warn("You do not have access to this page.");
        } else if (
          userType === "EMP" &&
          !allowedPathsForEMP.some((path) => currentPath.includes(path))
        ) {
          navigate("/");
          toast.warn("You do not have access to this page.");
        } else {
          setLoading(false);
        }
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

export default withAuth;
