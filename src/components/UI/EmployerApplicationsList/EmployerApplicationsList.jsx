import React, { useContext, useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaSort } from "react-icons/fa";
import { FaArrowUpLong, FaArrowDownLong } from "react-icons/fa6";
import { VscChromeClose } from "react-icons/vsc";
import moment from "moment/moment";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";
import { Select } from "../../Core";
import GlobalContext from "../../../context/GlobalContext";
import { REQ } from "../../../libs/constants";
import axiosInterceptors from "../../../libs/integration/axiosInterceptors";
import { Modal } from "react-bootstrap";

const EmployerApplicationsList = () => {
    const gContext = useContext(GlobalContext);

    const [jobApplications, setJobApplications] = useState([]);
    const [jobCategories, setJobCategories] = useState([]);
    const [jobFilter, setJobFilter] = useState([]);
    const [status] = useState([
        { value: "pending", label: "Pending" },
        { value: "accepted", label: "Accepted" },
        { value: "rejected", label: "Rejected" }
    ]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        page: 1,
        limit: 5,
        // sortBy: "",
        // sortOrder: "",
        // status: "",
        // job_cate: "",
    });

    const [confirmationState, setConfirmationState] = useState({
        show: false,
        application: null,
        status: "",
    });
    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
    });

    const openConfirmationModal = (application, status) => {
        setConfirmationState({ show: true, application, status });
    };

    const closeConfirmationModal = () => {
        setConfirmationState({ show: false, application: null, status: "" });
    };

    const handleConfirm = async () => {
        if (confirmationState.application && confirmationState.status) {
            await updateApplicationStatus(confirmationState.application, confirmationState.status);
            closeConfirmationModal();
        }
    };

    const handleSortChange = (column) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            sortBy: column,
            sortOrder: prevFilters.sortBy === column && prevFilters.sortOrder === "ASC" ? "DESC" : "ASC",
            page: 1,
        }));
    };

    const handleFilterChange = (newFilters) => {
        setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
    };

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const response = await axiosInterceptors.post(
                REQ.GET_APPLICATIONS_EMPLOYER,
                filters
            );
            setJobApplications(response?.records);
            setPagination(response?.pagination);
        } catch (error) {
            console.error("Error fetching job posts", error);
        } finally {
            setLoading(false);
        }
    };

    const updateApplicationStatus = async (applicationId, status) => {
        try {
            await axiosInterceptors.put(REQ.UPDATE_APPLICATION_STATUS(applicationId), { status });
            toast.success(`Application ${status} successfully.`);
            fetchJobs();
        } catch (error) {
            console.error(`Error updating application status to ${status}:`, error);
            toast.error(`Failed to update application status to ${status}.`);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [filters]);


    useEffect(() => {
        const fetchJobRecords = async () => {
            try {
                const response = await axiosInterceptors.post(
                    REQ.GET_JOBPOST_RECORDS,
                    { page: 1, limit: 1000 }
                );
                setJobFilter(
                    response?.records?.map((application) => ({
                        value: application?.job_id,
                        label: application?.job_title,
                    }))
                );
            } catch (error) {
                console.error("Error", error);
            }
        };

        fetchJobRecords();
    }, []);


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


    const getSortIcon = (column) => {
        if (filters.sortBy === column) {
            return filters.sortOrder === "ASC" ? <FaArrowUpLong /> : <FaArrowDownLong />;
        }
        return <FaSort />;
    };

    return (
        <>
            <div className="">
                <div className="container">
                    <div className="mb-5">
                        <div className="row mb-5 align-items-start">
                            <div className="col-lg-12 mb-lg-0 mb-4">
                                <h3 className="font-size-6 mb-0">
                                    Applications ({jobApplications?.length || "0"})
                                </h3>
                            </div>
                            <div
                                className="p-4 my-4 w-100"
                                style={{
                                    margin: "0px 15px",
                                }}
                            >
                                <div className="d-flex flex-column flex-lg-row align-items-stretch justify-content-between w-100 px-3 px-lg-5 gap-3">
                                    <div className="d-flex flex-column flex-lg-row flex-wrap justify-content-between align-items-center gap-3 w-100">
                                        <div className="">
                                            <Select
                                                isClearable
                                                options={jobCategories}
                                                placeholder="Select job category"
                                                className="form-select w-100"
                                                onChange={(option) => handleFilterChange({ job_cate: option?.value })}
                                            />
                                        </div>
                                        <div className="">
                                            <Select
                                                isClearable
                                                options={jobFilter}
                                                placeholder="Select by job post"
                                                className="form-select w-100"
                                                onChange={(option) => handleFilterChange({ job_id: option?.value })}

                                            />
                                        </div>
                                        <div className="">
                                            <Select
                                                isClearable
                                                options={status}
                                                defaultValue={[]}
                                                placeholder="Select application status"
                                                className="form-select w-100"
                                                onChange={(option) => handleFilterChange({ status: option?.value })}
                                            />
                                        </div>
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
                                                <th scope="col" className="pl-0 border-0 font-size-4 font-weight-normal text-truncate" onClick={() => handleSortChange("can_name")}>
                                                    Candidate Name {getSortIcon("can_name")}
                                                </th>
                                                <th scope="col" className="pl-4 border-0 font-size-4 font-weight-normal text-truncate" onClick={() => handleSortChange("cate_desc")}>
                                                    Applied for {getSortIcon("cate_desc")}
                                                </th>
                                                <th scope="col" className="pl-4 border-0 font-size-4 font-weight-normal text-truncate" onClick={() => handleSortChange("createdAt")}>
                                                    Applied At {getSortIcon("createdAt")}
                                                </th>
                                                <th scope="col" className="pl-4 border-0 font-size-4 font-weight-normal text-truncate" onClick={() => handleSortChange("status")}>
                                                    Status {getSortIcon("status")}
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="pl-4 border-0 font-size-4 font-weight-normal text-truncate"
                                                ></th>
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
                                            {jobApplications && jobApplications?.length > 0 ? (
                                                jobApplications?.map((job, id) => (
                                                    <tr className="border border-color-2" key={id}>
                                                        <th scope="row" className="pl-6 border-0 py-7 min-width-px-235">
                                                            <h3 className="font-size-4 mb-0 font-weight-semibold text-black-2">
                                                                {job.candidate.can_name}
                                                            </h3>
                                                        </th>
                                                        <td className="table-y-middle py-7 min-width-px-135">
                                                            <h3 className="font-size-4 font-weight-normal text-black-2 mb-0 text-nowrap">
                                                                {job.job_post.job_title}
                                                            </h3>
                                                        </td>
                                                        <td className="table-y-middle py-7 min-width-px-125">
                                                            <h3 className="font-size-4 font-weight-normal text-black-2 mb-0">
                                                                {moment(job.appliedAt).format("DD MMM, YYYY")}
                                                            </h3>
                                                        </td>
                                                        <td className="table-y-middle py-7 min-width-px-155">
                                                            <span
                                                                className={`badge ${job.status === "pending" ? "bg-warning text-dark" : "bg-danger text-white"
                                                                    }`}
                                                            >
                                                                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                                                            </span>
                                                        </td>
                                                        <td className="table-y-middle py-7 min-width-px-155">
                                                            <h3
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    gContext.setApplicationModalVisible({
                                                                        visible: true,
                                                                        data: job,
                                                                    });
                                                                }}
                                                                className="font-size-3 font-weight-bold text-black-2 text-uppercase">
                                                                View Application
                                                            </h3>
                                                        </td>
                                                        <td className="table-y-middle py-7 min-width-px-155">
                                                            <h3
                                                                className="font-size-3 font-weight-bold text-green text-uppercase"
                                                                onClick={() => openConfirmationModal(job.id, "accepted")}
                                                            >
                                                                Accept
                                                            </h3>
                                                        </td>
                                                        <td className="table-y-middle py-7 min-width-px-155">
                                                            <h3
                                                                className={`font-size-3 font-weight-bold text-red-2 text-uppercase ${job.status === "rejected" && "text-muted"}`}
                                                                onClick={() => {
                                                                    if (job.status === "pending") {
                                                                        openConfirmationModal(job.id, "rejected")
                                                                    }
                                                                }}
                                                            >
                                                                Reject
                                                            </h3>
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
                                disabled={!pagination?.hasPreviousPage}
                                onClick={() => handlePageChange(pagination?.currentPage - 1)}
                            >
                                <span className="mr-3">
                                    <FaChevronLeft />
                                </span>
                                Previous
                            </button>
                            <span>{`Page ${pagination?.currentPage} of ${pagination?.totalPages}`}</span>
                            <button
                                className="btn btn-light d-flex align-items-center justify-content-center"
                                disabled={!pagination?.hasNextPage}
                                onClick={() => handlePageChange(pagination?.currentPage + 1)}
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
            <Modal
                size="md"
                centered
                show={confirmationState.show}
                onHide={closeConfirmationModal}
                backdrop="static"
            >
                <Modal.Body className="p-5 position-relative">
                    <div className="d-flex justify-content-between align-items-start gap-5 mb-5">

                        <p className="text-center font-weight-bold mb-4">
                            Are you sure you want to <span className="text-capitalize">{confirmationState.status}</span> this application?
                        </p>
                        <VscChromeClose
                            size={24}
                            className="cursor-pointer ml-5"
                            onClick={closeConfirmationModal}
                            style={{ color: '#555' }}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex justify-content-end gap-3">
                        <button
                            onClick={closeConfirmationModal}
                            className="btn btn-sm btn-outline-black mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="btn btn-primary text-uppercase btn-sm"
                        >
                            Confirm
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default EmployerApplicationsList;
