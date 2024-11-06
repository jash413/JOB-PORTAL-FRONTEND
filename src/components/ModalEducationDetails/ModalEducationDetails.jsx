import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { educationDetailsValidationSchema } from "../../utils/validations/validations"; // Update schema name as needed
import GlobalContext from "../../context/GlobalContext";
import { REQ } from "../../libs/constants";
import axiosInterceptors from "../../libs/integration/axiosInterceptors";
import { toast } from "react-toastify";

const ModalStyled = styled(Modal)`
  /* &.modal {
    z-index: 10050;
  } */
`;

const ModalEducationDetails = (props) => {
    const { open, setOpen, candEduId, setCandEduId } = props;
    const gContext = useContext(GlobalContext);
    const [candidateRegistered, setCandidateRegistered] = useState(false);
    const [candEduAdded, setCandEduAdded] = useState(false);
    const [initialValues, setInitialValues] = useState({
        can_edu: "",
        can_scho: "",
        can_pasy: "",
        can_perc: "",
        can_stre: "",
        can_cgpa: "",
    });

    const handleClose = () => {
        setOpen((prev) => !prev);
        setCandEduId(null);
        // setInitialValues({
        //     can_edu: "",
        //     can_scho: "",
        //     can_pasy: "",
        //     can_perc: "",
        //     can_stre: "",
        //     can_cgpa: "",
        // })
        setCandEduAdded(false);
        setCandidateRegistered(false);
    };

    const handleSubmit = async (values, actions) => {
        if (candidateRegistered) {
            actions.setSubmitting(false);
            try {
                if (candEduAdded) {
                    await axiosInterceptors.put(REQ?.UPDATE_CANDIDATE_EDUCATION.replace(":id", candEduId), values);
                } else {
                    await axiosInterceptors.post(REQ?.CANDIDATE_EDUCATION, values);
                }
                handleClose();
            } catch (error) {
                console.error('API error:', error);
            } finally {
                actions.setSubmitting(false);
            }
        } else {
            actions.setSubmitting(false);
            toast?.error('Please register first');
        }
    };

    useEffect(() => {
        const userDetails = JSON.parse(gContext?.user);
        if (userDetails && userDetails?.login_id && open) {
            axiosInterceptors
                .get(REQ.GET_CANDIDATE.replace(":id", userDetails?.login_id), {
                    id: userDetails?.login_id,
                })
                .then((response) => {
                    if (response?.can_code) {
                        setCandidateRegistered(true);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching user details:", error);
                });
        }
    }, [open]);


    useEffect(() => {
        if (candEduId && open) {
            setInitialValues({
                can_edu: candEduId?.can_edu || "",
                can_scho: candEduId?.can_scho || "",
                can_pasy: candEduId?.can_pasy || "",
                can_perc: candEduId?.can_perc || "",
                can_stre: candEduId?.can_stre || "",
                can_cgpa: candEduId?.can_cgpa || "",
            });
        }
    }, [candEduId, open]);

    return (
        <ModalStyled
            {...props}
            size="lg"
            centered
            show={open}
        // onHide={() => setOpen(false)}
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
                                <h4 className="mb-5">Educational Details Form</h4>
                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={educationDetailsValidationSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({ isSubmitting }) => (
                                        <Form>
                                            <div className="form-group">
                                                <label>Education Level</label>
                                                <Field
                                                    type="text"
                                                    name="can_edu"
                                                    placeholder="Enter education level"
                                                    className="form-control"
                                                />
                                                <ErrorMessage
                                                    name="can_edu"
                                                    component="div"
                                                    className="text-danger"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>School/University Name</label>
                                                <Field
                                                    type="text"
                                                    name="can_scho"
                                                    placeholder="Enter school/university name"
                                                    className="form-control"
                                                />
                                                <ErrorMessage
                                                    name="can_scho"
                                                    component="div"
                                                    className="text-danger"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Passing Year</label>
                                                <Field
                                                    type="text"
                                                    name="can_pasy"
                                                    placeholder="Enter passing year"
                                                    className="form-control"
                                                />
                                                <ErrorMessage
                                                    name="can_pasy"
                                                    component="div"
                                                    className="text-danger"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Percentage</label>
                                                <Field
                                                    type="number"
                                                    name="can_perc"
                                                    placeholder="Enter percentage"
                                                    className="form-control"
                                                />
                                                <ErrorMessage
                                                    name="can_perc"
                                                    component="div"
                                                    className="text-danger"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Stream/Major</label>
                                                <Field
                                                    type="text"
                                                    name="can_stre"
                                                    placeholder="Enter stream/major"
                                                    className="form-control"
                                                />
                                                <ErrorMessage
                                                    name="can_stre"
                                                    component="div"
                                                    className="text-danger"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>CGPA</label>
                                                <Field
                                                    type="number"
                                                    name="can_cgpa"
                                                    placeholder="Enter CGPA"
                                                    className="form-control"
                                                />
                                                <ErrorMessage
                                                    name="can_cgpa"
                                                    component="div"
                                                    className="text-danger"
                                                />
                                            </div>

                                            {/* <div className="form-group">
                                                <label>Unique Code</label>
                                                <Field
                                                    type="text"
                                                    name="can_code"
                                                    placeholder="Enter unique code"
                                                    className="form-control"
                                                />
                                                <ErrorMessage
                                                    name="can_code"
                                                    component="div"
                                                    className="text-danger"
                                                />
                                            </div> */}

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

export default ModalEducationDetails;
