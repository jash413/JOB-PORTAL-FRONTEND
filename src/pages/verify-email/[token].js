import React, { useContext, useEffect, useState } from "react";
import { navigate } from "gatsby";
import { Oval } from "react-loader-spinner";
import axiosInterceptors from "../../libs/integration/axiosInterceptors";
import { REQ } from "../../libs/constants";
import GlobalContext from "../../context/GlobalContext";

const VerifyEmail = ({ params }) => {
  const { token } = params;
  const [message, setMessage] = useState("Email verification in progress...");
  const [loading, setLoading] = useState(true);
  const gContext = useContext(GlobalContext);

  useEffect(() => {
    const verifyEmail = async () => {
      const authToken = gContext.token;

      if (!authToken) {
        setMessage("Token not found. Verification failed.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axiosInterceptors.get(
          `${REQ.VERIFY_EMAIL}?token=${token}`
        );

        if (response?.message === "Email verified successfully") {
          const userObj = JSON.parse(gContext.user);
          userObj.email_ver_status = 1;
          const updatedUserJson = JSON.stringify(userObj);
          gContext.setUser(updatedUserJson);
          setMessage("Email verified successfully!");
          setTimeout(() => {
            navigate("/");
          }, 3000);
        }
        setLoading(false);
      } catch (error) {
        setMessage("Verification failed. Please try again.");
        setLoading(false);
      }
    };

    if (token) verifyEmail();
  }, [token]);

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100">
      {loading ? (
        <div className="text-center d-flex">
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
          <p className="mt-3 text-secondary">{message}</p>
        </div>
      ) : (
        <p className="text-success font-weight-bold">{message}</p>
      )}
    </div>
  );
};

export default VerifyEmail;
