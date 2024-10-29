import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import GlobalContext from "../../context/GlobalContext";
import { REQ } from "../../libs/constants";
import { toast } from "react-toastify";
import axiosInterceptors from "../../libs/integration/axiosInterceptors";

const ModalStyled = styled(Modal)`
  /* &.modal {
    z-index: 10050;
  } */
`;

const ModalEmailVerify = (props) => {
    const gContext = useContext(GlobalContext);
    const [email] = useState(gContext.user ? JSON.parse(gContext.user)?.login_email : "");

    const handleClose = () => {
        gContext.toggleEmailVerifyModal();
    };

    const sendEmailVerify = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            toast.error("Please log in again.");
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

    useEffect(() => {
        if (gContext.emailVerifyVisible) {
            sendEmailVerify();
        }
    }, [gContext.emailVerifyVisible]);

    return (
        <ModalStyled
            {...props}
            size="lg"
            centered
            show={gContext.emailVerifyVisible}
            onHide={gContext.toggleEmailVerifyModal}
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
                        </div>
                        <div className="col-lg-7 col-md-6">
                            <div className="bg-white-2 h-100 px-11 pt-11 pb-7">
                                <div className="pt-8 pb-10 pl-11 pr-12 h-100 d-flex flex-column dark-mode-texts">
                                    <h3 className="font-size-6 text-black line-height-reset pb-4 mx-auto">
                                        Verify your email address
                                    </h3>
                                    <p className="mb-0 font-size-4 text-center line-height-0">
                                        A verification email has been sent to your email{" "}
                                        <span className="font-weight-bold text-black">
                                            {email ?? "example@one.com"}
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
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </ModalStyled>
    );
};

export default ModalEmailVerify;
