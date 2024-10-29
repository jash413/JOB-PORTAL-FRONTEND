import React, { useEffect, useMemo, useState } from "react";
import { navigate } from "gatsby";
import { useLocation } from "react-router-dom";
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
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [visibleOffCanvas, setVisibleOffCanvas] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("authToken"));
  const [user, setUser] = useState(localStorage.getItem("user"));
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

  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("reset-password")) {
      setChangePasswordModalVisible(true);
    }
  }, [location.pathname]);
  const authenticated = useMemo(
    () => !!token && user && !!JSON.parse(user)?.login_id,
    [token, user]
  );

  const authVerified = useMemo(
    () =>
      !!token &&
      user !== undefined &&
      JSON.parse(user)?.phone_ver_status !== 0 &&
      JSON.parse(user)?.email_ver_status !== 0,
    [token, user]
  );

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
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
export { GlobalProvider };
