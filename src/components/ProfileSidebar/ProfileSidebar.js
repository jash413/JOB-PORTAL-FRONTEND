import React, { useContext } from "react";
import { Link } from "gatsby";
import { VscVerified, VscUnverified } from "react-icons/vsc";
import imgP from "../../assets/image/l3/png/pro-img.png";
import GlobalContext from "../../context/GlobalContext";
import { MdEdit } from "react-icons/md";

const Sidebar = (props) => {
  const gContext = useContext(GlobalContext);
  const userDetails = JSON.parse(gContext?.user);

  return (
    <>
      {/* <!-- Sidebar Start --> */}

      <div {...props}>
        <div className="pl-lg-5">
          {/* <!-- Top Start --> */}
          <div className="bg-white shadow-9 rounded-4">
            <div className="px-5 text-center border-bottom border-mercury">
              <div className="d-flex justify-content-end align-items-end">
                <span
                  className="p-2"
                  onClick={() => {
                    gContext.toggleProfileModal();
                  }}
                >
                  <MdEdit />
                </span>
              </div>
              <div className="py-11">
                <Link to="/#" className="mb-4">
                  <img className="circle-54" src={imgP} alt="" />
                </Link>
                <h4 className="mb-0">
                  <p className="text-black-2 font-size-6 font-weight-semibold">
                    {userDetails?.login_name}
                  </p>
                </h4>
                <p className="mb-8">
                  <p className="text-gray font-size-4">Product Designer</p>
                </p>
                <div className="icon-link d-flex align-items-center justify-content-center flex-wrap">
                  <Link
                    to="/#"
                    className="text-smoke circle-32 bg-concrete mr-5 hover-bg-green"
                  >
                    <i className="fab fa-linkedin-in"></i>
                  </Link>
                  <Link
                    to="/#"
                    className="text-smoke circle-32 bg-concrete mr-5 hover-bg-green"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </Link>
                  <Link
                    to="/#"
                    className="text-smoke circle-32 bg-concrete mr-5 hover-bg-green"
                  >
                    <i className="fab fa-twitter"></i>
                  </Link>
                  <Link
                    to="/#"
                    className="text-smoke circle-32 bg-concrete mr-5 hover-bg-green"
                  >
                    <i className="fab fa-dribbble"></i>
                  </Link>
                  <Link
                    to="/#"
                    className="text-smoke circle-32 bg-concrete mr-5 hover-bg-green"
                  >
                    <i className="fab fa-behance"></i>
                  </Link>
                </div>
              </div>
            </div>
            {/* <!-- Top End --> */}
            {/* <!-- Bottom Start --> */}
            <div className="px-9 pt-lg-5 pt-9 pt-xl-9 pb-5">
              <h5 className="text-black-2 mb-8 font-size-5">Contact Info</h5>
              {/* <!-- Single List --> */}
              <div className="mb-7">
                <p className="font-size-4 mb-0">Location</p>
                <h5 className="font-size-4 font-weight-semibold mb-0 text-black-2 text-break">
                  New York , USA
                </h5>
              </div>
              {/* <!-- Single List --> */}
              {/* <!-- Single List --> */}
              <div className="mb-7">
                <p className="font-size-4 mb-0">E-mail</p>
                <div className="d-flex align-items-start justify-content-between w-100">
                  <h5 className="font-size-4 font-weight-semibold mb-0">
                    <p className="text-black-2 text-break">
                      {userDetails?.login_email}
                    </p>
                  </h5>
                  <span
                    onClick={() => {
                      if (userDetails?.email_ver_status === 0) {
                        return gContext.toggleEmailVerifyModal();
                      } else {
                        return null;
                      }
                    }}
                  >
                    {userDetails?.email_ver_status === 1 ? (
                      <VscVerified color="green" title="Email verified" />
                    ) : (
                      <VscUnverified color="red" title="Email unverified" />
                    )}
                  </span>
                </div>
              </div>
              {/* <!-- Single List --> */}
              {/* <!-- Single List --> */}
              <div className="mb-7">
                <p className="font-size-4 mb-0">Phone</p>
                <div className="d-flex align-items-center justify-content-between w-100">
                  <h5 className="font-size-4 font-weight-semibold mb-0">
                    <span className="text-black-2 text-break">
                      {userDetails?.login_mobile}
                    </span>
                  </h5>
                  <span
                    onClick={() => {
                      if (userDetails?.phone_ver_status === 0) {
                        return gContext.toggleOptVerifyModal();
                      } else {
                        return null;
                      }
                    }}
                  >
                    {userDetails?.phone_ver_status === 1 ? (
                      <VscVerified color="green" title="Phone no. verified" />
                    ) : (
                      <VscUnverified color="red" title="Phone no. unverified" />
                    )}
                  </span>
                </div>
              </div>
              {/* <!-- Single List --> */}
              {/* <!-- Single List --> */}
              <div className="mb-7">
                <p className="font-size-4 mb-0">Website Linked</p>
                <h5 className="font-size-4 font-weight-semibold mb-0">
                  <Link to="/#" className="text-break">
                    www.nameac.com
                  </Link>
                </h5>
              </div>
              {/* <!-- Single List --> */}
            </div>
            {/* <!-- Bottom End --> */}
          </div>
        </div>
      </div>

      {/* <!-- Sidebar End --> */}
    </>
  );
};

export default Sidebar;
