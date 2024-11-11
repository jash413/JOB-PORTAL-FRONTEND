import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import GlobalContext from "../../context/GlobalContext";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { empProfileValidationSchema } from "../../utils/validations/validations";
import axiosInterceptors from "../../libs/integration/axiosInterceptors";
import { REQ } from "../../libs/constants";
import { toast } from "react-toastify";

const ModalStyled = styled(Modal)`
  /* &.modal {
    z-index: 10050;
  } */
`;

const ModalProfile = (props) => {
    const { fetchDetails, fetchUserProfile } = props;
    const gContext = useContext(GlobalContext);
    const userDetails = JSON.parse(gContext?.user);

    const [initialValues, setInitialValues] = useState({
        login_name: userDetails?.login_name || "",
        login_email: userDetails?.login_email || "",
        login_mobile: userDetails?.login_mobile || ""
    });

    useEffect(() => {
        setInitialValues({
            login_name: userDetails?.login_name || "",
            login_email: userDetails?.login_email || "",
            login_mobile: userDetails?.login_mobile || ""
        })
    }, [userDetails]);

    const handleClose = () => {
        gContext.toggleEmpProfileModal();
    };

    const handleCanProfileSubmit = async (values, actions) => {
        try {
            const response = await axiosInterceptors.put(
                REQ?.UPDATE_EMP_PROFILE,
                values
            );
            const userDetails = JSON.parse(gContext?.user);

            const updatedUserDetails = {
                ...userDetails,
                can_code: response?.can_code,
            };
            gContext.setUser(JSON.stringify(updatedUserDetails));
            handleClose();
            fetchDetails();
            fetchUserProfile();
            toast.success("Profile updated successfully.");
        } catch (error) {
            console.error("API error:", error);
        } finally {
            actions.setSubmitting(false);
        }
    }

    return (
        <ModalStyled
            {...props}
            size="lg"
            centered
            show={gContext.empProfileModal}
            onHide={gContext.toggleEmpProfileModal}
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
                                    initialValues={initialValues}
                                    enableReinitialize={true}
                                    validationSchema={empProfileValidationSchema}
                                    onSubmit={handleCanProfileSubmit}
                                >
                                    {({ isSubmitting }) => (
                                        <Form>
                                            <div className="form-group">
                                                <label>Name</label>
                                                <Field
                                                    type="text"
                                                    name="login_name"
                                                    className="form-control"
                                                />
                                                <ErrorMessage
                                                    name="login_name"
                                                    component="div"
                                                    className="text-danger"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Email</label>
                                                <Field
                                                    type="email"
                                                    name="login_email"
                                                    className="form-control"
                                                />
                                                <ErrorMessage
                                                    name="login_email"
                                                    component="div"
                                                    className="text-danger"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Mobile Number</label>
                                                <Field
                                                    type="text"
                                                    name="login_mobile"
                                                    className="form-control"
                                                />
                                                <ErrorMessage
                                                    name="login_mobile"
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

export default ModalProfile;
