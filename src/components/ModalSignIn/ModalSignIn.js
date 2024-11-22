import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import GlobalContext from "../../context/GlobalContext";
import { useFormik } from "formik";
import { REQ } from "../../libs/constants";
import { toast } from "react-toastify";
import axiosInterceptors from "../../libs/integration/axiosInterceptors";
import { loginUserValidationSchema } from "../../utils/validations/validations";
import OtpInput from "react-otp-input";
import { navigate } from "gatsby";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

const ModalStyled = styled(Modal)`
  /* &.modal {
    z-index: 10050;
  } */
`;

const ModalSignIn = (props) => {
  const [showPass, setShowPass] = useState(true);
  const gContext = useContext(GlobalContext);
  const [verificationStep, setVerificationStep] = useState(null);
  const [otp, setOtp] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const companyRegistered = gContext.companyRegistered;
  const [userDetail, setUserDetail] = useState(null);
  // const [isRemember, setIsRemember] = useState(false);

  const handleClose = () => {
    gContext.toggleSignInModal();
    setVerificationStep(null);
  };

  const togglePassword = () => {
    setShowPass(!showPass);
  };

  const handleRememberMeChange = () => {
    // setIsRemember(!isRemember);
    gContext.setRememberMe(!gContext.rememberMe);
  };

  const sendPhoneOtp = async () => {
    const token =
      sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
    if (!token) {
      toast.error("Please log in again.");
      setVerificationStep(null);
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

  const sendEmailVerify = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Please log in again.");
      setVerificationStep(null);
      return;
    }
    try {
      const response = await axiosInterceptors.post(
        REQ.SEND_EMAIL_VERIFY,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(
        response?.message ?? "Verification email sent successfully!"
      );
    } catch (error) {
      toast.error("Error sending OTP. Please try again.");
    }
  };

  const handleOTPverification = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Please log in again.");
      setVerificationStep(null);
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
      const { email_ver_status } = response.user;
      gContext.setUser(JSON.stringify(response?.user));
      if (email_ver_status === 0) {
        setVerificationStep("email");
        setEmail(response?.user?.login_email);
        await sendEmailVerify();
      } else {
        setVerificationStep(null);
        gContext.toggleSignInModal();
      }
    } catch (error) {
      toast.error("Error verifying OTP. Please try again.");
    }
  };

  const fetchUserProfile = async () => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token) {
      toast.error("Please log in again.");
      setVerificationStep(null);
      return;
    }
    try {
      const response = await axiosInterceptors.get(REQ.PROFILE_DETAILS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      gContext.setUser(JSON.stringify(response));
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast.error("Failed to fetch user profile. Please try again.");
    }
  };

  useEffect(() => {
    if (userDetail && verificationStep === null) {
      console.log("Company Registered:", companyRegistered);
      console.log("User Type:", userDetail?.login_type);

      if (!companyRegistered && userDetail?.login_type === "EMP") {
        navigate("/profile");
      } else {
        navigate("/");
      }

      gContext.toggleSignInModal();
    }
  }, [userDetail, verificationStep, companyRegistered]);

  // console.log(isRemember, "isRemember");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginUserValidationSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      // console.log(isRemember, "signIn");
      try {
        const response = await axiosInterceptors.post(REQ.LOGIN_USER, {
          login_email: values.email,
          login_pass: values.password,
        });
        const { email_ver_status, phone_ver_status } = response.user;
        const token = response.token;

        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(response?.user));

        gContext.setUser(JSON.stringify(response?.user));
        gContext.setToken(token);
        if (phone_ver_status === 0) {
          setVerificationStep("phone");
          setOtp("");
          setPhoneNumber(response?.user?.login_mobile);
          await sendPhoneOtp();
        } else if (email_ver_status === 0) {
          setVerificationStep("email");
          setEmail(response?.user?.login_email);
          await sendEmailVerify();
        } else {
          resetForm();
          const successMessage =
            response?.data || response?.message || "User login successful!";
          toast.success(successMessage);

          if (
            response?.user?.login_type === "EMP" &&
            response?.user?.phone_ver_status === 1 &&
            response?.user?.email_ver_status === 1 &&
            response?.user?.user_approval_status === 1
          ) {
            navigate("/dashboard-main");
          } else if (
            response?.user?.login_type === "EMP" &&
            (response?.user?.phone_ver_status === 0 ||
              response?.user?.email_ver_status === 0 ||
              response?.user?.user_approval_status === 0)
          ) {
            navigate("/profile");
          } else if (
            response?.user?.login_type === "CND" &&
            response?.user?.phone_ver_status === 1 &&
            response?.user?.email_ver_status === 1 &&
            response?.user?.user_approval_status === 1 &&
            gContext?.searchQuery?.bring
          ) {
            navigate("/search-jobs");
          } else if (response?.user?.login_type === "CND") {
            navigate("/profile");
          }
          gContext.toggleSignInModal();
        }
        fetchUserProfile();
      } catch (error) {
        const errorMessage =
          error?.data?.error ||
          error?.data?.message ||
          "Error logging in. Please try again.";

        toast.error(errorMessage);
        setErrors({ apiError: errorMessage });
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (resendTimer > 0) {
      const timerId = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [resendTimer]);

  const handleGoogleSuccess = async (response) => {
    const googleToken = response.credential;

    if (!googleToken) {
      toast.error("Failed to retrieve Google token");
      return;
    }

    try {
      localStorage.setItem("authToken", googleToken);

      const res = await axios.post(REQ.GET_GOOGLE_USER, {
        token: googleToken,
        login_type: gContext.signInModalVisible.type,
      });

      const user = res?.data?.user;
      const token = res?.data?.token;

      if (user) {
        gContext.setUser(JSON.stringify(user));
        gContext.setToken(token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("authToken", token);
        toast.success("Signed in with Google successfully!");

        if (user.phone_ver_status === 0) {
          if (user.login_mobile) {
            setVerificationStep("phone");
            setPhoneNumber(user.login_mobile);
            await sendPhoneOtp();
          }
          gContext.toggleSignInModal();
        } else if (user.email_ver_status === 0) {
          setVerificationStep("email");
          setEmail(user.login_email);
          await sendEmailVerify();
        } else {
          gContext.toggleSignInModal();

          if (
            user.login_type === "EMP" &&
            user.phone_ver_status === 1 &&
            user.email_ver_status === 1 &&
            user.user_approval_status === 1
          ) {
            navigate("/dashboard-main");
          } else {
            navigate("/profile");
          }
        }

        // Fetch and update user profile
        fetchUserProfile();
      } else {
        console.error("Invalid backend response structure:", res.data);
        toast.error("Google sign-in failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      toast.error("An error occurred during Google sign-in!");
    }
  };

  const handleGoogleFailure = (error) => {
    toast.error("Google login failed!");
  };

  return (
    <ModalStyled
      {...props}
      size="lg"
      centered
      show={gContext.signInModalVisible.visible}
      onHide={gContext.toggleSignInModal}
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
              {!verificationStep ? (
                <div className="pt-10 pb-6 pl-11 pr-12 bg-black-2 h-100 d-flex flex-column dark-mode-texts">
                  <div className="pb-9">
                    <h3 className="font-size-8 text-white line-height-reset pb-4 line-height-1p4">
                      Welcome Back
                    </h3>
                    <p className="mb-0 font-size-4 text-white">
                      Log in to continue your account and explore new jobs.
                    </p>
                    <p className="mt-3 font-size-4 text-white">
                      Log in as{" "}
                      {gContext.signInModalVisible.type === "EMP"
                        ? "employer"
                        : "candidate"}
                      .
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
              ) : verificationStep === "phone" ? (
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
              ) : (
                <div className="pt-10 pb-6 pl-11 pr-12 bg-black-2 h-100 d-flex flex-column dark-mode-texts">
                  <div className="pb-9">
                    <p className="mb-0 font-size-6 text-white">
                      Email Verification
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
              )}
            </div>
            <div className="col-lg-7 col-md-6">
              <div className="bg-white-2 h-100 px-11 pt-11 pb-7">
                {!verificationStep ? (
                  <>
                    <div className="row">
                      <div className="col-4 col-xs-12">
                        <GoogleLogin
                          onSuccess={handleGoogleSuccess}
                          onError={handleGoogleFailure}
                          isSignedIn={true}
                          useOneTap
                          className="w-100 h-100 position-absolute top-0 start-0"
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                          }}
                        />
                      </div>
                    </div>
                    <div className="or-devider">
                      <span className="font-size-3 line-height-reset ">Or</span>
                    </div>
                    <form action="/" onSubmit={formik.handleSubmit}>
                      <div className="form-group">
                        <label
                          htmlFor="email"
                          className="font-size-4 text-black-2 font-weight-semibold line-height-reset"
                        >
                          E-mail
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="example@gmail.com"
                          id="email"
                          {...formik.getFieldProps("email")}
                        />
                        {formik.errors.email && formik.touched.email ? (
                          <div className="text-danger">
                            {formik.errors.email}
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group">
                        <label
                          htmlFor="password"
                          className="font-size-4 text-black-2 font-weight-semibold line-height-reset"
                        >
                          Password
                        </label>
                        <div className="position-relative">
                          <input
                            type={showPass ? "password" : "text"}
                            className="form-control"
                            id="password"
                            placeholder="Enter password"
                            {...formik.getFieldProps("password")}
                          />
                          <a
                            href="/#"
                            className="show-password pos-abs-cr fas mr-6 text-black-2"
                            onClick={(e) => {
                              e.preventDefault();
                              togglePassword();
                            }}
                          >
                            <span className="d-none">none</span>
                          </a>
                          {formik.errors.password && formik.touched.password ? (
                            <div className="text-danger">
                              {formik.errors.password}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <div className="form-group d-flex flex-wrap justify-content-between">
                        <label
                          htmlFor="terms-check"
                          className="gr-check-input d-flex  mr-3"
                        >
                          <input
                            className="d-none"
                            type="checkbox"
                            id="terms-check"
                            // checked={gContext?.rememberMe}
                            onChange={handleRememberMeChange}
                          />
                          <span className="checkbox mr-5"></span>
                          <span className="font-size-3 mb-0 line-height-reset mb-1 d-block">
                            Remember Me
                          </span>
                        </label>
                        <a
                          href="/#"
                          className="font-size-3 text-dodger line-height-reset"
                          onClick={(e) => {
                            e.preventDefault();
                            gContext.toggleSignInModal();
                            gContext.toggleForgetPasswordModal();
                          }}
                        >
                          Forget Password
                        </a>
                      </div>
                      <div className="form-group mb-8">
                        <button
                          className="btn btn-primary btn-medium w-100 rounded-5 text-uppercase"
                          disabled={formik.isSubmitting}
                        >
                          Log in{" "}
                        </button>
                      </div>
                    </form>
                  </>
                ) : verificationStep === "phone" ? (
                  <div className="pt-8 pb-10 pl-6 pr-6 h-100 d-flex flex-column dark-mode-texts">
                    <h3 className="font-size-8 text-black line-height-reset pb-4 line-height-1p4 mx-auto">
                      Enter OTP
                    </h3>
                    <p className="mb-0 font-size-4 text-black text-center">
                      We sent a code to{" "}
                      {"*".repeat(phoneNumber?.length - 4) +
                        phoneNumber?.slice(-4)}
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
                          className={`text-primary cursor-pointer ${
                            resendTimer > 0 ? "disabled" : ""
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
                ) : (
                  <div className="pt-8 pb-10 pl-11 pr-12 h-100 d-flex flex-column dark-mode-texts">
                    <h3 className="font-size-6 text-black line-height-reset pb-4 mx-auto">
                      Verify your email address
                    </h3>
                    <p className="mb-0 font-size-4 text-center line-height-0">
                      A verification email has been sent to your email{" "}
                      <span className="font-weight-bold text-black">
                        {email}
                      </span>{" "}
                      Please check your email and click the link provided in the
                      email to complete your account registration.
                    </p>
                    <p className="mb-0 font-size-3 text-center mt-2 text-black line-height-0">
                      If you do not receive the email within the next 5 minutes,
                      use the button below to resend verification email.
                    </p>
                    <div className="form-group mb-8 mt-2">
                      <button
                        className="btn btn-primary btn-medium w-100 rounded-5 text-uppercase"
                        onClick={sendEmailVerify}
                      >
                        Resend Verification Email
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </ModalStyled>
  );
};

export default ModalSignIn;
