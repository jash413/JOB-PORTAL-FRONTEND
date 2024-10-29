import React, { useContext } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import GlobalContext from "../../context/GlobalContext";
import { useFormik } from "formik";
import { REQ } from "../../libs/constants";
import { toast } from "react-toastify";
import axiosInterceptors from "../../libs/integration/axiosInterceptors";
import { forgetPasswordValidationSchema } from "../../utils/validations/validations";

const ModalStyled = styled(Modal)`
  /* &.modal {
    z-index: 10050;
  } */
`;

const ModalForgetPassword = (props) => {
  const gContext = useContext(GlobalContext);
  const handleClose = () => {
    gContext.toggleForgetPasswordModal();
  };

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgetPasswordValidationSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        const response = await axiosInterceptors.post(REQ.FORGET_PASSWORD, {
          login_email: values.email,
        });
        gContext.toggleForgetPasswordModal();
        toast.success("Reset email link send successfully!");
        resetForm();
      } catch (error) {
        const errorMessage =
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Error in sending link";

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
      show={gContext.forgetPasswordModalVisible}
      onHide={gContext.toggleForgetPasswordModal}
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
                    Reset Password
                  </h3>
                  <p className="mb-0 font-size-4 text-white">
                    Reset password to continue login and explore jobs.
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
                      <span className="d-none d-xs-block">Reset Password</span>
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
                      Enter E-mail for password reset.
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="example@gmail.com"
                      id="email"
                      {...formik.getFieldProps("email")}
                    />
                    {formik.errors.email && formik.touched.email ? (
                      <div className="text-danger">{formik.errors.email}</div>
                    ) : null}
                  </div>
                  <div className="form-group mb-8">
                    <button
                      className="btn btn-primary btn-medium w-100 rounded-5 text-uppercase"
                      disabled={formik.isSubmitting}
                    >
                      Send link
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

export default ModalForgetPassword;
