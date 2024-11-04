import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import GlobalContext from "../../context/GlobalContext";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { profileValidationSchema } from "../../utils/validations/validations";

const ModalStyled = styled(Modal)`
  /* &.modal {
    z-index: 10050;
  } */
`;

const ModalProfile = (props) => {
    const gContext = useContext(GlobalContext);
    const [profileImagePreview, setProfileImagePreview] = useState(null);
    const userDetails = JSON.parse(gContext?.user);

    const handleClose = () => {
        gContext.toggleProfileModal();
    };

    const handleSubmit = (values, actions) => {
        console.log("Form values: ", values);
        actions.setSubmitting(false);
        // handleClose();
    };

    return (
        <ModalStyled
            {...props}
            size="lg"
            centered
            show={gContext.profileModal}
            onHide={gContext.toggleProfileModal}
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
                                <h5 className="mb-6">Profile Information</h5>
                                <Formik
                                    initialValues={{
                                        can_name: "",
                                        can_email: userDetails?.login_email,
                                        can_mobn: userDetails?.login_mobile,
                                        can_job_cate: "",
                                        reg_date: "",
                                        profileImage: null,
                                        resume: null,
                                    }}
                                    validationSchema={profileValidationSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({ setFieldValue, isSubmitting }) => (
                                        <Form>
                                            <div className="form-group">
                                                <label>Name</label>
                                                <Field
                                                    type="text"
                                                    name="can_name"
                                                    className="form-control"
                                                />
                                                <ErrorMessage
                                                    name="can_name"
                                                    component="div"
                                                    className="text-danger"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Email</label>
                                                <Field
                                                    type="email"
                                                    name="can_email"
                                                    className="form-control"
                                                    disabled={userDetails?.email_ver_status === 1}
                                                />
                                                <ErrorMessage
                                                    name="can_email"
                                                    component="div"
                                                    className="text-danger"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Mobile Number</label>
                                                <Field
                                                    type="text"
                                                    name="can_mobn"
                                                    className="form-control"
                                                    disabled={userDetails?.phone_ver_status === 1}
                                                />
                                                <ErrorMessage
                                                    name="can_mobn"
                                                    component="div"
                                                    className="text-danger"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Job Category</label>
                                                <Field
                                                    type="number"
                                                    name="can_job_cate"
                                                    className="form-control"
                                                />
                                                <ErrorMessage
                                                    name="can_job_cate"
                                                    component="div"
                                                    className="text-danger"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Registration Date</label>
                                                <Field
                                                    type="date"
                                                    name="reg_date"
                                                    className="form-control"
                                                />
                                                <ErrorMessage
                                                    name="reg_date"
                                                    component="div"
                                                    className="text-danger"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Profile Image</label>
                                                <input
                                                    type="file"
                                                    name="profileImage"
                                                    className="form-control"
                                                    onChange={(event) => {
                                                        const file = event.currentTarget.files[0];
                                                        setFieldValue("profileImage", file);
                                                        setProfileImagePreview(
                                                            file ? URL.createObjectURL(file) : null
                                                        );
                                                    }}
                                                />
                                                <ErrorMessage
                                                    name="profileImage"
                                                    component="div"
                                                    className="text-danger"
                                                />
                                                {profileImagePreview && (
                                                    <div className="mt-2">
                                                        <img
                                                            src={profileImagePreview}
                                                            alt="Profile Preview"
                                                            className="img-thumbnail"
                                                            style={{ maxWidth: "150px", height: "auto" }}
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="form-group">
                                                <label>Resume</label>
                                                <input
                                                    type="file"
                                                    name="resume"
                                                    className="form-control"
                                                    onChange={(event) => {
                                                        setFieldValue("resume", event.currentTarget.files[0]);
                                                    }}
                                                />
                                                <ErrorMessage
                                                    name="resume"
                                                    component="div"
                                                    className="text-danger"
                                                />
                                            </div>

                                            <div className="d-flex justify-content-end">
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary mr-2"
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

export default ModalProfile;
