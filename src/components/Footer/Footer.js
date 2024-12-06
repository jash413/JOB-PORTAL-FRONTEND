import React from "react";
import { Link } from "gatsby";
import Logo from "../Logo";
import imgM from "../../assets/image/l1/png/message.png";

const Footer = () => {
  return (
    <>
      <footer className="footer bg-ebony-clay dark-mode-texts">
        <div className="container  pt-12 pt-lg-19 pb-10 pb-lg-19">
          <div className="row">
            <div className="col-lg-4 col-sm-6 mb-lg-0 mb-9">
              {/* <!-- footer logo start --> */}
              <Logo white className="footer-logo mb-14" />
              {/* <!-- footer logo End --> */}
              {/* <!-- media start --> */}
              <div className="media mb-11">
                <img src={imgM} className="align-self-center mr-3" alt="" />
                <div className="media-body pl-5">
                  <p className="mb-0 font-size-4 text-white">Contact us at</p>
                  <Link
                    className="mb-0 font-size-4 font-weight-bold"
                    href="mailto:info@initinfologic.com"
                  >
                    info@initinfologic.com
                  </Link>
                </div>
              </div>
              {/* <!-- media start --> */}
              {/* <!-- widget social icon start --> */}
              <div className="social-icons">
                <ul className="pl-0 list-unstyled d-flex align-items-end ">
                  <li className="d-flex flex-column justify-content-center px-3 mr-3 font-size-4 heading-default-color">
                    Follow us on:
                  </li>
                  <li className="d-flex flex-column justify-content-center px-3 mr-3">
                    <Link
                      to="/#"
                      className="hover-color-primary heading-default-color"
                    >
                      <i className="fab fa-facebook-f font-size-3 pt-2"></i>
                    </Link>
                  </li>
                  <li className="d-flex flex-column justify-content-center px-3 mr-3">
                    <Link
                      to="/#"
                      className="hover-color-primary heading-default-color"
                    >
                      <i className="fab fa-twitter font-size-3 pt-2"></i>
                    </Link>
                  </li>
                  <li className="d-flex flex-column justify-content-center px-3 mr-3">
                    <Link
                      to="/#"
                      className="hover-color-primary heading-default-color"
                    >
                      <i className="fab fa-linkedin-in font-size-3 pt-2"></i>
                    </Link>
                  </li>
                </ul>
              </div>
              {/* <!-- widget social icon end --> */}
            </div>
            <div className="col-lg-8 col-md-6">
              <div className="row">
                <div className="col-lg-3 col-md-6 col-sm-3 col-xs-6">
                  <div className="footer-widget widget2 mb-md-0 mb-13">
                    {/* <!-- footer widget title start --> */}
                    <p className="widget-title font-size-4 text-gray mb-md-8 mb-7">
                      Company
                    </p>
                    {/* <!-- footer widget title end --> */}
                    {/* <!-- widget social menu start --> */}
                    <ul className="widget-links pl-0 list-unstyled list-hover-primary">
                      <li className="mb-6">
                        <Link
                          className="heading-default-color font-size-4 font-weight-normal"
                          href="https://initinfologic.com/"
                        >
                          About us
                        </Link>
                      </li>
                      <li className="mb-6">
                        <Link
                          className="heading-default-color font-size-4 font-weight-normal"
                          href="https://initinfologic.com/"
                        >
                          Contact us
                        </Link>
                      </li>
                      <li className="mb-6">
                        <Link
                          className="heading-default-color font-size-4 font-weight-normal"
                          href="https://initinfologic.com/"
                        >
                          Careers
                        </Link>
                      </li>
                      <li className="mb-6">
                        <Link
                          className="heading-default-color font-size-4 font-weight-normal"
                          href="https://initinfologic.com/"
                        >
                          Press
                        </Link>
                      </li>
                    </ul>
                    {/* <!-- widget social menu end --> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
