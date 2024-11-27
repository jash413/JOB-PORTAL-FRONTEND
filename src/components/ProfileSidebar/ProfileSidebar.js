import React, { useContext, useEffect, useState } from "react";
import { Link } from "gatsby";
import { VscVerified, VscUnverified } from "react-icons/vsc";
import imgP from "../../assets/image/l3/png/pro-img.png";
import GlobalContext from "../../context/GlobalContext";
import { MdDownload, MdEdit } from "react-icons/md";
import axiosInterceptors from "../../libs/integration/axiosInterceptors";
import { REQ } from "../../libs/constants";

const Sidebar = (props) => {
  const { canInfo } = props;
  const gContext = useContext(GlobalContext);
  const userDetails = JSON.parse(gContext?.user);
  const userType = userDetails?.login_type;
  const [profileImg, setProfileImg] = useState(null);

  const handleDownload = async (fileName) => {
    try {
      const response = await axiosInterceptors.get(
        REQ.DOWNLOAD_RESUME(canInfo?.can_code),
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(response);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${fileName}_resume.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  useEffect(() => {
    if (canInfo?.can_code) {
      const fetchProfileImg = async () => {
        try {
          const response = await axiosInterceptors.get(
            REQ.DOWNLOAD_PROFILE_IMG(canInfo?.can_code),
            { responseType: "blob" }
          );
          const imageUrl = URL.createObjectURL(response);
          setProfileImg(imageUrl);
        } catch (error) {
          console.error("Error fetching profile image:", error);
        }
      };
      fetchProfileImg();
    }
  }, [canInfo?.can_code]);

  return (
    <>
      {/* <!-- Sidebar Start --> */}
      <div {...props}>
        <div className="pl-lg-5">
          {/* <!-- Top Start --> */}
          <div className="bg-white shadow-9 rounded-4">
            <div className="px-5 text-center border-bottom border-mercury">
              <div className="d-flex justify-content-end align-items-end">
                {userType === "CND" ? (
                  <span
                    className="p-2"
                    onClick={() => {
                      gContext.toggleProfileModal();
                    }}
                  >
                    <MdEdit />
                  </span>
                ) : (
                  <span
                    className="p-2"
                    onClick={() => {
                      gContext.toggleEmpProfileModal();
                    }}
                  >
                    <MdEdit />
                  </span>
                )}
              </div>
              <div className="py-5">
                <Link className="mb-4">
                  <img
                    className="circle-54"
                    style={{ objectFit: "cover" }}
                    src={profileImg ?? imgP}
                    alt=""
                  />
                </Link>
                <h4 className="mb-0">
                  <p className="text-black-2 font-size-6 font-weight-semibold">
                    {userDetails?.login_name}
                  </p>
                </h4>
                {/* <p className="mb-8">
                  <p className="text-gray font-size-4">Product Designer</p>
                </p> */}
                {/* <div className="icon-link d-flex align-items-center justify-content-center flex-wrap">
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
                </div> */}
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
                  {userDetails?.login_mobile ? (
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
                        <VscUnverified
                          color="red"
                          title="Phone no. unverified"
                        />
                      )}
                    </span>
                  ) : (
                    <p className="font-size-3 text-start">
                      Please add phone number
                    </p>
                  )}
                </div>
              </div>

              {canInfo && canInfo?.can_resume && (
                <div className="mb-7">
                  <p className="font-size-4 mb-0">Resume</p>
                  <div className="my-3 px-2 py-1 d-flex w-max justify-content-between align-items-center">
                    <p className="mb-0 font-size-3">{`${canInfo?.can_name}'s resume`}</p>
                    <span style={{ cursor: "pointer" }}>
                      <MdDownload
                        onClick={() => handleDownload(canInfo?.can_name)}
                      />
                    </span>
                  </div>
                </div>
              )}
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
