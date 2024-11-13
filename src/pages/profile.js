import React, { useContext, useEffect, useState } from "react";
import { Nav, Tab } from "react-bootstrap";
import { Link } from "gatsby";
import PageWrapper from "../components/PageWrapper";
import ProfileSidebar from "../components/ProfileSidebar";

import imgB1 from "../assets/image/l2/png/featured-job-logo-1.png";
import imgB2 from "../assets/image/l1/png/feature-brand-1.png";
import imgB3 from "../assets/image/svg/harvard.svg";
import imgB4 from "../assets/image/svg/mit.svg";

import imgT1 from "../assets/image/l3/png/team-member-1.png";
import imgT2 from "../assets/image/l3/png/team-member-2.png";
import imgT3 from "../assets/image/l3/png/team-member-3.png";
import imgT4 from "../assets/image/l3/png/team-member-4.png";
import imgT5 from "../assets/image/l3/png/team-member-5.png";

import imgL from "../assets/image/svg/icon-loaction-pin-black.svg";
import GlobalContext from "../context/GlobalContext";
import axiosInterceptors from "../libs/integration/axiosInterceptors";
import { REQ } from "../libs/constants";
import { toast } from "react-toastify";
import { VscClose } from "react-icons/vsc";
import withAuth from "../hooks/withAuth";
import { useFormik } from "formik";
import { changePasswordValidationSchema } from "../utils/validations/validations";
import ModalWorkExprerience from "../components/ModalWorkExprerience/ModalWorkExprerience";
import ModalEducationDetails from "../components/ModalEducationDetails";
import { ModalProfile, EmpProfileModal } from "../components/ModalProfile";
import { GrScorecard } from "react-icons/gr";
import { MdEdit, MdInfo } from "react-icons/md";
import EmployeProfile from "../components/EmployeProfile";
import { calculateDuration } from "../utils";

