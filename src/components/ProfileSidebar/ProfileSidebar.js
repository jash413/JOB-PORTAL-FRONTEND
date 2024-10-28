import React, { useContext } from "react";
import { Link } from "gatsby";
import { VscVerified, VscUnverified } from "react-icons/vsc";
import imgP from "../../assets/image/l3/png/pro-img.png";
import GlobalContext from "../../context/GlobalContext";

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
            <div className="px-5 py-11 text-center border-bottom border-mercury">
              <Link to="/#" className="mb-4">
                <img className="circle-54" src={imgP} alt="" />
              </Link>
              <h4 className="mb-0">
                <Link
                  to="/#"
                  className="text-black-2 font-size-6 font-weight-semibold"
                >
                  {userDetails?.login_name}
                </Link>
              </h4>
              <p className="mb-8">
                <Link to="/#" className="text-gray font-size-4">
                  Product Designer
                </Link>
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
                <div className="d-flex align-items-center justify-content-between w-100">
                  <h5 className="font-size-4 font-weight-semibold mb-0">
                    <a
                      className="text-black-2 text-break"
                      href="mailto:name_ac@gmail.com"
                    >
                      {userDetails?.login_email}
                    </a>
                  </h5>
                  <span>
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
                    <a
                      className="text-black-2 text-break"
                      href="tel:+999565562"
                    >
                      {userDetails?.login_mobile}
                    </a>
                  </h5>
                  <span>
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
