import React, { useCallback, useContext, useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper";
import { Select } from "../components/Core";
import withAuth from "../hooks/withAuth";
import ModalAddJobPost from "../components/ModalAddJobPost";
import axiosInterceptors from "../libs/integration/axiosInterceptors";
import { REQ } from "../libs/constants";
import { debounce } from "lodash";
import { FaChevronLeft, FaChevronRight, FaSort } from "react-icons/fa";
import { FaArrowUpLong, FaArrowDownLong } from "react-icons/fa6";
import { VscChromeClose } from "react-icons/vsc";
import moment from "moment/moment";
import GlobalContext from "../context/GlobalContext";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";
import { Link } from "gatsby";
import dummyProfile from "../assets/image/dummy-profile.png";
import styled from "styled-components";
import HorizontalSlider from "../components/HorizontalSlider";

const Card = styled.div`
  max-width: 300px;
`;

const DashboardNotAllowedCandidates = () => {
  const gContext = useContext(GlobalContext);

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState({ show: false, id: null });
  const [filters, setFilters] = useState({
    page: 1,
    limit: 6,
  });
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const fetchNotAccesibleCandidates = async () => {
    setLoading(true);
    try {
      const response = await axiosInterceptors.post(
        REQ.GET_NOT_ACCESSIBLE_CANDIDATES,
        filters
      );
      setCandidates(response?.records);
      setPagination(response?.pagination);
    } catch (error) {
      console.error("Error fetching job posts", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAccess = async (candidateId) => {
    setRequesting({ show: true, id: candidateId });
    try {
      await axiosInterceptors.post(REQ.SEND_REQUEST_ACCESS, {
        candidateId,
      });
      toast.success("Access requested successfully.");
      fetchNotAccesibleCandidates();
    } catch (error) {
      console.error("Error requesting access:", error);
      if (error?.data?.message) {
        toast.error(error?.data?.message);
      } else {
        toast.error("Failed to request access.");
      }
    } finally {
      setRequesting({ show: false, id: null });
    }
  };

  useEffect(() => {
    if (filters) {
      fetchNotAccesibleCandidates();
    }
  }, [filters]);

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
            <h3 className="font-size-6 mb-11">Available Candidates</h3>
            {loading ? (
              <div
                className="d-flex align-items-center justify-content-center text-center w-100"
                style={{
                  height: "30vh",
                }}
              >
                <Oval
                  height={50}
                  width={50}
                  color="#4fa94d"
                  visible={true}
                  ariaLabel="oval-loading"
                  secondaryColor="#4fa94d"
                  strokeWidth={2}
                  strokeWidthSecondary={2}
                />
              </div>
            ) : (
              <div className="row">
                {candidates.length > 0 ? (
                  candidates.map((candidate) => (
                    <Card
                      key={candidate.can_code}
                      className="col-md-6 col-lg-4 mb-4"
                    >
                      <div className="card p-4 shadow-sm h-100 d-flex justify-content-between">
                        <div>
                          <div className="d-flex flex-column justify-content-center align-items-center">
                            <img
                              // src={
                              //   candidate.can_profile_img
                              //     ? `/${candidate.can_profile_img}`
                              //     : dummyProfile
                              // }
                              src={dummyProfile}
                              alt={`${candidate.can_name}'s profile`}
                              className="card-img-top mb-3 rounded-circle"
                              style={{ width: "60px", height: "60px" }}
                            />
                            <h5 className="card-title">{candidate.can_name}</h5>
                          </div>
                          <HorizontalSlider>
                            {candidate.can_skill
                              .split(",")
                              .map((skill, index) => (
                                <div
                                  key={index}
                                  className="d-inline-block mr-2"
                                >
                                  <span className="badge bg-primary pt-2 text-white">
                                    {skill}
                                  </span>
                                </div>
                              ))}
                          </HorizontalSlider>
                          <p
                            className="mb-1 text-muted text-truncate"
                            style={{
                              filter: !candidate?.can_appr
                                ? "blur(3px)"
                                : "none",
                              userSelect: !candidate?.can_appr && "none",
                            }}
                          >
                            Name: {candidate.can_email}
                          </p>
                          <p
                            className="mb-3 text-muted text-truncate"
                            style={{
                              filter: !candidate?.can_appr
                                ? "blur(3px)"
                                : "none",
                              userSelect: !candidate?.can_appr && "none",
                            }}
                          >
                            Email: {candidate.can_mobn}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="btn btn-primary w-100"
                          onClick={() =>
                            handleRequestAccess(candidate.can_code)
                          }
                          disabled={
                            requesting.show ||
                            requesting.id === candidate.can_code
                          }
                        >
                          {requesting?.id === candidate?.can_code ? (
                            <Oval
                              height={20}
                              width={20}
                              color="white"
                              wrapperStyle={{ display: "inline-block" }}
                            />
                          ) : (
                            "Request Access"
                          )}
                        </button>
                      </div>
                    </Card>
                  ))
                ) : (
                  <h3 className="font-size-4 font-weight-normal text-black-2 mb-0">
                    No candidates found.
                  </h3>
                )}
              </div>
            )}
            <div className="d-flex justify-content-between align-items-center mt-4">
              <button
                className="btn btn-light"
                disabled={!pagination.hasPreviousPage}
                onClick={() => handlePageChange(pagination.currentPage - 1)}
              >
                <FaChevronLeft /> Previous
              </button>
              <span>{`Page ${pagination.currentPage} of ${pagination.totalPages}`}</span>
              <button
                className="btn btn-light"
                disabled={!pagination.hasNextPage}
                onClick={() => handlePageChange(pagination.currentPage + 1)}
              >
                Next <FaChevronRight />
              </button>
            </div>
          </div>
        </div>
        <ModalAddJobPost />
      </PageWrapper>
    </>
  );
};

export default withAuth(DashboardNotAllowedCandidates);
