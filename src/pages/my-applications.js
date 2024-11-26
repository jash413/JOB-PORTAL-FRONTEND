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
                              className="col-12 col-lg-4"
                            >
                              {/* <!-- Start Feature One --> */}
                              <div className="bg-white px-8 pt-9 pb-7 rounded-4 mb-9 feature-cardOne-adjustments">
                                <span className="font-size-3 d-block mb-0 text-gray">
                                  {applications?.job_post?.employer?.cmp_name}
                                </span>
                                <h2 className="mt-n4">
                                  <span className="font-size-7 text-black-2 font-weight-bold mb-4">
                                    {applications?.job_post?.job_title}
                                  </span>
                                </h2>
                                <ul className="list-unstyled mb-1 card-tag-list">
                                  <li>
                                    <Link className="bg-regent-opacity-15 text-eastern font-size-3 rounded-3">
                                      <MdCurrencyRupee
                                        size={15}
                                        className="text-primary"
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
                                  className="mb-7 font-size-4 text-gray job-description"
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      applications?.job_post?.job_description,
                                  }}
                                ></p>
                                <div className="card-btn-group">
                                  <button
                                    disable={true}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                    }}
                                    className="btn btn-reset text-uppercase btn-medium rounded-3 border border-black radius-md"
                                  >
                                    Applied
                                  </button>
                                </div>
                              </div>
                              {/* <!-- End Feature One --> */}
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
