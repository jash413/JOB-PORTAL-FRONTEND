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
import dummyProfile from "../assets/image/dummy-profile.png";
import styled from "styled-components";

const Card = styled.div`
  max-width: 300px;
`;

const DashboardRequestAccess = () => {
  const gContext = useContext(GlobalContext);

  const [requestAccess, setRequestAccess] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 5,
    // sortBy: "",
    // sortOrder: "",
    // search: "",
  });
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const handleSortChange = (column) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      sortBy: column,
      sortOrder:
        prevFilters.sortBy === column && prevFilters.sortOrder === "ASC"
          ? "DESC"
          : "ASC",
      page: 1,
    }));
  };

  const debouncedSearchChange = useCallback(
    debounce((value) => {
      setFilters((prev) => ({ ...prev, search: value, page: 1 }));
    }, 1000),
    []
  );

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearch(value);
    debouncedSearchChange(value);
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const clearSearch = () => {
    setSearch("");
    debouncedSearchChange("");
  };

  const fetchAccessRequestList = async () => {
    setLoading(true);
    try {
      const response = await axiosInterceptors.post(
        REQ.GET_ACCESS_REQUEST_LIST,
        filters
      );
      setRequestAccess(response?.records);
      setPagination(response?.pagination);
    } catch (error) {
      console.error("Error fetching job posts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filters) {
      fetchAccessRequestList();
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
            <div className="mb-5">
              <div className="row mb-5 align-items-start">
                <div className="col-lg-12 mb-lg-0 mb-4">
                  <h3 className="font-size-6 mb-0">
                    Requested Candidates ({requestAccess.length})
                  </h3>
                </div>
                <div
                  className="p-4 my-4 w-100"
                  style={{
                    margin: "0px 15px",
                  }}
                >
                  <div className="d-flex flex-column flex-lg-row align-items-end align-items-lg-center justify-content-between w-100 px-5">
                    {/* Search Input */}
                    <div className="position-relative d-flex align-items-center gap-2 mt-3 mt-lg-0">
                      <input
                        type="text"
                        placeholder="Search by job category..."
                        value={search || ""}
                        onChange={handleSearchChange}
                        className="form-control"
                        style={{ maxWidth: "350px", paddingRight: "2rem" }}
                      />
                      {search && (
                        <span
                          className="position-absolute"
                          style={{
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                          }}
                          onClick={clearSearch}
                        >
                          <VscChromeClose />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-7 rounded pb-9 px-11">
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
                    {requestAccess.length > 0 ? (
                      requestAccess.map((request) => (
                        <Card
                          key={request.candidateId}
                          className="col-md-6 col-lg-4 mb-4"
                        >
                          <div className="card p-4 shadow-sm h-100">
                            <div className="d-flex flex-column justify-content-center align-items-center">
                              <img
                                // src={
                                //   candidate.can_profile_img
                                //     ? `/${candidate.can_profile_img}`
                                //     : dummyProfile
                                // }
                                src={dummyProfile}
                                alt={`${request?.Candidate?.can_name}'s profile`}
                                className="card-img-top mb-3 rounded-circle"
                                style={{ width: "60px", height: "60px" }}
                              />
                              <h5 className="font-size-4">
                                {request?.Candidate?.can_name}
                              </h5>
                            </div>
                            <p
                              title={
                                request?.Candidate?.job_category?.cate_desc
                              }
                              className="mb-3 font-size-3 text-truncate"
                            >
                              {request?.Candidate?.job_category?.cate_desc}
                            </p>
                            {request.status === "approved" ? (
                              <button
                                type="button"
                                className="btn btn-primary w-100"
                                onClick={() =>
                                  gContext.setApplicationModalVisible({
                                    visible: true,
                                    data: request,
                                  })
                                }
                              >
                                View Details
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="btn btn-outline-gray w-100"
                              >
                                Approval Pending
                              </button>
                            )}
                          </div>
                        </Card>
                      ))
                    ) : (
                      <h3 className="font-size-4 font-weight-normal text-black-2 mb-0">
                        No requests found.
                      </h3>
                    )}
                  </div>
                )}
              </div>
              <div className="d-flex justify-content-between align-items-center mt-4">
                <button
                  className="btn btn-light d-flex align-items-center justify-content-center"
                  disabled={!pagination.hasPreviousPage}
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                >
                  <span className="mr-3">
                    <FaChevronLeft />
                  </span>
                  Previous
                </button>
                <span>{`Page ${pagination.currentPage} of ${pagination.totalPages}`}</span>
                <button
                  className="btn btn-light d-flex align-items-center justify-content-center"
                  disabled={!pagination.hasNextPage}
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                >
                  Next
                  <span className="ml-3">
                    <FaChevronRight />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* <ModalAddJobPost fetchJobs={fetchJobs} /> */}
      </PageWrapper>
    </>
  );
};

export default withAuth(DashboardRequestAccess);
