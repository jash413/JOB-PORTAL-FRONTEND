import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import GlobalContext from "../../context/GlobalContext";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { registerUserValidationSchema } from "../../utils/validations/validations";
import { toast } from "react-toastify";
import axiosInterceptors from "../../libs/integration/axiosInterceptors";
import { REQ } from "../../libs/constants";
import { GoogleLogin } from "@react-oauth/google";
import { navigate } from "gatsby";
import axios from "axios";

const ModalStyled = styled(Modal)`
  /* &.modal {
    z-index: 10050;
  } */
`;

const ModalSignUp = (props) => {
  const gContext = useContext(GlobalContext);
  const [showPassFirst, setShowPassFirst] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [navigationTriggered, setNavigationTriggered] = useState(false);
  const companyRegistered = gContext?.companyRegistered;
  const userDetail = gContext?.user;

  const handleClose = () => {
    gContext.toggleSignUpModal();
  };

  const togglePasswordFirst = () => {
    setShowPassFirst(!showPassFirst);
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);
    const payload = {
      ...values,
      login_type: gContext.signUpModalVisible.type,
    };

    try {
      const response = await axiosInterceptors.post(REQ.REGISTER_USER, payload);
      toast.success("User registered successfully!");
      gContext.toggleSignUpModal();
    } catch (error) {
      toast.error(error?.data?.error || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalStyled
      {...props}
      size="lg"
      centered
      show={gContext.signUpModalVisible.visible}
      onHide={gContext.toggleSignUpModal}
    >
      <Modal.Body className="p-0">
        <button
          type="button"
          className="circle-32 btn-reset bg-white pos-abs-tr mt-n6 mr-lg-n6 focus-reset shadow-10"
          onClick={handleClose}
        >
          <i className="fas fa-times"></i>
        </button>
        <div className="login-modal-main bg-white rounded-8 overflow-hidden">
          <div className="row no-gutters">
            <div className="col-lg-5 col-md-6">
              <div className="pt-10 pb-6 pl-11 pr-12 bg-black-2 h-100 d-flex flex-column dark-mode-texts">
                <div className="pb-9">
                  <h3 className="font-size-8 text-white line-height-reset pb-4 line-height-1p4">
                    Create a free account today
                  </h3>
                  <p className="mb-0 font-size-4 text-white">
                    Create your account to continue and explore new jobs.
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
                {/* <div className="or-devider">
                  <span className="font-size-3 line-height-reset">Or</span>
                </div> */}
                <Formik
                  initialValues={{
                    login_name: "",
                    login_email: "",
                    login_pass: "",
                    login_mobile: "",
                  }}
                  validationSchema={registerUserValidationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div className="form-group">
                        <label
                          htmlFor="name"
                          className="font-size-4 text-black-2 font-weight-semibold line-height-reset"
                        >
                          Name
                        </label>
                        <Field
                          type="text"
                          name="login_name"
                          className="form-control"
                          placeholder="Enter your name"
                          id="name"
                        />
                        <ErrorMessage
                          name="login_name"
                          component="div"
                          className="text-danger"
                        />
                      </div>

                      <div className="form-group">
                        <label
                          htmlFor="email2"
                          className="font-size-4 text-black-2 font-weight-semibold line-height-reset"
                        >
                          E-mail
                        </label>
                        <Field
                          type="email"
                          name="login_email"
                          className="form-control"
                          placeholder="example@gmail.com"
                          id="email2"
                        />
                        <ErrorMessage
                          name="login_email"
                          component="div"
                          className="text-danger"
                        />
                      </div>

                      <div className="form-group">
                        <label
                          htmlFor="phone"
                          className="font-size-4 text-black-2 font-weight-semibold line-height-reset"
                        >
                          Phone
                        </label>
                        <Field
                          type="text"
                          name="login_mobile"
                          className="form-control"
                          placeholder="Enter your phone number"
                          id="phone"
                        />
                        <ErrorMessage
                          name="login_mobile"
                          component="div"
                          className="text-danger"
                        />
                      </div>

                      <div className="form-group">
                        <label
                          htmlFor="password"
                          className="font-size-4 text-black-2 font-weight-semibold line-height-reset"
                        >
                          Password
                        </label>
                        <div className="position-relative">
                          <Field
                            type={showPassFirst ? "password" : "text"}
                            name="login_pass"
                            className="form-control"
                            id="password"
                            placeholder="Enter password"
                          />
                          <a
                            href="/#"
                            className="show-password pos-abs-cr fas mr-6 text-black-2"
                            onClick={(e) => {
                              e.preventDefault();
                              togglePasswordFirst();
                            }}
                          >
                            <span className="d-none">none</span>
                          </a>
                        </div>
                        <ErrorMessage
                          name="login_pass"
                          component="div"
                          className="text-danger"
                        />
                      </div>

                      <div className="form-group">
                        <Field
                          type="checkbox"
                          name="terms"
                          id="terms-check2"
                          className="d-none"
                        />
                        <label
                          htmlFor="terms-check2"
                          className="gr-check-input d-flex mr-3"
                        >
                          <span className="checkbox mr-5"></span>
                          <span className="font-size-3 mb-0 line-height-reset d-block">
                            Agree to the{" "}
                            <a href="/#" className="text-primary">
                              Terms & Conditions
                            </a>
                          </span>
                        </label>
                      </div>

                      <div className="form-group mb-8">
                        <button
                          type="submit"
                          className="btn btn-primary btn-medium w-100 rounded-5 text-uppercase"
                          disabled={isSubmitting || isLoading}
                        >
                          Sign Up
                        </button>
                      </div>

                      <p className="font-size-4 text-center heading-default-color">
                        Already have an account?{" "}
                        <a
                          href="/#"
                          className="text-primary"
                          onClick={(e) => {
                            e.preventDefault();
                            gContext.toggleSignUpModal();
                            gContext.toggleSignInModal();
                          }}
                        >
                          Log in
                        </a>
                      </p>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </ModalStyled>
  );
};

export default ModalSignUp;
