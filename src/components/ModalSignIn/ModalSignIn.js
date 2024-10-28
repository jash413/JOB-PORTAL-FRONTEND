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

  const handleClose = () => {
    gContext.toggleSignInModal();
    setVerificationStep(null);
  };

  const togglePassword = () => {
    setShowPass(!showPass);
  };

  const sendPhoneOtp = async () => {
    const token = gContext.token;
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
    const token = gContext.token;
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
    const token = gContext.token;
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

      if (email_ver_status === 0) {
        setVerificationStep("email");
        setEmail(response?.user?.login_email);
        await sendEmailVerify();
      } else {
        setVerificationStep(null);
      }
    } catch (error) {
      toast.error("Error verifying OTP. Please try again.");
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginUserValidationSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        const response = await axiosInterceptors.post(REQ.LOGIN_USER, {
          login_email: values.email,
          login_pass: values.password,
        });
        const { email_ver_status, phone_ver_status } = response.user;
        const token = response.token;
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
          toast.success("User login successful!");
          // navigate("/dashboard");
          resetForm();
        }
      } catch (error) {
        const errorMessage =
          error?.response?.data?.error ||
          error?.response?.data?.message ||
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

  return (
    <ModalStyled
      {...props}
      size="lg"
      centered
      show={gContext.signInModalVisible}
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
                        <a
                          href="/#"
                          className="font-size-4 font-weight-semibold position-relative text-white bg-poppy h-px-48 flex-all-center w-100 px-6 rounded-5 mb-4"
                        >
                          <i className="fab fa-google pos-xs-abs-cl font-size-7 ml-xs-4"></i>{" "}
                          <span className="d-none d-xs-block">
                            Log in with Google
                          </span>
                        </a>
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
                          />
                          <span className="checkbox mr-5"></span>
                          <span className="font-size-3 mb-0 line-height-reset mb-1 d-block">
                            Remember password
                          </span>
                        </label>
                        <a
                          href="/#"
                          className="font-size-3 text-dodger line-height-reset"
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
                  <div className="pt-8 pb-10 pl-11 pr-12 h-100 d-flex flex-column dark-mode-texts">
                    <h3 className="font-size-8 text-black line-height-reset pb-4 line-height-1p4 mx-auto">
                      Enter OTP
                    </h3>
                    <p className="mb-0 font-size-4 text-black text-center">
                      We sent a code to{" "}
                      {"*".repeat(phoneNumber.length - 4) +
                        phoneNumber.slice(-4)}
                    </p>
                    <div className="mb-4 mt-8 mx-auto w-100">
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
