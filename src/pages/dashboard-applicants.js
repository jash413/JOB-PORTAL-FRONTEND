import React from "react";
import PageWrapper from "../components/PageWrapper";
import withAuth from "../hooks/withAuth";
import ModalAddJobPost from "../components/ModalAddJobPost";
import EmployerApplicationsList from "../components/UI/EmployerApplicationsList/EmployerApplicationsList";

const defaultJobs = [
  { value: "pd", label: "Product Designer" },
  { value: "gd", label: "Graphics Designer" },
  { value: "fd", label: "Frontend Developer" },
  { value: "bd", label: "Backend Developer" },
  { value: "cw", label: "Content Writer" },
];

const DashboardApplicants = () => {
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
        <div className="dashboard-main-container">
          <EmployerApplicationsList />
        </div>
        <ModalAddJobPost />
      </PageWrapper>
    </>
  );
};
export default withAuth(DashboardApplicants);
