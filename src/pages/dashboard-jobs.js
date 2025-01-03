import React from "react";
import PageWrapper from "../components/PageWrapper";
import withAuth from "../hooks/withAuth";
import JobPost from "../components/UI/JobPost";

const DashboardJobs = () => {
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
          <JobPost />
        </div>
      </PageWrapper>
    </>
  );
};

export default withAuth(DashboardJobs);
