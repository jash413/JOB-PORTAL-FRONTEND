import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import LazyLoad from "react-lazyload";
import PageWrapper from "../components/PageWrapper";

import withAuth from "../hooks/withAuth";
import JobPost from "../components/UI/JobPost";
import EmployerApplicationsList from "../components/UI/EmployerApplicationsList";
import axiosInterceptors from "../libs/integration/axiosInterceptors";
import { REQ } from "../libs/constants";

const DashboardMain = () => {
  const [dashboardData, setDashboardData] = useState({
    totalJobs: 0,
    totalApplicants: 0,
    appliedRate: 0,
  });

  useEffect(() => {
    axiosInterceptors
      .get(REQ.GET_EMPLOYER_DASHBOARD_STATS)
      .then((response) => {
        setDashboardData(response);
      })
      .catch((error) => {
        console.error("Error fetching job categories:", error);
      });
  }, []);

  const getDuration = (value) => {
    if (value < 10) return 1;
    if (value < 100) return 2;
    if (value < 1000) return 4;
    return 6;
  };

  return (
    <>
      <PageWrapper
        headerConfig={{
          button: "profile",
          isFluid: true,
          bgClass: "bg-default",
          reveal: false,
        }}
      >
        <div className="dashboard-main-container mt-25 mt-lg-31">
          <div className="container">
            <div className="row mb-7">
              <div className="col-xxl-4 col-xl-4 col-lg-6 col-sm-6">
                {/* <!-- Single Category --> */}
                <div className="media bg-white rounded-4 pl-8 pt-9 pb-9 pr-7 hover-shadow-1 mb-9 shadow-8">
                  <div className="text-blue bg-blue-opacity-1 circle-56 font-size-6 mr-7">
                    <i className="fas fa-briefcase"></i>
                  </div>
                  {/* <!-- Category Content --> */}
                  <div className="">
                    <h5 className="font-size-8 font-weight-semibold text-black-2 line-height-reset font-weight-bold mb-1">
                      <LazyLoad>
                        <span className="counter">
                          <CountUp
                            duration={getDuration(dashboardData.totalJobs)}
                            end={dashboardData.totalJobs}
                          />
                        </span>
                      </LazyLoad>
                    </h5>
                    <p className="font-size-4 font-weight-normal text-gray mb-0">
                      Posted Jobs
                    </p>
                  </div>
                </div>
                {/* <!-- End Single Category --> */}
              </div>
              <div className="col-xxl-4 col-xl-4 col-lg-6 col-sm-6">
                {/* <!-- Single Category --> */}
                <div className="media bg-white rounded-4 pl-8 pt-9 pb-9 pr-7 hover-shadow-1 mb-9 shadow-8">
                  <div className="text-pink bg-pink-opacity-1 circle-56 font-size-6 mr-7">
                    <i className="fas fa-user"></i>
                  </div>
                  {/* <!-- Category Content --> */}
                  <div className="">
                    <h5 className="font-size-8 font-weight-semibold text-black-2 line-height-reset font-weight-bold mb-1">
                      <LazyLoad>
                        <span className="counter">
                          <CountUp
                            duration={getDuration(
                              dashboardData.totalApplicants
                            )}
                            end={dashboardData.totalApplicants}
                          />
                        </span>
                      </LazyLoad>
                    </h5>
                    <p className="font-size-4 font-weight-normal text-gray mb-0">
                      Total Applicants
                    </p>
                  </div>
                </div>
                {/* <!-- End Single Category --> */}
              </div>
              <div className="col-xxl-4 col-xl-4 col-lg-6 col-sm-6">
                {/* <!-- Single Category --> */}
                <div className="media bg-white rounded-4 pl-8 pt-9 pb-9 pr-7 hover-shadow-1 mb-9 shadow-8">
                  <div className="text-egg-blue bg-egg-blue-opacity-1 circle-56 font-size-6 mr-7">
                    <i className="fas fa-mouse-pointer"></i>
                  </div>
                  {/* <!-- Category Content --> */}
                  <div className="">
                    <h5 className="font-size-8 font-weight-semibold text-black-2 line-height-reset font-weight-bold mb-1">
                      <LazyLoad>
                        <span className="counter">
                          <CountUp
                            duration={getDuration(dashboardData.appliedRate)}
                            decimal="."
                            decimals={1}
                            end={dashboardData.appliedRate}
                          />
                        </span>
                        %
                      </LazyLoad>
                    </h5>
                    <p className="font-size-4 font-weight-normal text-gray mb-0">
                      Applied Rate
                    </p>
                  </div>
                </div>
                {/* <!-- End Single Category --> */}
              </div>
            </div>
            <div className="mb-14">
              <EmployerApplicationsList />
            </div>
            <div className="mb-18 w-100">
              <JobPost />
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
};
export default withAuth(DashboardMain);
