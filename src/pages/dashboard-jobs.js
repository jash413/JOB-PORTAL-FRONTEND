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

const DashboardJobs = () => {
  const gContext = useContext(GlobalContext);

  const [jobs, setJobs] = useState([]);
  const [jobCategories, setJobCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 5,
    // sortBy: "",
    // sortOrder: "",
    // search: "",
    // job_location: "",
    // job_cate: null,
  });
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
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

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
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

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await axiosInterceptors.post(
        REQ.GET_JOBPOST_RECORDS,
        filters
      );
      setJobs(response?.records);
      setPagination(response?.pagination);
    } catch (error) {
      console.error("Error fetching job posts", error);
    } finally {
      setLoading(false);
    }
  };

  const removeJobPost = async (jobId) => {
    try {
      await axiosInterceptors.delete(REQ.UPDATE_JOBPOST.replace(":id", jobId));
      toast.success("Job post deleted successfully");
      fetchJobs();
      setConfirmDelete(null);
    } catch (error) {
      console.error("Error", error);
    }
  };

  useEffect(() => {
    axiosInterceptors
      .post(REQ.JOB_CATEGORIES, {
        page: 1,
        limit: 50,
      })
      .then((response) => {
        setJobCategories(
          response?.records.map((category) => {
            return { value: category.cate_code, label: category.cate_desc };
          })
        );
      })
      .catch((error) => {
        console.error("Error fetching job categories:", error);
      });
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const getSortIcon = (column) => {
    if (filters.sortBy === column) {
      return filters.sortOrder === "ASC" ? (
        <FaArrowUpLong />
      ) : (
        <FaArrowDownLong />
      );
    }
    return <FaSort />;
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
            <div className="mb-5">
              <div className="row mb-11 align-items-start">
                <div className="col-lg-6 mb-lg-0 mb-4">
                  <h3 className="font-size-6 mb-0">
                    Posted Jobs ({jobs.length})
                  </h3>
                </div>
                <div className="col-lg-6">
                  <div className="d-flex flex-wrap align-items-center justify-content-lg-end">
                    <p className="font-size-4 mb-0 mr-6 py-2">Filter by Job:</p>
                    <div className="h-px-48">
                      <Select
                        isClearable
                        options={jobCategories}
                        className="pl-0 h-100 arrow-3 arrow-3-black min-width-px-273 text-black-2 d-flex align-items-center w-100"
                        border={false}
                        onChange={(option) =>
                          handleFilterChange({ job_cate: option?.value })
                        }
                      />
                    </div>
                    <div className="my-3 position-relative">
                      <input
                        type="text"
                        placeholder="Search..."
                        value={search || ""}
                        onChange={handleSearchChange}
                        className="form-control"
                        style={{
                          maxWidth: "350px",
                        }}
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
              <div className="bg-white shadow-8 pt-7 rounded pb-9 px-11">
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
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="pl-0 border-0 font-size-4 font-weight-normal text-truncate"
                            onClick={() => handleSortChange("job_title")}
                          >
                            Job Title {getSortIcon("job_title")}
                          </th>
                          <th
                            scope="col"
                            className="pl-4 border-0 font-size-4 font-weight-normal text-truncate"
                            onClick={() => handleSortChange("job_cate")}
                          >
                            Job Category {getSortIcon("job_cate")}
                          </th>
                          <th
                            scope="col"
                            className="pl-4 border-0 font-size-4 font-weight-normal text-truncate"
                            onClick={() => handleSortChange("job_location")}
                          >
                            Job Location {getSortIcon("job_location")}
                          </th>
                          <th
                            scope="col"
                            className="pl-4 border-0 font-size-4 font-weight-normal text-truncate"
                            onClick={() => handleSortChange("createdAt")}
                          >
                            Posted on {getSortIcon("createdAt")}
                          </th>
                          <th
                            scope="col"
                            className="pl-4 border-0 font-size-4 font-weight-normal text-truncate"
                            onClick={() =>
                              handleSortChange("totalApplications")
                            }
                          >
                            Total Applicants {getSortIcon("totalApplications")}
                          </th>
                          <th
                            scope="col"
                            className="pl-4 border-0 font-size-4 font-weight-normal text-truncate"
                          ></th>
                          <th
                            scope="col"
                            className="pl-4 border-0 font-size-4 font-weight-normal text-truncate"
                          ></th>
                        </tr>
                      </thead>
                      <tbody>
                        {jobs.map((job, id) => (
                          <tr className="border border-color-2" key={id}>
                            <th
                              scope="row"
                              className="pl-6 border-0 py-7 min-width-px-235"
                            >
                              <h3 className="font-size-4 mb-0 font-weight-semibold text-black-2">
                                {job.job_title}
                              </h3>
                            </th>
                            <td className="table-y-middle py-7 min-width-px-135">
                              <h3 className="font-size-4 font-weight-normal text-black-2 mb-0 text-nowrap">
                                {
                                  jobCategories.find(
                                    (category) =>
                                      category?.value === job.job_cate
                                  )?.label
                                }
                              </h3>
                            </td>
                            <td className="table-y-middle py-7 min-width-px-125">
                              <h3 className="font-size-4 font-weight-normal text-black-2 mb-0">
                                {job.job_location}
                              </h3>
                            </td>
                            <td className="table-y-middle py-7 min-width-px-155">
                              <h3 className="font-size-4 font-weight-normal text-black-2 mb-0">
                                {moment(job.createdAt).format("DD/MM/YYYY")}
                              </h3>
                            </td>
                            <td className="table-y-middle py-7 min-width-px-205">
                              <h3 className="font-size-4 font-weight-bold text-black-2 mb-0">
                                {job.totalApplications}
                              </h3>
                            </td>
                            <td className="table-y-middle py-7 min-width-px-80">
                              <span
                                onClick={() =>
                                  gContext.setJobPostModal({
                                    visible: true,
                                    data: job,
                                  })
                                }
                                className="font-size-3 font-weight-bold text-green text-uppercase"
                              >
                                Edit
                              </span>
                            </td>
                            <td className="table-y-middle py-7 min-width-px-100">
                              {confirmDelete === job.job_id ? (
                                <span className="d-flex justify-content-center align-items-center">
                                  <button
                                    onClick={() => setConfirmDelete(null)}
                                    className="btn btn-sm btn-outline-black mr-2"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => removeJobPost(job.job_id)}
                                    className="btn btn-sm btn-danger"
                                  >
                                    Confirm
                                  </button>
                                </span>
                              ) : (
                                <span
                                  onClick={() => setConfirmDelete(job.job_id)}
                                  className="font-size-3 font-weight-bold text-red-2 text-uppercase"
                                >
                                  Delete
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
        <ModalAddJobPost fetchJobs={fetchJobs} />
      </PageWrapper>
    </>
  );
};

export default withAuth(DashboardJobs);
