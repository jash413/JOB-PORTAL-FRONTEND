import React, { useContext, useState } from "react";
import { Link } from "gatsby";
import { Collapse } from "react-bootstrap";
import GlobalContext from "../../context/GlobalContext";
import imgL from "../../assets/image/logo-main-black.png";
import { FaUserClock, FaUserLock } from "react-icons/fa";

const Sidebar = () => {
  const gContext = useContext(GlobalContext);
  const [isCandidatesDropdownOpen, setIsCandidatesDropdownOpen] = useState(
    false
  );

  const toggleDropdown = () => {
    setIsCandidatesDropdownOpen(!isCandidatesDropdownOpen);
  };

  return (
    <>
      <Collapse in={gContext.showSidebarDashboard}>
        <div className="dashboard-sidebar-wrapper pt-11" id="sidebar">
          <div className="brand-logo px-11">
            <Link to="/">
              <img src={imgL} alt="" />
            </Link>
          </div>
          <div className="my-15 px-11">
            <button
              type="button"
              className="btn btn-primary btn-xl w-100 text-uppercase"
              onClick={() => {
                gContext.setJobPostModal({
                  visible: true,
                  data: null,
                });
              }}
            >
              <span className="mr-5 d-inline-block">+</span>Post a new job
            </button>
          </div>
          <ul className="list-unstyled dashboard-layout-sidebar">
            <li className="">
              <Link
                activeClassName="active"
                to="/dashboard-main"
                className="px-10 py-1 my-5 font-size-4 font-weight-semibold flex-y-center"
              >
                <i className="icon icon-layout-11 mr-7"></i>Dashboard
              </Link>
            </li>
            <li className="">
              <Link
                to="/dashboard-jobs"
                activeClassName="active"
                className="px-10 py-1 my-5 font-size-4 font-weight-semibold flex-y-center"
              >
                <i className="fas fa-briefcase mr-7"></i>Posted Jobs
              </Link>
            </li>
            <li className="">
              <Link
                to="/dashboard-applicants"
                activeClassName="active"
                className="px-10 py-1 my-5 font-size-4 font-weight-semibold flex-y-center"
              >
                <i className="fas fa-user mr-7"></i>Applicants{" "}
                <span className="ml-auto px-1 h-1 bg-dodger text-white font-size-3 rounded-5 max-height-px-18 flex-all-center">
                  14
                </span>
              </Link>
            </li>
            <div
              className="px-10 py-1 my-5 font-size-4 font-weight-semibold flex-y-center cursor-pointer d-flex justify-content-between"
              onClick={toggleDropdown}
            >
              <div>
                <i className="fas fa-user mr-7"></i>
                Candidates
              </div>
              <i
                className={`ml-5 fas ${
                  isCandidatesDropdownOpen ? "fa-chevron-up" : "fa-chevron-down"
                }`}
              ></i>
            </div>
            {/* Dropdown Menu */}
            {isCandidatesDropdownOpen && (
              <ul className="list-unstyled">
                <li className="pl-10">
                  <Link
                    to="/dashboard-not-allowed-candidates"
                    activeClassName="active"
                    className="px-10 py-1 my-3 font-size-4 font-weight-semibold flex-y-center"
                  >
                    {/* <FaUserLock size={20} className="sidebar-icons mr-7" /> */}
                    Available Candidates
                  </Link>
                </li>
                <li className="pl-10">
                  <Link
                    to="/dashboard-request-access"
                    activeClassName="active"
                    className="px-10 py-1 my-3 font-size-4 font-weight-semibold flex-y-center"
                  >
                    {/* <FaUserClock size={20} className="sidebar-icons mr-7" /> */}
                    Requested Candidates
                  </Link>
                </li>
              </ul>
            )}
          </ul>
        </div>
      </Collapse>
      <a
        href="/#"
        className="sidebar-mobile-button"
        onClick={(e) => {
          e.preventDefault();
          gContext.toggleSidebarDashboard();
        }}
      >
        <i className="icon icon-sidebar-2"></i>
      </a>
    </>
  );
};

export default Sidebar;
