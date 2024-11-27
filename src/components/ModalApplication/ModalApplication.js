import React, { useContext, useEffect, useState } from "react";
import { Link } from "gatsby";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import GlobalContext from "../../context/GlobalContext";

import imgL from "../../assets/image/svg/icon-loaction-pin-black.svg";
import imgP from "../../assets/image/l3/png/pro-img.png";
import { GrScorecard } from "react-icons/gr";
import { REQ } from "../../libs/constants";
import axiosInterceptors from "../../libs/integration/axiosInterceptors";
import { toast } from "react-toastify";
import { calculateDuration } from "../../utils";
import { MdDownload } from "react-icons/md";

const ModalStyled = styled(Modal)`
  /* &.modal {
    z-index: 10050;
  } */
  .modal-dialog {
    margin: 1.75rem auto;
    max-width: 100%;
  }
  .modal-content {
    background: transparent;
  }
`;

const ModalApplication = (props) => {
  const [profileImage, setProfileImage] = useState(null);
  const gContext = useContext(GlobalContext);
  const pathName = typeof window !== "undefined" ? window.location.href : "";

  const handleClose = () => {
    gContext.toggleApplicationModal();
  };

  const applicationId = gContext.applicationModalVisible.data?.id;
  const applicantDetails =
    gContext.applicationModalVisible.data?.candidate ||
    gContext.applicationModalVisible.data?.Candidate;

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      await axiosInterceptors.put(
        REQ.UPDATE_APPLICATION_STATUS(applicationId),
        { status }
      );
      toast.success(`Application ${status} successfully.`);
      gContext.toggleApplicationModal();
      // fetchJobs();
    } catch (error) {
      console.error(`Error updating application status to ${status}:`, error);
      toast.error(`Failed to update application status to ${status}.`);
    }
  };

  const handleDownload = async (fileName) => {
    try {
      const response = await axiosInterceptors.get(
        REQ.DOWNLOAD_RESUME(applicantDetails?.can_code),
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(response);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${fileName}_resume.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  useEffect(() => {
    if (applicantDetails?.can_code) {
      const fetchProfileImg = async () => {
        try {
          const response = await axiosInterceptors.get(
            REQ.DOWNLOAD_PROFILE_IMG(applicantDetails?.can_code),
            { responseType: "blob" }
          );
          if (response) {
            const imageUrl = URL.createObjectURL(response);
            setProfileImage(imageUrl);
          }
        } catch (error) {
          console.error("Error fetching profile image:", error);
        }
      };
      fetchProfileImg();
    }
  }, [applicantDetails?.can_code]);

  return (
    <ModalStyled
      {...props}
      size="lg"
      centered
      show={gContext.applicationModalVisible.visible}
      onHide={gContext.toggleApplicationModal}
    >
      <Modal.Body className="p-0">
        <div className="container position-relative">
          <button
            type="button"
            className="circle-32 btn-reset bg-white pos-abs-tr mt-md-n6 mr-lg-n6 focus-reset z-index-supper"
            onClick={handleClose}
          >
            <i className="fas fa-times"></i>
          </button>
          <div className="login-modal-main bg-white rounded-8 overflow-hidden">
            <div className="row no-gutters">
              {/* <!-- Left Sidebar Start --> */}
              <div className="col-12 col-xl-3 col-lg-4 col-md-5 mb-13 mb-lg-0 border-right border-mercury">
                <div className="pl-lg-5">
                  {/* <!-- Top Start --> */}
                  <div className="bg-white shadow-9 rounded-4">
                    <div className="px-5 text-center border-bottom border-mercury">
                      <div className="py-11">
                        <Link className="mb-4">
                          <img
                            className="circle-54"
                            src={profileImage ?? imgP}
                            alt=""
                          />
                        </Link>
                        <h4 className="mb-0">
                          <p className="text-black-2 font-size-6 font-weight-semibold">
                            {applicantDetails?.can_name}
                          </p>
                        </h4>
                        {/* <p className="mb-8">
                          <p className="text-gray font-size-4">
                            Product Designer
                          </p>
                        </p> */}
                        {/* <div className="icon-link d-flex align-items-center justify-content-center flex-wrap">
                          <Link
                            to="/#"
                            className="text-smoke circle-32 bg-concrete mr-5 hover-bg-green"
                          >
                            <i className="fab fa-linkedin-in"></i>
                          </Link>
                          <Link
                            to="/#"
                            className="text-smoke circle-32 bg-concrete mr-5 hover-bg-green"
                          >
                            <i className="fab fa-facebook-f"></i>
                          </Link>
                          <Link
                            to="/#"
                            className="text-smoke circle-32 bg-concrete mr-5 hover-bg-green"
                          >
                            <i className="fab fa-twitter"></i>
                          </Link>
                          <Link
                            to="/#"
                            className="text-smoke circle-32 bg-concrete mr-5 hover-bg-green"
                          >
                            <i className="fab fa-dribbble"></i>
                          </Link>
                          <Link
                            to="/#"
                            className="text-smoke circle-32 bg-concrete mr-5 hover-bg-green"
                          >
                            <i className="fab fa-behance"></i>
                          </Link>
                        </div> */}
                      </div>
                    </div>
                    {/* <!-- Top End --> */}
                    {/* <!-- Bottom Start --> */}
                    <div className="px-9 pt-lg-5 pt-9 pt-xl-9 pb-5">
                      <h5 className="text-black-2 mb-8 font-size-5">
                        Contact Info
                      </h5>
                      {/* <!-- Single List --> */}
                      <div className="mb-7">
                        <p className="font-size-4 mb-0">Location</p>
                        <h5 className="font-size-4 font-weight-semibold mb-0 text-black-2 text-break">
                          New York , USA
                        </h5>
                      </div>
                      {/* <!-- Single List --> */}
                      {/* <!-- Single List --> */}
                      <div className="mb-7">
                        <p className="font-size-4 mb-0">E-mail</p>
                        <div className="d-flex align-items-start justify-content-between w-100">
                          <h5 className="font-size-4 font-weight-semibold mb-0">
                            <p className="text-black-2 text-break">
                              {applicantDetails?.can_email}
                            </p>
                          </h5>
                        </div>
                      </div>
                      {/* <!-- Single List --> */}
                      {/* <!-- Single List --> */}
                      <div className="mb-7">
                        <p className="font-size-4 mb-0">Phone</p>
                        <div className="d-flex align-items-center justify-content-between w-100">
                          <h5 className="font-size-4 font-weight-semibold mb-0">
                            <span className="text-black-2 text-break">
                              {applicantDetails?.can_mobn}
                            </span>
                          </h5>
                        </div>
                      </div>
                      {/* <!-- Single List --> */}
                      {/* <!-- Single List --> */}
                      <div className="mb-7">
                        <p className="font-size-4 mb-0">Resume</p>
                        {applicantDetails && applicantDetails?.can_resume ? (
                          <div className="my-3 px-2 py-1 d-flex w-max justify-content-between align-items-center">
                            <p className="mb-0 font-size-3">{`${applicantDetails?.can_name}'s resume`}</p>
                            <span style={{ cursor: "pointer" }}>
                              <MdDownload
                                onClick={() =>
                                  handleDownload(applicantDetails?.can_name)
                                }
                              />
                            </span>
                          </div>
                        ) : (
                          <p className="font-size-3 mb-0">
                            Resume not uploaded
                          </p>
                        )}
                      </div>
                      {/* <!-- Single List --> */}
                    </div>
                    {/* <!-- Bottom End --> */}
                  </div>
                </div>
              </div>
              {/* <!-- Left Sidebar End --> */}
              {/* <!-- Middle Content --> */}
              <div
                className={`col-12 order-2 order-lg-1 border-right border-mercury ${
                  pathName.includes("/dashboard-applicants")
                    ? "col-xl-6 col-lg-8 col-md-7"
                    : "col-xl-9 col-lg-8 col-md-7"
                }`}
              >
                <div className="bg-white rounded-4 overflow-auto h-1173">
                  {/* <!-- Excerpt Start --> */}
                  {applicantDetails && applicantDetails?.can_about !== "" && (
                    <div className="pr-xl-0 pr-xxl-14 p-5 px-xs-12 pt-7 pb-5">
                      <h4 className="font-size-6 font-weight-semibold mb-7 mt-5 text-black-2">
                        About
                      </h4>
                      <p className="font-size-4 mb-8">
                        {applicantDetails?.can_about}
                      </p>
                    </div>
                  )}
                  {/* <!-- Excerpt End --> */}
                  {/* <!-- Skills --> */}
                  {applicantDetails && applicantDetails?.can_skill !== "" && (
                    <div className="border-top border-mercury pr-xl-0 pr-xxl-14 p-5 pl-xs-12 pt-7 pb-5">
                      <h4 className="font-size-6 font-weight-semibold mb-7 mt-5 text-black-2">
                        Skills
                      </h4>
                      {applicantDetails?.can_skill.split(",").length > 0 && (
                        <ul className="list-unstyled d-flex align-items-center flex-wrap">
                          {applicantDetails?.can_skill
                            ?.split(",")
                            ?.map((skills, id) => (
                              <li key={id}>
                                <p className="bg-polar text-black-2  mr-6 px-7 mt-2 mb-2 font-size-3 rounded-3 min-height-32 d-flex align-items-center">
                                  {skills}
                                </p>
                              </li>
                            ))}
                        </ul>
                      )}
                    </div>
                  )}
                  {/* <!-- Skills End --> */}
                  {/* <!-- Card Section Start --> */}
                  <div className="border-top border-mercury p-5 pl-xs-12 pt-7 pb-5">
                    <h4 className="font-size-6 font-weight-semibold mb-7 mt-5 text-black-2">
                      Work Exprerience
                    </h4>
                    {/* <!-- Single Card --> */}
                    {applicantDetails &&
                    applicantDetails?.candidate_exp?.length > 0 ? (
                      applicantDetails?.candidate_exp?.map((exp, index) => {
                        const startDate = new Date(exp.job_stdt);
                        const endDate = new Date(exp.job_endt);
                        const duration = `${startDate.toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            year: "numeric",
                          }
                        )} - ${endDate.toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}`;
                        const totalDuration = calculateDuration(
                          exp.job_stdt,
                          exp.job_endt
                        );
                        return (
                          <div className="w-100 mb-9" key={index}>
                            <div className="d-flex align-items-center px-5 py-2 flex-wrap flex-sm-nowrap border rounded">
                              <div className="w-100 mt-n2">
                                <h3 className="mb-0 d-flex align-items-center justify-content-md-between flex-wrap mt-5">
                                  <p className="font-size-6 text-black-2">
                                    {exp?.exp_desg}
                                  </p>
                                </h3>
                                <p className="font-size-4 text-default-color line-height-2">
                                  {exp?.emp_name}
                                </p>
                                <div className="d-flex align-items-center justify-content-md-between flex-wrap">
                                  <p className="font-size-3 text-gray mr-5">
                                    {`${duration} - ${totalDuration}`}
                                  </p>
                                  {/* <p className="font-size-3 text-gray">
                                    <span className="mr-4">
                                      <img src={imgL} alt="Location Icon" />
                                    </span>
                                    {exp?.location}
                                  </p> */}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="font-size-4 text-gray">
                        No experience data available.
                      </p>
                    )}
                    {/* <!-- Single Card End --> */}
                  </div>
                  {/* <!-- Card Section End --> */}
                  {/* <!-- Card Section Start --> */}
                  <div className="border-top border-mercury p-5 pl-xs-12 pt-7 pb-5">
                    <h4 className="font-size-6 font-weight-semibold mb-7 mt-5 text-black-2">
                      Education
                    </h4>
                    {/* <!-- Single Card --> */}
                    {applicantDetails &&
                    applicantDetails?.candidate_edu?.length > 0 ? (
                      applicantDetails?.candidate_edu?.map((edu, i) => (
                        <div key={i} className="w-100 mb-9">
                          <div className="d-flex align-items-center px-5 py-2 flex-wrap flex-sm-nowrap border rounded">
                            {/* <div className="square-72 d-block mr-8 mb-7 mb-sm-0">
                                    <img src={imgB3} alt="" />
                                  </div> */}
                            <div className="w-100 mt-n2">
                              <h3 className="mb-0 d-flex align-items-center justify-content-md-between flex-wrap mt-5">
                                <p className="font-size-6 text-black-2">
                                  {edu?.can_edu} in {edu?.can_stre}
                                </p>
                              </h3>
                              <p className="font-size-4 text-default-color line-height-2">
                                {edu?.can_scho}
                              </p>
                              <div className="d-flex align-items-center justify-content-md-between flex-wrap">
                                <p className="font-size-3 text-gray mr-5">
                                  {edu?.can_pasy}
                                </p>
                                <p className="font-size-3 text-gray">
                                  <span
                                    className="mr-4"
                                    css={`
                                      margin-top: -2px;
                                    `}
                                  >
                                    <GrScorecard />
                                  </span>
                                  {edu?.can_cgpa} CGPA / {edu?.can_perc} %
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <>
                        <p className="font-size-4">
                          No education details found.
                        </p>
                      </>
                    )}
                    {/* <!-- Single Card End --> */}
                  </div>
                  {/* <!-- Card Section End --> */}
                </div>
              </div>
              {/* <!-- Middle Content --> */}
              {/* <!-- Right Sidebar Start --> */}
              {pathName.includes("/dashboard-applicants") && (
                <div className="col-12 col-xl-3 order-3 order-lg-2 bg-default-2">
                  <div className="text-center mb-13 mb-lg-0 mt-12">
                    <button className="btn btn-primary btn-xl mb-7 d-block mx-auto text-uppercase">
                      <Link
                        className="w-100 text-white"
                        to={`mailto:${applicantDetails?.can_email}`}
                      >
                        Contact
                      </Link>
                    </button>
                    <button
                      onClick={() =>
                        updateApplicationStatus(applicationId, "rejected")
                      }
                      className="btn btn-outline-gray btn-xl mb-7 d-block mx-auto text-uppercase"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}
              {/* <!-- Right Sidebar End --> */}
            </div>
          </div>
        </div>
      </Modal.Body>
    </ModalStyled>
  );
};

export default ModalApplication;
