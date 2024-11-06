import React, { useContext } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { workExprerienceValidationSchema } from "../../utils/validations/validations";
import axiosInterceptors from "../../libs/integration/axiosInterceptors";
import { REQ } from "../../libs/constants";
import { toast } from "react-toastify";
import GlobalContext from "../../context/GlobalContext";

const ModalStyled = styled(Modal)`
  /* &.modal {
    z-index: 10050;
  } */
`;

const ModalWorkExprerience = (props) => {
  const { expModal, setExpModal } = props;
  const gContext = useContext(GlobalContext);

  const handleClose = () => {
    setExpModal((prev) => !prev);
  };

  const handleSubmit = async (values, actions) => {
    // API call or form handling logic here
    try {
      const response = await axiosInterceptors.post(REQ.CREATE_EXPERIENCE, {
        emp_name: values.emp_name,
        exp_type: values.exp_type,
        exp_desg: values.exp_desg,
        cur_ctc: values.cur_ctc,
        job_stdt: values.job_stdt,
        job_endt: values.job_endt,
      });

      toast.success(`Experience added successfully.`);
      gContext.fetchExperienceDetails();
    } catch (error) {
      const errorMessage =
        error?.data?.error ||
        error?.data?.message ||
        "Error adding experience. Please try again.";
      toast.error(errorMessage);
    }
    actions.setSubmitting(false);
    handleClose();
  };

  return (
    <ModalStyled
      {...props}
      size="lg"
      centered
      show={expModal}
      onHide={() => setExpModal(false)}
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
            <div className="col-lg-12 col-md-12">
              <div className="p-6">
                <h4 className="mb-5">Employee Experience Form</h4>
                <Formik
                  initialValues={{
                    emp_name: "",
                    exp_type: "",
                    exp_desg: "",
                    cur_ctc: "",
                    job_stdt: "",
                    job_endt: "",
                  }}
                  validationSchema={workExprerienceValidationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div className="form-group">
                        <label>Company Name</label>
                        <Field
                          type="text"
                          name="emp_name"
                          placeholder="Enter company name"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="emp_name"
                          component="div"
                          className="text-danger"
                        />
                      </div>

                      <div className="form-group">
                        <label>Experience Type</label>
                        <Field
                          as="select"
                          name="exp_type"
                          className="form-control"
                        >
                          <option value="" label="Select type" />
                          <option value="full-time" label="Full-Time" />
                          <option value="part-time" label="Part-Time" />
                        </Field>
                        <ErrorMessage
                          name="exp_type"
                          component="div"
                          className="text-danger"
                        />
                      </div>

                      <div className="form-group">
                        <label>Job Designation</label>
                        <Field
                          type="text"
                          name="exp_desg"
                          placeholder="Enter job designation"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="exp_desg"
                          component="div"
                          className="text-danger"
                        />
                      </div>

                      <div className="form-group">
                        <label>Current CTC</label>
                        <Field
                          type="text"
                          name="cur_ctc"
                          placeholder="Enter current CTC"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="cur_ctc"
                          component="div"
                          className="text-danger"
                        />
                      </div>

                      <div className="form-group">
                        <label>Start Date</label>
                        <Field
                          type="date"
                          name="job_stdt"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="job_stdt"
                          component="div"
                          className="text-danger"
                        />
                      </div>

                      <div className="form-group">
                        <label>End Date</label>
                        <Field
                          type="date"
                          name="job_endt"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="job_endt"
                          component="div"
                          className="text-danger"
                        />
                      </div>

                      <div className="d-flex justify-content-end">
                        <button
                          type="button"
                          className="btn btn-outline-black mr-2"
                          onClick={handleClose}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={isSubmitting}
                        >
                          Submit
                        </button>
                      </div>
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

export default ModalWorkExprerience;
