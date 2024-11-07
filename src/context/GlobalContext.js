import React, { useEffect, useMemo, useState } from "react";
import { navigate } from "gatsby";
import { useFetchExperienceDetails } from "../hooks/useFetchExperienceDetails";
const GlobalContext = React.createContext();

const GlobalProvider = ({ children }) => {
  const [themeDark, setThemeDark] = useState(false);
  const [showSidebarDashboard, setShowSidebarDashboard] = useState(true);
  const [applicationModalVisible, setApplicationModalVisible] = useState(false);
  const [signInModalVisible, setSignInModalVisible] = useState(false);
  const [forgetPasswordModalVisible, setForgetPasswordModalVisible] = useState(
    false
  );
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(
    false
  );
  const [signUpModalVisible, setSignUpModalVisible] = useState({
    visible: false,
    type: "CND",
  });
  const [optVerifyVisible, setOptVerifyVisible] = useState(false);
  const [emailVerifyVisible, setEmailVerifyVisible] = useState(false);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [visibleOffCanvas, setVisibleOffCanvas] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const [token, setToken] = useState(
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null
  );
  const [user, setUser] = useState(
    typeof window !== "undefined" ? localStorage.getItem("user") : null
  );

  const [header, setHeader] = useState({
    theme: "light",
    bgClass: "default",
    variant: "primary",
    align: "left",
    isFluid: false,
    button: "cta",
    buttonText: "Get started free",
    reveal: true,
  });
  const [footer, setFooter] = useState({
    theme: "dark",
    style: "style1",
  });

  const {
    experienceData,
    fetchExperienceDetails,
  } = useFetchExperienceDetails();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path.includes("reset-password")) {
        setChangePasswordModalVisible(true);
      } else {
        setChangePasswordModalVisible(false);
      }
    }
  }, []);

  const authenticated = useMemo(() => {
    if (!token || !user) return false;

    try {
      const parsedUser = JSON.parse(user);
      return !!parsedUser?.login_id;
    } catch (error) {
      console.error("Invalid JSON in user:", error);
      return false;
    }
  }, [token, user]);

  const authVerified = useMemo(() => {
    if (!token || !user) return false;

    try {
      const parsedUser = JSON.parse(user);
      if (parsedUser === null) return false;
      return (
        parsedUser?.user_approval_status !== 0 &&
        parsedUser?.email_ver_status !== 0 &&
        parsedUser?.user_approval_status !== 0
      );
    } catch (error) {
      console.error("Invalid JSON in user:", error);
      return false;
    }
  }, [token, user]);

  const toggleTheme = () => {
    setThemeDark(!themeDark);
  };

  const toggleSidebarDashboard = () => {
    setShowSidebarDashboard(!showSidebarDashboard);
  };

  const toggleVideoModal = () => {
    setVideoModalVisible(!videoModalVisible);
  };

  const toggleApplicationModal = () => {
    setApplicationModalVisible(!applicationModalVisible);
  };

  const toggleSignInModal = () => {
    setSignInModalVisible(!signInModalVisible);
  };

  const toggleForgetPasswordModal = () => {
    setForgetPasswordModalVisible(!forgetPasswordModalVisible);
  };

  const toggleChangePasswordModal = () => {
    setChangePasswordModalVisible(!changePasswordModalVisible);
  };

  const toggleOptVerifyModal = () => {
    setOptVerifyVisible(!optVerifyVisible);
  };

  const toggleEmailVerifyModal = () => {
    setEmailVerifyVisible(!emailVerifyVisible);
  };

  const toggleProfileModal = () => {
    setProfileModal(!profileModal);
  };

  const toggleSignUpModal = () => {
    setSignUpModalVisible((prevState) => ({
      ...prevState,
      visible: !prevState.visible,
      type: "CND",
    }));
  };

  const toggleOffCanvas = () => {
    setVisibleOffCanvas(!visibleOffCanvas);
  };

  const closeOffCanvas = () => {
    setVisibleOffCanvas(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    navigate("/");
  };

  useEffect(() => {
    if (token === null) {
      setToken(null);
    }
  }, [token]);

  useEffect(() => {
    if (user === null) {
      setUser(null);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("authToken", token);
  }, [token]);

  useEffect(() => {
    localStorage.setItem("user", user);
  }, [user]);

  return (
    <GlobalContext.Provider
      value={{
        themeDark,
        toggleTheme,
        showSidebarDashboard,
        toggleSidebarDashboard,
        videoModalVisible,
        toggleVideoModal,
        applicationModalVisible,
        toggleApplicationModal,
        signInModalVisible,
        toggleSignInModal,
        forgetPasswordModalVisible,
        toggleForgetPasswordModal,
        changePasswordModalVisible,
        toggleChangePasswordModal,
        signUpModalVisible,
        toggleSignUpModal,
        visibleOffCanvas,
        toggleOffCanvas,
        closeOffCanvas,
        optVerifyVisible,
        toggleOptVerifyModal,
        emailVerifyVisible,
        toggleEmailVerifyModal,
        profileModal,
        toggleProfileModal,
        header,
        setHeader,
        footer,
        setFooter,
        setSignUpModalVisible,
        handleLogout,
        token,
        setToken,
        user,
        setUser,
        authenticated,
        authVerified,
        experienceData,
        fetchExperienceDetails,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
export { GlobalProvider };
