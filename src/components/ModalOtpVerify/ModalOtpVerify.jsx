import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import GlobalContext from "../../context/GlobalContext";
import { REQ } from "../../libs/constants";
import { toast } from "react-toastify";
import axiosInterceptors from "../../libs/integration/axiosInterceptors";
import OtpInput from "react-otp-input";

const ModalStyled = styled(Modal)`
  /* &.modal {
    z-index: 10050;
  } */
`;

const ModalOtpVerify = (props) => {
  const gContext = useContext(GlobalContext);
  const [otp, setOtp] = useState("");
  const [phoneNumber] = useState(
    gContext.user ? JSON.parse(gContext.user)?.login_mobile : ""
  );
  const [resendTimer, setResendTimer] = useState(0);

  const handleClose = () => {
    gContext.toggleOptVerifyModal();
  };

  const sendPhoneOtp = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Please log in again.");
      return;
    }
    try {
      const response = await axiosInterceptors.post(
        REQ.SEND_OTP,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response?.message ?? "OTP sent successfully!");
      setResendTimer(30);
    } catch (error) {
      toast.error("Error sending OTP. Please try again.");
    }
  };

  const handleOTPverification = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Please log in again.");
      return;
    }
    try {
      const response = await axiosInterceptors.post(
        REQ.VERIFY_OTP,
        {
          otp,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("OTP verified successfully");
      // const { email_ver_status } = response.user;
      gContext.setUser(JSON.stringify(response?.user));
      //   if (email_ver_status === 0) {
      //     setVerificationStep("email");
      //     setEmail(response?.user?.login_email);
      //     // await sendEmailVerify();
      //   } else {
      //     setVerificationStep(null);
      //   }
    } catch (error) {
      toast.error("Error verifying OTP. Please try again.");
    }
  };

  useEffect(() => {
    if (resendTimer > 0) {
      const timerId = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [resendTimer]);


  useEffect(() => {
    if (gContext.optVerifyVisible) {
      sendPhoneOtp();
    }
  }, [gContext.optVerifyVisible]);

  return (
    <ModalStyled
      {...props}
      size="lg"
      centered
      show={gContext.optVerifyVisible}
      onHide={gContext.toggleOptVerifyModal}
    >
      <Modal.Body className="p-0">
        <button
          type="button"
          className="circle-32 btn-reset bg-white pos-abs-tr mt-md-n6 mr-lg-n6 focus-reset z-index-supper"
          onClick={handleClose}
        >
          <i className="fas fa-times"></i>
        </button>
        <div className="login-modal-main bg-white rounded-8 overflow-hidden">
          <div className="row no-gutters">
            <div className="col-lg-5 col-md-6">
              <div className="pt-10 pb-6 pl-11 pr-12 bg-black-2 h-100 d-flex flex-column dark-mode-texts">
                <div className="pb-9">
                  <p className="mb-0 font-size-6 text-white">
                    Phone Verification
                  </p>
                </div>
                <div className="border-top border-default-color-2 mt-auto">
                  <div className="d-flex mx-n9 pt-6 flex-xs-row flex-column">
                    <div className="pt-5 px-9">
                      <h3 className="font-size-7 text-white">295</h3>
                      <p className="font-size-3 text-white gr-opacity-5 line-height-1p4">
                        New jobs posted today
                      </p>
                    </div>
                    <div className="pt-5 px-9">
                      <h3 className="font-size-7 text-white">14</h3>
                      <p className="font-size-3 text-white gr-opacity-5 line-height-1p4">
                        New companies registered
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-7 col-md-6">
              <div className="bg-white-2 h-100 px-11 pt-11 pb-7">
                <div className="pt-8 pb-10 pl-6 pr-6 h-100 d-flex flex-column dark-mode-texts">
                  <h3 className="font-size-8 text-black line-height-reset pb-4 line-height-1p4 mx-auto">
                    Enter OTP
                  </h3>
                  <p className="mb-0 font-size-4 text-black text-center">
                    We sent a code to{" "}
                    {phoneNumber ? "*".repeat(phoneNumber?.length - 4) + phoneNumber?.slice(-4) : ""}
                  </p>
                  <div className="mb-4 mt-8 mx-auto">
                    <OtpInput
                      value={otp}
                      onChange={setOtp}
                      numInputs={6}
                      renderSeparator={<span>-</span>}
                      renderInput={(props) => <input {...props} />}
                      inputStyle={{
                        width: "50px",
                        height: "50px",
                        fontSize: "24px",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        textAlign: "center",
                      }}
                    />
                  </div>
                  <div className="mb-4 mx-auto">
                    <span>
                      Didn't receive OTP?{" "}
                      <span
                        className={`text-primary cursor-pointer ${resendTimer > 0 ? "disabled" : ""
                          }`}
                        onClick={resendTimer === 0 ? sendPhoneOtp : null}
                      >
                        {resendTimer > 0
                          ? `Resend OTP in ${resendTimer}s`
                          : "Resend OTP"}
                      </span>
                    </span>
                  </div>
                  <div className="form-group mb-8">
                    <button
                      className="btn btn-primary btn-medium w-100 rounded-5 text-uppercase"
                      disabled={otp.length !== 6}
                      onClick={handleOTPverification}
                    >
                      Verify{" "}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </ModalStyled>
  );
};

export default ModalOtpVerify;
