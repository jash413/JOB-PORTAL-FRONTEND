import React, { useContext, useEffect, useState } from "react";
import { Link, navigate } from "gatsby";
import PageWrapper from "../components/PageWrapper";
import Sidebar from "../components/Sidebar";
import { Select } from "../components/Core";

import imgB1 from "../assets/image/l1/png/feature-brand-1.png";
import withAuth from "../hooks/withAuth";
import { REQ } from "../libs/constants";
import { Oval } from "react-loader-spinner";
import axiosInterceptors from "../libs/integration/axiosInterceptors";
import { MdClear, MdCurrencyRupee } from "react-icons/md";
import { toast } from "react-toastify";
import GlobalContext from "../context/GlobalContext";

const defaultCountries = [
  { value: "sp", label: "Singapore" },
  { value: "bd", label: "Bangladesh" },
  { value: "usa", label: "United States of America" },
  { value: "uae", label: "United Arab Emirates" },
  { value: "pk", label: "Pakistan" },
];

const SearchGrid = () => {
  const gContext = useContext(GlobalContext);
  const userDetails = JSON.parse(gContext?.user);
  const candidateId = userDetails?.login_id;

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState(gContext?.searchQuery?.search ?? "");
  const [location, setLocation] = useState(
    gContext?.searchQuery?.location ?? ""
  );
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    job_location: "",
    job_cate: null,
  });
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    nextPage: null,
    prevPage: null,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const fetchJobs = async (isLoadMore = false) => {
    if (!isLoadMore) setLoading(true);
    else setLoadingMore(true);

    const updatedFilters = {
      ...filters,
      search: filters?.search?.trim() === "" ? undefined : filters?.search,
      job_location:
        filters?.job_location?.trim() === ""
          ? undefined
          : filters?.job_location,
      job_cate: filters?.job_cate ?? undefined,
    };

    try {
      const response = await axiosInterceptors.post(
        REQ.GET_JOBS_LIST_CANDIDATE,
        updatedFilters
      );
      setJobs((prevJobs) =>
        isLoadMore ? [...prevJobs, ...response?.records] : response?.records
      );
      setPagination(response?.pagination);
    } catch (error) {
      console.error("Error fetching job posts", error);
    } finally {
      if (!isLoadMore) setLoading(false);
      else setLoadingMore(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleLocationChange = (selectedOption) => {
    setLocation(selectedOption.value);
  };

  const handleLoadMore = () => {
    if (!loadingMore && pagination.hasNextPage) {
      setFilters((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  };

  useEffect(() => {
    fetchJobs(filters.page > 1);
  }, [filters]);

  useEffect(() => {
    if (gContext?.searchQuery?.bring) {
      gContext.setSearchQuery({
        search: "",
        location: "",
        bring: false,
      });
      setFilters((prev) => ({
        ...prev,
        search:
          gContext?.searchQuery?.search?.trim() === ""
            ? undefined
            : gContext?.searchQuery?.search,
        job_cate:
          gContext?.searchQuery?.location?.trim() === ""
            ? undefined
            : gContext?.searchQuery?.location,
      }));
    }
  }, [gContext?.searchQuery?.bring]);

  const handleLocationSearchCombine = () => {
    setFilters((prev) => ({
      ...prev,
      search,
      job_location: location,
    }));
  };

  const handleLocationSearchCombineClear = () => {
    setFilters((prev) => ({
      ...prev,
      search: "",
      job_location: "",
    }));
    setSearch("");
    setLocation("");
  };

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
        console.error("Error fetching job categories:", error);
      });
  };

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

  return (
    <>
      <PageWrapper>
        <div className="bg-default-1 pt-26 pt-lg-28 pb-13 pb-lg-25">
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-4 col-xs-8">
                <Sidebar setFilters={setFilters} />
              </div>
              <div className="col-12 col-md-8 col-xs-12 ">
                {/* <!-- form --> */}
                <form
                  action="/"
                  className="search-form search-2-adjustment ml-lg-0 ml-md-15"
                >
                  <div className="filter-search-form-2 bg-white rounded-sm shadow-7 pr-6 py-6 pl-6">
                    <div className="filter-inputs">
                      <div className="form-group position-relative w-lg-45 w-xl-40 w-xxl-45">
                        <input
                          className="form-control focus-reset pl-13"
                          type="text"
                          id="keyword"
                          placeholder="Search..."
                          value={search}
                          onChange={handleSearchChange}
                        />
                        <span className="h-100 w-px-50 pos-abs-tl d-flex align-items-center justify-content-center font-size-6">
                          <i className="icon icon-zoom-2 text-primary font-weight-bold"></i>
                        </span>
                      </div>
                      {/* <!-- .select-city starts --> */}
                      <div className="form-group position-relative w-lg-50 w-xl-55 w-xxl-50">
                        <Select
                          options={defaultCountries}
                          onChange={handleLocationChange}
                          // value={location}
                          value={
                            defaultCountries.find(
                              (option) => option.value === location
                            ) || null
                          }
                          defaultValue={[]}
                          className="pl-8 h-100 arrow-3 font-size-4 d-flex align-items-center w-100"
                          border={false}
                        />

                        <span className="h-100 w-px-50 pos-abs-tl d-flex align-items-center justify-content-center font-size-6">
                          <i className="icon icon-pin-3 text-primary font-weight-bold"></i>
                        </span>
                      </div>
                      {/* <!-- ./select-city ends --> */}
                      {(filters.search || filters.job_location) && (
                        <div
                          onClick={() => handleLocationSearchCombineClear()}
                          className="py-4 my-4 d-flex align-items-center justify-content-center"
                        >
                          <MdClear />
                        </div>
                      )}
                    </div>
                    <div className="button-block">
                      <button
                        type="button"
                        onClick={() => handleLocationSearchCombine()}
                        className="btn btn-primary line-height-reset h-100 btn-submit w-100 text-uppercase"
                      >
                        Search
                      </button>
                    </div>
                  </div>
                </form>
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
                  <div className="pt-12 ml-lg-0 ml-md-15">
                    <div className="d-flex align-items-center justify-content-between">
                      <h5 className="font-size-4 font-weight-normal text-default-color">
                        <span className="heading-default-color">
                          <h4 className="font-size-5 font-weight-semibold mb-6">
                            Total jobs ({pagination.totalItems})
                          </h4>
                        </span>
                        {/* results for{" "}
                      <span className="heading-default-color">UI Designer</span> */}
                      </h5>
                    </div>
                    <div className="pt-6">
                      <div className="row justify-content-start">
                        {jobs && jobs.length > 0 ? (
                          jobs.map((job, id) => (
                            <Link
                              to={`/job-details/${job.job_id}`}
                              key={id}
                              className="col-12 col-lg-6"
                            >
                              {/* <!-- Start Feature One --> */}
                              <div className="bg-white px-8 pt-9 pb-7 rounded-4 mb-9 feature-cardOne-adjustments">
                                <span className="font-size-3 d-block mb-0 text-gray">
                                  {job?.employer?.cmp_name}
                                </span>
                                <h2 className="mt-n4">
                                  <span className="font-size-7 text-black-2 font-weight-bold mb-4">
                                    {job?.job_title}
                                  </span>
                                </h2>
                                <ul className="list-unstyled mb-1 card-tag-list">
                                  <li>
                                    <Link className="bg-regent-opacity-15 text-eastern font-size-3 rounded-3">
                                      <MdCurrencyRupee
                                        size={15}
                                        className="text-primary"
                                      />
                                      {job?.salary
                                        ? formatSalary(job?.salary)
                                        : "00"}
                                    </Link>
                                  </li>
                                </ul>
                                <p
                                  className="mb-7 font-size-4 text-gray job-description"
                                  dangerouslySetInnerHTML={{
                                    __html: job?.job_description,
                                  }}
                                ></p>
                                <div className="card-btn-group">
                                  <span
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleJobApply(job.job_id);
                                    }}
                                    className="btn btn-green text-uppercase btn-medium rounded-3"
                                  >
                                    Apply Now
                                  </span>
                                </div>
                              </div>
                              {/* <!-- End Feature One --> */}
                            </Link>
                          ))
                        ) : (
                          <div className="col-12 col-lg-6">
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
                          onClick={() => handleLoadMore()}
                          disabled={loadingMore}
                        >
                          {loadingMore ? "Loading..." : "Load More"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {/* <!-- form end --> */}
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
};
export default withAuth(SearchGrid);