const CandidateProfile = () => {
  const gContext = useContext(GlobalContext);
  const [isUserVerified, setIsUserVerified] = useState(false);
  const [isUserApproved, setIsUserApproved] = useState(false);
  const [expModal, setExpModal] = useState(false);
  const [eduExpModal, setEduExpModal] = useState(false);
  const [candidateRegistered, setCandidateRegistered] = useState(false);
  const userDetails = JSON.parse(gContext?.user);
  const [candEduDetailsList, setCandEduDetailsList] = useState([]);
  const [candEduId, setCandEduId] = useState(null);
  const userType = userDetails?.login_type;

  const [mappedExperienceData, setMappedExperienceData] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState(null);

  const handleEditClick = (exp) => {
    setSelectedExperience(exp);
    setExpModal(true);
  };

  const fetchUserProfile = async () => {
    let token =
      sessionStorage.getItem("authToken") || localStorage.getItem("authToken");

    if (!token) {
      toast.error("Please log in again.");
      return;
    }
    try {
      const response = await axiosInterceptors.get(REQ.PROFILE_DETAILS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      gContext.setUser(JSON.stringify(response));
      if (
        response?.email_ver_status === 0 ||
        response?.phone_ver_status === 0
      ) {
        setIsUserVerified(true);
      }
      if (response?.user_approval_status === 0) {
        setIsUserApproved(true);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    fetchUserProfile();
    gContext.fetchExperienceDetails();
  }, []);

  useEffect(() => {
    if (gContext?.experienceData?.length) {
      const formattedData = gContext.experienceData.map((exp) => {
        const startDate = new Date(exp.job_stdt);
        const endDate = new Date(exp.job_endt);
        const duration = `${startDate.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        })} - ${endDate.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        })}`;
        const totalDuration = calculateDuration(exp.job_stdt, exp.job_endt);

        return {
          position: exp.exp_desg,
          companyName: exp.emp_name,
          duration: `${duration} - ${totalDuration}`,
          location: "Bangalore, India",
          currentCTC: exp.cur_ctc,
          exp_type: exp.exp_type,
          startDate: exp.job_stdt,
          endDate: exp.job_endt,
          exp_id: exp.exp_id,
          can_code: exp.can_code,
        };
      });

      setMappedExperienceData((prevData) => {
        if (JSON.stringify(prevData) !== JSON.stringify(formattedData)) {
          return formattedData;
        }
        return prevData;
      });
    } else {
      setMappedExperienceData([]);
    }
  }, [gContext?.experienceData]);

  //handle change password
  const formik = useFormik({
    initialValues: {
      oldPass: "",
      newPass: "",
    },
    validationSchema: changePasswordValidationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      let token =
        sessionStorage.getItem("authToken") ||
        localStorage.getItem("authToken");
      if (!token) {
        toast.error("Authentication required. Please log in.");
        setSubmitting(false);
        return;
      }
      try {
        const response = await axiosInterceptors.put(
          REQ.CHANGE_PASSWORD,
          {
            oldPass: values.oldPass,
            newPass: values.newPass,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success(
          `Password changed successfully for ${response.login_name}.`
        );
        resetForm();
      } catch (error) {
        const errorMessage =
          error?.data?.error ||
          error?.data?.message ||
          "Error changing password. Please try again.";

        toast.error(errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const fetchCandidateDetails = async () => {
    try {
      const response = await axiosInterceptors.get(
        REQ.GET_CANDIDATE.replace(":id", userDetails?.login_id)
      );

      if (response?.can_code) {
        setCandidateRegistered(true);
      }
    } catch (error) {
      console.error("Error fetching candidate details:", error);
    }
  };

  useEffect(() => {
    if (userDetails && userDetails?.login_id && userType === "CND") {
      fetchCandidateDetails();
    }
  }, []);

  const fetchEducationDetailsList = async () => {
    try {
      const response = await axiosInterceptors.post(REQ.CAND_EDU_DETAILS_LIST, {
        page: 1,
        limit: 50,
      });

      if (response) {
        setCandEduDetailsList(response?.records);
      }
    } catch (error) {
      console.error("Error fetching candidate educations details:", error);
    }
  };

  useEffect(() => {
    if (userType === "CND") {
      fetchEducationDetailsList();
    }
  }, []);

  return (
    <>
      <PageWrapper headerConfig={{ button: "profile" }}>
        {/* <!-- Profile Settings Area --> */}
        {userType === "CND" ? (
          <>
            <div className="bg-default-2 pt-22 pt-lg-25 pb-13 pb-xxl-32">
              <div className="container">
                {isUserVerified && (
                  <div
                    style={{
                      backgroundColor: "#fff3b0",
                    }}
                    className="ml-3 px-8 py-5 mb-5 row justify-content-between rounded border position-relative w-100"
                  >
                    <p className="mb-0 font-size-4 line-height-1p4 text-yellow">
                      Please complete your profile verification to access the
                      dashboard and enjoy all the features of our app!
                    </p>
                    <span onClick={() => setIsUserVerified(false)}>
                      <VscClose className="button" size={30} />
                    </span>
                  </div>
                )}
                {isUserApproved && (
                  <div
                    style={{
                      backgroundColor: "#fff3b0",
                    }}
                    className="ml-3 px-8 py-5 mb-5 d-flex justify-content-between rounded border position-relative w-100"
                  >
                    <p className="mb-0 font-size-4 line-height-1p4 text-yellow">
                      Your profile approval status is currently pending. Please
                      check back soon. For furture assistance, contact support{" "}
                      <a
                        href="mailto:justcamp@support.com"
                        className="font-weight-bold"
                      >
                        justcamp@support.com
                      </a>
                      .
                    </p>
                    <span onClick={() => setIsUserApproved(false)}>
                      <VscClose className="button" size={30} />
                    </span>
                  </div>
                )}
                {/* <!-- back Button --> */}
                <div className="row justify-content-center">
                  <div className="col-12 dark-mode-texts">
                    <div className="mb-9">
                      <Link to="/#" className="d-flex align-items-center ml-4">
                        {" "}
                        <i className="icon icon-small-left bg-white circle-40 mr-5 font-size-7 text-black font-weight-bold shadow-8"></i>
                        <span className="text-uppercase font-size-3 font-weight-bold text-gray">
                          Back
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* <!-- back Button End --> */}
                <div className="row">
                  {/* <!-- Left Sidebar Start --> */}
                  <div className="col-12 col-xxl-3 col-lg-4 col-md-5 mb-11 mb-lg-0">
                    <ProfileSidebar />
                  </div>
                  {/* <!-- Left Sidebar End --> */}
                  {/* <!-- Middle Content --> */}
                  <div className="col-12 col-xxl-6 col-lg-8 col-md-7 order-2 order-xl-1">
                    <Tab.Container
                      id="left-tabs-example"
                      defaultActiveKey="one"
                    >
                      <div className="bg-white rounded-4 shadow-9">
                        {/* <!-- Tab Section Start --> */}
                        <Nav
                          className="nav border-bottom border-mercury pl-12"
                          role="tablist"
                        >
                          <li className="tab-menu-items nav-item pr-12">
                            <Nav.Link
                              eventKey="one"
                              className="text-uppercase font-size-3 font-weight-bold text-default-color py-3 px-0"
                            >
                              Overview
                            </Nav.Link>
                          </li>
                          <li className="tab-menu-items nav-item pr-12">
                            <Nav.Link
                              eventKey="two"
                              className="text-uppercase font-size-3 font-weight-bold text-default-color py-3 px-0"
                            >
                              Change Password
                            </Nav.Link>
                          </li>
                        </Nav>
                        {/* <!-- Tab Content --> */}
                        <Tab.Content>
                          <Tab.Pane eventKey="one">
                            {/* <!-- Excerpt Start --> */}

                            {/* <!-- Excerpt End --> */}
                            {/* <!-- Skills --> */}

                            {/* <!-- Skills End --> */}
                            {/* <!-- Card Section Start --> */}
                            <div className="border-top p-5 pt-7 pb-5">
                              <div className="w-100 d-flex justify-content-between align-items-center">
                                <h4 className="font-size-6 mb-7 mt-5 text-black-2 font-weight-semibold">
                                  Work Experience
                                </h4>
                                {candidateRegistered ? (
                                  <button
                                    onClick={() => setExpModal(true)}
                                    className="btn btn-green btn-h-30 btn-2xl text-uppercase"
                                  >
                                    Add Work Experience
                                  </button>
                                ) : (
                                  <button
                                    title="Complete profile to add work experience."
                                    onClick={() =>
                                      gContext.toggleProfileModal()
                                    }
                                    className="btn btn-2xl text-uppercase d-flex align-items-center justify-content-center"
                                    style={{ backgroundColor: "#fff2f0" }}
                                  >
                                    <span className="mr-3">
                                      <MdInfo fill={"red"} size={18} />
                                    </span>
                                    Complete Profile
                                  </button>
                                )}
                                <ModalWorkExprerience
                                  expModal={expModal}
                                  setExpModal={setExpModal}
                                  experienceData={selectedExperience}
                                />
                              </div>
                              {/* <!-- Single Card --> */}
                              {mappedExperienceData &&
                              mappedExperienceData.length > 0 ? (
                                mappedExperienceData.map((exp, index) => (
                                  <div className="w-100 mb-9" key={index}>
                                    <div className="d-flex align-items-center px-5 py-2 flex-wrap flex-sm-nowrap border rounded">
                                      <div className="w-100 mt-n2">
                                        <h3 className="mb-0 d-flex align-items-center justify-content-md-between flex-wrap">
                                          <p className="font-size-6 text-black-2">
                                            {exp.position}
                                          </p>
                                          <span
                                            onClick={() => handleEditClick(exp)}
                                          >
                                            <MdEdit size={20} />
                                          </span>
                                        </h3>
                                        <p className="font-size-4 text-default-color line-height-2">
                                          {exp.companyName}
                                        </p>
                                        <div className="d-flex align-items-center justify-content-md-between flex-wrap">
                                          <p className="font-size-3 text-gray mr-5">
                                            {exp.duration}
                                          </p>
                                          <p className="font-size-3 text-gray">
                                            <span className="mr-4">
                                              <img
                                                src={imgL}
                                                alt="Location Icon"
                                              />
                                            </span>
                                            {exp.location}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className="font-size-4 text-gray">
                                  No experience data available.
                                </p>
                              )}
                              {/* <!-- Single Card End --> */}
                            </div>

                            {/* <!-- Card Section End --> */}
                            {/* <!-- Card Section Start --> */}
                            <div className="border-top p-5 pt-7 pb-5">
                              {/* <h4 className="font-size-6 mb-7 mt-5 text-black-2 font-weight-semibold">
                            Education
                          </h4> */}

                              <div className="w-100 d-flex justify-content-between align-items-center">
                                <h4 className="font-size-6 mb-7 mt-5 text-black-2 font-weight-semibold">
                                  Education
                                </h4>
                                {candidateRegistered ? (
                                  <button
                                    onClick={() => {
                                      setEduExpModal(true);
                                      setCandEduId(null);
                                    }}
                                    className="btn btn-green btn-h-30 btn-2xl text-uppercase"
                                  >
                                    Add Education
                                  </button>
                                ) : (
                                  <button
                                    title="Complete profile to add Education."
                                    onClick={() =>
                                      gContext.toggleProfileModal()
                                    }
                                    className="btn btn-2xl text-uppercase d-flex align-items-center justify-content-center"
                                    style={{ backgroundColor: "#fff2f0" }}
                                  >
                                    <span className="mr-3">
                                      <MdInfo fill={"red"} size={18} />
                                    </span>
                                    Complete Profile
                                  </button>
                                )}
                                <ModalEducationDetails
                                  open={eduExpModal}
                                  setOpen={setEduExpModal}
                                  candEduId={candEduId}
                                  setCandEduId={setCandEduId}
                                  fetchEduDetailsList={
                                    fetchEducationDetailsList
                                  }
                                />
                              </div>
                              {/* <!-- Single Card --> */}
                              {candEduDetailsList &&
                              candEduDetailsList.length > 0 ? (
                                candEduDetailsList?.map((edu, i) => (
                                  <div key={i} className="w-100 mb-9">
                                    <div className="d-flex align-items-center px-5 py-2 flex-wrap flex-sm-nowrap border rounded">
                                      {/* <div className="square-72 d-block mr-8 mb-7 mb-sm-0">
                                    <img src={imgB3} alt="" />
                                  </div> */}
                                      <div className="w-100 mt-n2">
                                        <h3 className="mb-0 d-flex align-items-center justify-content-md-between flex-wrap">
                                          <p className="font-size-6 text-black-2">
                                            {edu?.can_edu} in {edu?.can_stre}
                                          </p>
                                          <span
                                            onClick={() => {
                                              setCandEduId(edu?.edu_id);
                                              setEduExpModal(true);
                                            }}
                                          >
                                            <MdEdit size={20} />
                                          </span>
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
                                            {edu?.can_cgpa} CGPA /{" "}
                                            {edu?.can_perc} %
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
                            </div>
                            {/* <!-- Card Section End --> */}
                          </Tab.Pane>
                          <Tab.Pane eventKey="two">
                            {/* <!-- Excerpt Start --> */}
                            <div className="pr-xl-11 p-5 pl-xs-12 pt-9 pb-11">
                              <form onSubmit={formik.handleSubmit}>
                                <div className="row">
                                  <div className="col-12 mb-7">
                                    <label
                                      htmlFor="oldPass"
                                      className="font-size-4 font-weight-semibold text-black-2 mb-5 line-height-reset"
                                    >
                                      Old Password
                                    </label>
                                    <input
                                      id="oldPass"
                                      type="password"
                                      className="form-control"
                                      placeholder="Old Password"
                                      {...formik.getFieldProps("oldPass")}
                                    />
                                    {formik.errors.oldPass &&
                                    formik.touched.oldPass ? (
                                      <div className="text-danger">
                                        {formik.errors.oldPass}
                                      </div>
                                    ) : null}
                                  </div>
                                  <div className="col-12 mb-7">
                                    <label
                                      htmlFor="newPass"
                                      className="font-size-4 font-weight-semibold text-black-2 mb-5 line-height-reset"
                                    >
                                      New Password
                                    </label>
                                    <input
                                      id="newPass"
                                      type="password"
                                      className="form-control"
                                      placeholder="New Password"
                                      {...formik.getFieldProps("newPass")}
                                    />
                                    {formik.errors.newPass &&
                                    formik.touched.newPass ? (
                                      <div className="text-danger">
                                        {formik.errors.newPass}
                                      </div>
                                    ) : null}
                                  </div>
                                  <div className="col-lg-12 pt-4">
                                    <button
                                      className="btn btn-primary text-uppercase w-100 h-px-48"
                                      disabled={formik.isSubmitting}
                                    >
                                      Submit
                                    </button>
                                  </div>
                                </div>
                              </form>
                            </div>
                            {/* <!-- Excerpt End --> */}
                          </Tab.Pane>
                        </Tab.Content>
                        {/* <!-- Tab Content End --> */}
                        {/* <!-- Tab Section End --> */}
                      </div>
                    </Tab.Container>
                  </div>
                  {/* <!-- Middle Content --> */}
                  {/* <!-- Right Sidebar Start --> */}
                  {/* <!-- Right Sidebar End --> */}
                </div>
              </div>
            </div>
            <ModalProfile
              fetchDetails={fetchCandidateDetails}
              fetchUserProfile={fetchUserProfile}
            />
          </>
        ) : (
          <>
            <div className="bg-default-2 pt-22 pt-lg-25 pb-13 pb-xxl-32">
              <div className="container">
                {isUserVerified && (
                  <div
                    style={{
                      backgroundColor: "#fff3b0",
                    }}
                    className="ml-3 px-8 py-5 mb-5 row justify-content-between rounded border position-relative w-100"
                  >
                    <p className="mb-0 font-size-4 line-height-1p4 text-yellow">
                      Please complete your profile verification to access the
                      dashboard and enjoy all the features of our app!
                    </p>
                    <span onClick={() => setIsUserVerified(false)}>
                      <VscClose className="button" size={30} />
                    </span>
                  </div>
                )}
                {isUserApproved && (
                  <div
                    style={{
                      backgroundColor: "#fff3b0",
                    }}
                    className="ml-3 px-8 py-5 mb-5 d-flex justify-content-between rounded border position-relative w-100"
                  >
                    <p className="mb-0 font-size-4 line-height-1p4 text-yellow">
                      Your profile approval status is currently pending. Please
                      check back soon. For furture assistance, contact support{" "}
                      <a
                        href="mailto:justcamp@support.com"
                        className="font-weight-bold"
                      >
                        justcamp@support.com
                      </a>
                      .
                    </p>
                    <span onClick={() => setIsUserApproved(false)}>
                      <VscClose className="button" size={30} />
                    </span>
                  </div>
                )}
                {/* <!-- back Button --> */}
                <div className="row justify-content-center">
                  <div className="col-12 dark-mode-texts">
                    <div className="mb-9">
                      <Link to="/#" className="d-flex align-items-center ml-4">
                        {" "}
                        <i className="icon icon-small-left bg-white circle-40 mr-5 font-size-7 text-black font-weight-bold shadow-8"></i>
                        <span className="text-uppercase font-size-3 font-weight-bold text-gray">
                          Back
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* <!-- back Button End --> */}
                <div className="row">
                  {/* <!-- Left Sidebar Start --> */}
                  <div className="col-12 col-xxl-3 col-lg-4 col-md-5 mb-11 mb-lg-0">
                    <ProfileSidebar />
                  </div>
                  {/* <!-- Left Sidebar End --> */}
                  {/* <!-- Middle Content --> */}
                  <div className="col-12 col-xxl-9 col-lg-8 col-md-7 order-2 order-xl-1">
                    <div className="pl-lg-5 d-flex justify-content-start align-items-center">
                      {/* <!-- Top Start --> */}
                      <div className="bg-white shadow-9 rounded-4 w-100">
                        <div className="py-5 border-bottom border-mercury w-100">
                          <div className="d-flex justify-content-center align-items-center">
                            <EmployeProfile />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <EmpProfileModal
              fetchDetails={fetchCandidateDetails}
              fetchUserProfile={fetchUserProfile}
            />
          </>
        )}
      </PageWrapper>
    </>
  );
};
export default withAuth(CandidateProfile);
