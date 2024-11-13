import React from "react";
import { Link } from "gatsby";
import PageWrapper from "../components/PageWrapper";
import { Select } from "../components/Core";
import withAuth from "../hooks/withAuth";
import ModalAddJobPost from "../components/ModalAddJobPost";

const defaultJobs = [
  { value: "pd", label: "Product Designer" },
  { value: "gd", label: "Graphics Designer" },
  { value: "fd", label: "Frontend Developer" },
  { value: "bd", label: "Backend Developer" },
  { value: "cw", label: "Content Writer" },
];

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
          <div className="container">
            <div className="mb-5">
              <div className="row mb-11 align-items-start">
                <div className="col-lg-12 mb-lg-0 mb-4">
                  <h3 className="font-size-6 mb-0">
                    Posted Jobs ({jobs.length})
                  </h3>
                </div>
                <div
                  className="p-4 my-4 w-100"
                  style={{
                    margin: "0px 15px",
                  }}
                >
                  <div className="d-flex flex-column flex-lg-row align-items-end align-items-lg-center justify-content-between w-100 px-5">
                    {/* Label for Filter */}
                    <div className="d-flex flex-column flex-lg-row align-items-center mb-3 mb-lg-0 gap-2">
                      <p
                        className="mb-0 font-weight-bold text-muted d-none d-xl-block"
                        style={{
                          whiteSpace: "nowrap",
                        }}
                      >
                        Filter by Job:
                      </p>
                      {/* Job Category Select */}
                      <div
                        className="w-100 ml-0 ml-lg-5"
                        style={{
                          minWidth: "300px",
                        }}
                      >
                        <Select
                          isClearable
                          options={jobCategories}
                          className="form-select w-100"
                          onChange={(option) =>
                            handleFilterChange({ job_cate: option?.value })
                          }
                        />
                      </div>
                    </div>

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
                        {jobs.length > 0 ? (
                          jobs.map((job, id) => (
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
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className="text-center py-7">
                              <h3 className="font-size-4 font-weight-normal text-black-2 mb-0">
                                No records found
                              </h3>
                            </td>
                          </tr>
                        )}
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
        <ModalAddJobPost />
      </PageWrapper>
    </>
  );
};
export default withAuth(DashboardJobs);
