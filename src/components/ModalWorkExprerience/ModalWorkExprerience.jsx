import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { workExprerienceValidationSchema } from "../../utils/validations/validations";
import axiosInterceptors from "../../libs/integration/axiosInterceptors";
import { REQ } from "../../libs/constants";
import { toast } from "react-toastify";
import GlobalContext from "../../context/GlobalContext";
import { FaTrashCan } from "react-icons/fa6";

const ModalStyled = styled(Modal)`
  /* &.modal {
    z-index: 10050;
  } */
`;

const ModalWorkExprerience = (props) => {
  const { expModal, setExpModal, experienceData } = props;
  const gContext = useContext(GlobalContext);

  const handleClose = () => {
    setExpModal((prev) => !prev);
  };

  const handleSubmit = async (values, actions) => {
    // API call or form handling logic here
    try {
      if (experienceData) {
        // Update existing experience
        await axiosInterceptors.put(
          REQ.UPDATE_EXPERIENCE(experienceData.exp_id),
          {
            emp_name: values.emp_name,
            exp_type: values.exp_type,
            exp_desg: values.exp_desg,
            cur_ctc: values.cur_ctc,
            job_stdt: values.job_stdt,
            job_endt: values.job_endt,
            can_code: experienceData?.can_code,
          }
        );
        toast.success("Experience updated successfully.");
      } else {
        // Create new experience
        await axiosInterceptors.post(REQ.CREATE_EXPERIENCE, {
          emp_name: values.emp_name,
          exp_type: values.exp_type,
          exp_desg: values.exp_desg,
          cur_ctc: values.cur_ctc,
          job_stdt: values.job_stdt,
          job_endt: values.job_endt,
        });
        toast.success("Experience added successfully.");
      }

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

  const handleRemoveEducation = async () => {
    try {
      if (experienceData) {
        // Update existing experience
        const response = await axiosInterceptors.delete(
          REQ.DELETE_EXPERIENCE(experienceData.exp_id)
        );
        const successMessage =
          response?.data ||
          response?.message ||
          "Experience deleted successfully";

        toast.success(successMessage);
        handleClose();
      }
    } catch (error) {
      const errorMessage =
        error?.data?.error ||
        error?.data?.message ||
        "Error deleting experience.Try again";
      toast.error(errorMessage);
    }
    gContext.fetchExperienceDetails();
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
                <div className="d-flex justify-content-between align-items-center w-100">
                  <h4 className="mb-5">Employee Experience Form</h4>

                  <span
                    title="Remove education"
                    className="bg-transpernent mr-2 rounded text-red px-2 py-1"
                    onClick={handleRemoveEducation}
                  >
                    <FaTrashCan size={20} />
                  </span>
                </div>
                <Formik
                  initialValues={{
                    emp_name: experienceData?.companyName || "",
                    exp_type: experienceData?.exp_type || "",
                    exp_desg: experienceData?.position || "",
                    cur_ctc: experienceData?.currentCTC || "",
                    job_stdt: experienceData?.startDate || "",
                    job_endt: experienceData?.endDate || "",
                  }}
                  enableReinitialize={true}
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
