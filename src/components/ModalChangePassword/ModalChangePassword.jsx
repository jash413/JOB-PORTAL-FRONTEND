import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import GlobalContext from "../../context/GlobalContext";
import { useFormik } from "formik";
import { REQ } from "../../libs/constants";
import { toast } from "react-toastify";
import axiosInterceptors from "../../libs/integration/axiosInterceptors";
import { resetPasswordValidationSchema } from "../../utils/validations/validations";
import { getContrast } from "polished";
import { data } from "@remix-run/router";

const ModalStyled = styled(Modal)`
  /* &.modal {
    z-index: 10050;
  } */
`;

const ModalChangePassword = (props) => {
  const [showPass, setShowPass] = useState(true);
  const gContext = useContext(GlobalContext);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const path = window.location.pathname;
    const tokenFromPath = path.split("/reset-password/")[1];
    setToken(tokenFromPath);
  }, []);
  const handleClose = () => {
    gContext.toggleChangePasswordModal();
  };

  const togglePassword = () => {
    setShowPass(!showPass);
  };

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: resetPasswordValidationSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        const response = await axiosInterceptors.post(REQ.RESET_PASSWORD, {
          token: token,
          newPassword: values.confirmPassword.toString(),
        });
        gContext.toggleChangePasswordModal();
        const successMessage =
          response?.data || response?.message || "Password reset successfull!";
        toast.success(successMessage);
        gContext.toggleSignInModal();
        resetForm();
      } catch (error) {
        const errorMessage =
          error?.data?.error ||
          error?.data?.message ||
          "Error in setting password";
        toast.error(errorMessage);
        setErrors({ apiError: errorMessage });
      } finally {
        setSubmitting(false);
      }
    },
  });
  return (
    <ModalStyled
      {...props}
      size="lg"
      centered
      show={gContext.changePasswordModalVisible}
      onHide={gContext.toggleChangePasswordModal}
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
                  <h3 className="font-size-8 text-white line-height-reset pb-4 line-height-1p4">
                    Change Password
                  </h3>
                  <p className="mb-0 font-size-4 text-white">
                    Change password to continue login and explore jobs.
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
                <div className="row">
                  <div className="col-4 col-xs-12">
                    <a
                      href="/#"
                      className="font-size-4 font-weight-semibold position-relative text-white bg-poppy h-px-48 flex-all-center w-100 px-6 rounded-5 mb-4"
                    >
                      <span className="d-none d-xs-block">Change Password</span>
                    </a>
                  </div>
                </div>

                <form action="/" onSubmit={formik.handleSubmit}>
                  <div className="form-group">
                    <label
                      htmlFor="newPassword"
                      className="font-size-4 text-black-2 font-weight-semibold line-height-reset"
                    >
                      New Password
                    </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        name="newPassword"
                        className="form-control"
                        id="newPassword"
                        placeholder="Enter password"
                        {...formik.getFieldProps("newPassword")}
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
                      {formik.errors.newPassword &&
                      formik.touched.newPassword ? (
                        <div className="text-danger">
                          {formik.errors.newPassword}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="form-group">
                    <label
                      htmlFor="confirmPassword"
                      className="font-size-4 text-black-2 font-weight-semibold line-height-reset"
                    >
                      Confirm Password
                    </label>
                    <div className="position-relative">
                      <input
                        type={showPass ? "password" : "text"}
                        name="confirmPassword"
                        className="form-control"
                        id="confirmPassword"
                        placeholder="Enter password"
                        {...formik.getFieldProps("confirmPassword")}
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
                      {formik.errors.confirmPassword &&
                      formik.touched.confirmPassword ? (
                        <div className="text-danger">
                          {formik.errors.confirmPassword}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="form-group mb-8">
                    <button
                      className="btn btn-primary btn-medium w-100 rounded-5 text-uppercase"
                      disabled={formik.isSubmitting}
                    >
                      Submit Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </ModalStyled>
  );
};

export default ModalChangePassword;
