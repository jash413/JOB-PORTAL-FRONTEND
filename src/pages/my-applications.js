import React, { useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper";
import withAuth from "../hooks/withAuth";
import { Link } from "gatsby";
import { Oval } from "react-loader-spinner";
import axiosInterceptors from "../libs/integration/axiosInterceptors";
import { REQ } from "../libs/constants";
import { Select } from "../components/Core";
import { MdCurrencyRupee } from "react-icons/md";

const MyApplications = () => {
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    nextPage: null,
    prevPage: null,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    // search: "",
    // job_location: "",
    // job_cate: null,
  });

  const [status] = useState([
    { value: "pending", label: "Pending" },
    { value: "accepted", label: "Accepted" },
    { value: "rejected", label: "Rejected" },
  ]);

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

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const fetchApplications = async (isLoadMore = false) => {
    if (!isLoadMore) setLoading(true);
    else setLoadingMore(true);

    const updatedFilters = { ...filters };
    try {
      const response = await axiosInterceptors.post(
        REQ.GET_CANDIDATE_APPLICATIONS,
        updatedFilters
      );
      setMyApplications((prevRecords) =>
        isLoadMore ? [...prevRecords, ...response?.records] : response?.records
      );
      setPagination(response?.pagination);
    } catch (error) {
      console.error("Error fetching job posts", error);
    } finally {
      if (!isLoadMore) setLoading(false);
      else setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchApplications(filters.page > 1);
  }, [filters]);

  const loadMoreApplications = () => {
    if (!loadingMore && pagination.hasNextPage) {
      setFilters((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  };

  return (
    <PageWrapper headerConfig={{ button: "profile" }}>
      <div className="bg-default-2 pt-16 pt-lg-22 pb-lg-27">
        <div className="container">
          {/* <!-- back Button --> */}
          <div className="row justify-content-center">
            <div className="col-12 mt-13 dark-mode-texts">
              <div className="mb-9">
                <span
                  onClick={() => window.history.back()}
                  className="d-flex align-items-center ml-4"
                >
                  <i className="icon icon-small-left bg-white circle-40 mr-5 font-size-7 text-black font-weight-bold shadow-8"></i>
                  <span className="text-uppercase font-size-3 font-weight-bold text-gray">
                    Back
                  </span>
                </span>
              </div>
            </div>
          </div>
          {/* <!-- back Button End --> */}
          <div className="row">
            <div className="col-12 col-md-8 col-lg-12 col-xs-12">
              <div className="pt-12 ml-lg-0 ml-md-15">
                <div className="d-flex align-items-center justify-content-between">
                  <h5 className="font-size-4 font-weight-normal text-default-color">
                    <span className="heading-default-color">
                      <h4 className="font-size-5 font-weight-semibold mb-6">
                        Total Applied ({pagination.totalItems})
                      </h4>
                    </span>
                  </h5>
                  <div>
                    <Select
                      isClearable
                      options={status}
                      defaultValue={[]}
                      placeholder="Select application status"
                      className="form-select w-100"
                      onChange={(option) =>
                        handleFilterChange({ status: option?.value })
                      }
                    />
                  </div>
                </div>
                {loading ? (
                  <div
                    className="d-flex align-items-center justify-content-center text-center w-100"
                    style={
                      {
                        // height: "30vh",
                      }
                    }
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
                  <>
                    <div className="pt-6">
                      <div className="row justify-content-start">
                        {myApplications && myApplications.length > 0 ? (
                          myApplications.map((applications, id) => (
                            <Link
                              to={`/job-details/${applications.job_id}`}
                              key={id}
                              className="col-12 col-lg-4 h-100 d-flex"
                            >
                              <div
                                className="bg-white p-6 rounded-4 mb-4 d-flex flex-column"
                                style={{
                                  minHeight: "350px",
                                  height: "100%",
                                }}
                              >
                                <span className="font-size-3 d-block mb-2 text-muted">
                                  {applications?.job_post?.employer?.cmp_name}
                                </span>
                                <h2 className="mt-0">
                                  <span className="font-size-5 font-weight-bold text-dark">
                                    {applications?.job_post?.job_title}
                                  </span>
                                </h2>
                                <ul className="list-unstyled mb-3">
                                  <li>
                                    <Link
                                      className="bg-light text-primary p-2 rounded"
                                      style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        fontSize: "14px",
                                      }}
                                    >
                                      <MdCurrencyRupee
                                        size={15}
                                        className="me-1"
                                      />
                                      {applications?.job_post?.salary
                                        ? formatSalary(
                                            applications?.job_post?.salary
                                          )
                                        : "00"}
                                    </Link>
                                  </li>
                                </ul>
                                <p
                                  className="text-muted mb-4"
                                  style={{
                                    fontSize: "14px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 3, // Limits description to 3 lines
                                    WebkitBoxOrient: "vertical",
                                  }}
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      applications?.job_post?.job_description,
                                  }}
                                ></p>
                                <div className="mt-auto">
                                  <button
                                    disabled
                                    className="btn btn-outline-dark text-uppercase w-100"
                                    style={{
                                      fontSize: "14px",
                                      padding: "10px",
                                      borderRadius: "5px",
                                    }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                    }}
                                  >
                                    Applied
                                  </button>
                                </div>
                              </div>
                            </Link>
                          ))
                        ) : (
                          <div className="col-12 col-lg-12">
                            <div className="d-flex align-items-center justify-content-center text-center w-100">
                              <h5 className="font-size-4 font-weight-normal text-default-color">
                                No results found
                              </h5>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    {pagination.hasNextPage && (
                      <div className="text-center pt-5 pt-lg-13">
                        <button
                          className="btn btn-primary text-uppercase font-size-3"
                          onClick={() => loadMoreApplications()}
                          disabled={loadingMore}
                        >
                          {loadingMore ? "Loading..." : "Load More"}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
              {/* <!-- form end --> */}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default withAuth(MyApplications);
