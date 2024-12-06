import React, { useContext, useEffect, useState } from "react";
import { Link } from "gatsby";
import PageWrapper from "../../components/PageWrapper";

import iconL from "../../assets/image/svg/icon-location.svg";
import withAuth from "../../hooks/withAuth";
import axiosInterceptors from "../../libs/integration/axiosInterceptors";
import { REQ } from "../../libs/constants";
import moment from "moment";
import { MdCurrencyRupee } from "react-icons/md";
import HorizontalSlider from "../../components/HorizontalSlider";
import { Oval } from "react-loader-spinner";
import { toast } from "react-toastify";
import GlobalContext from "../../context/GlobalContext";

const JobDetails = ({ params }) => {
  const { id } = params;
  const gContext = useContext(GlobalContext);
  const userDetails = JSON.parse(gContext?.user);
  const candidateId = userDetails?.login_id;
  const [jobDetails, setJobDetails] = useState();
  const [loading, setLoading] = useState(false);

  const handleJobApply = async (jobId) => {
    axiosInterceptors
      .post(REQ.JOB_APPLIED, {
        job_id: jobId,
        candidateId,
      })
      .then((response) => {
        toast.success("Job applied successfully.");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosInterceptors
        .get(REQ.GET_JOB_DETAILS(id))
        .then((response) => {
          setJobDetails(response);
        })
        .catch((error) => {
          console.error("Error fetching job details:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  function formatSalary(amount) {
    if (amount < 1000) {
      return amount.toString();
    } else if (amount < 1000000) {
      return (amount / 1000).toFixed(1) + "K";
    } else if (amount < 1000000000) {
      return (amount / 1000000).toFixed(1) + "M";
    } else {
      return (amount / 1000000000).toFixed(1) + "B";
    }
  }

  if (loading) {
    return (
      <div
        className="d-flex align-items-center justify-content-center text-center"
        style={{
          height: "70vh",
          width: "100vw",
        }}
      >
        <Oval
          height={50}
          width={50}
          color="#f8285a"
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="#f8285a"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      </div>
    );
  }

  return (
    <>
      <PageWrapper headerConfig={{ button: "profile" }}>
        <div className="jobDetails-section bg-default-1 pt-28 pt-lg-27 pb-xl-25 pb-12">
          <div className="container">
            <div className="row justify-content-center">
              {/* <!-- back Button --> */}
              <div className="col-xl-10 col-lg-11 mt-4 ml-xxl-32 ml-xl-15 dark-mode-texts">
                <div className="mb-9">
                  <Link
                    to="/search-jobs"
                    className="d-flex align-items-center ml-4"
                  >
                    {" "}
                    <i className="icon icon-small-left bg-white circle-40 mr-5 font-size-7 text-black font-weight-bold shadow-8"></i>
                    <span className="text-uppercase font-size-3 font-weight-bold text-gray">
                      Back to job board
                    </span>
                  </Link>
                </div>
              </div>
              {/* <!-- back Button End --> */}
              <div className="col-xl-9 col-lg-11 mb-8 px-xxl-15 px-xl-0">
                <div className="bg-white rounded-4 border border-mercury shadow-9">
                  {/* <!-- Single Featured Job --> */}
                  <div className="pt-9 pl-sm-9 pl-5 pr-sm-9 pr-5 pb-8 border-bottom border-width-1 border-default-color light-mode-texts">
                    <div className="row">
                      <div className="col-md-6">
                        {/* <!-- media start --> */}
                        <div className="media align-items-center">
                          {/* <!-- media logo start --> */}
                          {/* <!-- media logo end --> */}
                          {/* <!-- media texts start --> */}
                          <div>
                            <h3 className="font-size-6 mb-0">
                              {jobDetails?.job_title}
                            </h3>
                            <span className="font-size-3 text-gray line-height-2">
                              {jobDetails?.job_category?.cate_desc}
                            </span>
                          </div>
                          {/* <!-- media texts end --> */}
                        </div>
                        {/* <!-- media end --> */}
                      </div>
                      <div className="col-md-6 text-right pt-7 pt-md-0 mt-md-n1">
                        {/* <!-- media date start --> */}
                        <div className="media justify-content-md-end">
                          <p className="font-size-4 text-gray mb-0">
                            {moment(jobDetails?.posted_at).format(
                              "DD MMM YYYY"
                            )}
                          </p>
                        </div>
                        {/* <!-- media date end --> */}
                      </div>
                    </div>
                    <div className="row pt-9">
                    </div>
                  </div>
                  {/* <!-- End Single Featured Job --> */}
                  <div className="job-details-content pt-8 pl-sm-9 pl-6 pr-sm-9 pr-6 pb-10 border-bottom border-width-1 border-default-color light-mode-texts">
                    <div className="row">
                      <div className="col-md-4 mb-lg-0 mb-10">
                        <div className="">
                          <span className="font-size-4 d-block mb-4 text-gray">
                            Company Details
                          </span>
                          <h6 className="font-size-3 text-black-2 font-weight-semibold mb-1">
                            Name: {jobDetails?.employer?.cmp_name}
                          </h6>
                          <p className="font-size-3 text-black-2 font-weight-semibold mb-1">
                            Email: {jobDetails?.employer?.cmp_email}
                          </p>
                          <p className="font-size-3 text-black-2 font-weight-semibold mb-1">
                            Website: {jobDetails?.employer?.cmp_webs}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-4 pl-lg-0">
                        <div className="media justify-content-md-start">
                          <div className="image mr-5">
                            <img src={iconL} alt="" />
                          </div>
                          <p className="font-size-5 text-gray mb-0">
                            {jobDetails?.employer?.emp_addr},{" "}
                            <br className="d-md-none d-lg-block d-block" />
                            {jobDetails?.employer?.emp_loca}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-4 mb-md-0 mb-6">
                        <div className="media justify-content-md-start">
                          <div className="image mr-5">
                            <MdCurrencyRupee
                              size={25}
                              className="text-primary"
                            />
                          </div>
                          <p
                            title={jobDetails?.salary}
                            className="font-weight-semibold font-size-5 text-black-2 mb-0"
                          >
                            {formatSalary(jobDetails?.salary)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="job-details-content pt-8 pl-sm-9 pl-6 pr-sm-9 pr-6 pb-10 light-mode-texts">
                    <div className="row">
                      <div className="col-xl-11 col-md-12 pr-xxl-9 pr-xl-10 pr-lg-20">
                        <div className="mt-5">
                          <div className="tags">
                            <p className="font-size-4 text-gray mb-0 text-left pr-6">
                              Skills
                            </p>
                            <HorizontalSlider>
                              {jobDetails?.required_skills
                                .split(",")
                                .map((skill, index) => (
                                  <div
                                    key={index}
                                    className="d-inline-block mr-2"
                                  >
                                    <span className="bg-regent-opacity-15 mr-3 h-px-33 text-center flex-all-center rounded-3 px-5 font-size-3 text-black-2 mt-2">
                                      {skill}
                                    </span>
                                  </div>
                                ))}
                            </HorizontalSlider>
                          </div>
                        </div>
                        <div className="mt-5">
                          <p className="mb-4 font-size-4 text-gray">
                            Job Description
                          </p>
                          <p
                            className="font-size-4 text-black-2 mb-7"
                            dangerouslySetInnerHTML={{
                              __html: jobDetails?.job_description,
                            }}
                          ></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
};
export default withAuth(JobDetails);
