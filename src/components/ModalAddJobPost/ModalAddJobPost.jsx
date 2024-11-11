import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import GlobalContext from "../../context/GlobalContext";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup"; // Import Yup for validation
import axiosInterceptors from "../../libs/integration/axiosInterceptors";
import { REQ } from "../../libs/constants";
import { toast } from "react-toastify";
import { TagsInput } from "react-tag-input-component";

const ModalStyled = styled(Modal)`
  /* &.modal {
    z-index: 10050;
  } */
`;

const ModalAddJobPost = (props) => {
    // const { fetchDetails, fetchUserProfile } = props;
    const gContext = useContext(GlobalContext);

    const [jobCategories, setJobCategories] = useState([]);
    const [jobFormInitialValues, setJobFormInitialValues] = useState({
        job_title: "",
        job_description: "",
        job_cate: "",
        job_location: "",
        salary_range: "",
        required_skills: "",
    });

    const handleClose = () => {
        gContext.toggleJobPostModalModal();
    };

    // Validation schema for the new job form fields
    const jobFormValidationSchema = Yup.object().shape({
        job_title: Yup.string().required("Job title is required"),
        job_description: Yup.string().required("Job description is required"),
        job_cate: Yup.string().required("Job category is required"),
        job_location: Yup.string().required("Job location is required"),
        salary_range: Yup.string().required("Salary range is required"),
        required_skills: Yup.array().min(1, "At least one skill is required"),
    });

    const handleJobFormSubmit = async (values, actions) => {
        const payload = {
            ...values,
            required_skills: values.required_skills.join(","),
        };
        try {
            const response = await axiosInterceptors.post(
                REQ?.CREATE_JOBPOST,
                payload
            );
            // console.log("Job post created successfully:", response);
            toast.success("Job post created successfully.");
            handleClose();
        } catch (error) {
            console.error("API error:", error);
        } finally {
            actions.setSubmitting(false);
        }
    };

    useEffect(() => {
        if (gContext.jobPostModal) {
            axiosInterceptors
                .post(REQ.JOB_CATEGORIES, {
                    page: 1,
                    limit: 50,
                })
                .then((response) => {
                    setJobCategories(response?.records);
                })
                .catch((error) => {
                    console.error("Error fetching job categories:", error);
                });
        }
    }, [gContext.jobPostModal]);

    return (
        <ModalStyled
            {...props}
            size="lg"
            centered
            show={gContext.jobPostModal}
            onHide={gContext.toggleJobPostModalModal}
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
                            <div className="bg-white-2 h-100 px-11 pt-11 pb-12">
                                <h5 className="mb-6">Job Information</h5>
                                <Formik
                                    initialValues={jobFormInitialValues}
                                    enableReinitialize={true}
                                    validationSchema={jobFormValidationSchema}
                                    onSubmit={handleJobFormSubmit}
                                >
                                    {({ isSubmitting, setFieldValue }) => (
                                        <Form>
                                            <div className="form-group">
                                                <label>Job Title</label>
                                                <Field
                                                    type="text"
                                                    name="job_title"
                                                    className="form-control"
                                                />
                                                <ErrorMessage
                                                    name="job_title"
                                                    component="div"
                                                    className="text-danger"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Job Description</label>
                                                <Field
                                                    as="textarea"
                                                    name="job_description"
                                                    className="form-control"
                                                    style={{ resize: "none" }}
                                                />
                                                <ErrorMessage
                                                    name="job_description"
                                                    component="div"
                                                    className="text-danger"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Job Category</label>
                                                <Field
                                                    as="select"
                                                    name="job_cate"
                                                    className="form-control"
                                                >
                                                    <option value="">Select Job Category</option>
                                                    {jobCategories.map((category) => (
                                                        <option
                                                            key={category.cate_code}
                                                            value={category.cate_code}
                                                        >
                                                            {category.cate_desc}
                                                        </option>
                                                    ))}
                                                </Field>
                                                <ErrorMessage
                                                    name="job_cate"
                                                    component="div"
                                                    className="text-danger"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Job Location</label>
                                                <Field
                                                    type="text"
                                                    name="job_location"
                                                    className="form-control"
                                                />
                                                <ErrorMessage
                                                    name="job_location"
                                                    component="div"
                                                    className="text-danger"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Salary Range</label>
                                                <Field
                                                    type="text"
                                                    name="salary_range"
                                                    className="form-control"
                                                />
                                                <ErrorMessage
                                                    name="salary_range"
                                                    component="div"
                                                    className="text-danger"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Required Skills</label>
                                                <TagsInput
                                                    value={jobFormInitialValues.required_skills}
                                                    onChange={(newSkills) => setFieldValue("required_skills", newSkills)}
                                                    name="required_skills"
                                                    placeHolder="Enter skills and press enter"
                                                />
                                                <ErrorMessage
                                                    name="required_skills"
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

export default ModalAddJobPost;
