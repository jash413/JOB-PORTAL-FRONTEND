import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";
import {
  changePasswordValidationSchema,
  EmployerValidationSchema,
} from "../../utils/validations/validations";
import GlobalContext from "../../context/GlobalContext";
import { REQ } from "../../libs/constants";
import axiosInterceptors from "../../libs/integration/axiosInterceptors";
import { toast } from "react-toastify";
import { MdEdit } from "react-icons/md";
import withAuth from "../../hooks/withAuth";
import { Nav, Tab } from "react-bootstrap";

const EmployeProfile = () => {
  const gContext = useContext(GlobalContext);
  const [showPass, setShowPass] = useState(true);
  const userDetails = JSON.parse(gContext?.user);
  const [empRegistered, setEmpRegistered] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [cmpCode, setCmpCode] = useState(null);
  const { setCompanyRegistered } = gContext;

  const togglePassword = () => {
    setShowPass(!showPass);
  };

  const [initialValues, setInitialValues] = useState({
    cmp_name: "",
    cmp_email: "",
    cmp_mobn: "",
    cmp_webs: "",
    emp_loca: "",
    emp_addr: "",
  });

  const handleProfileSubmit = async (values, actions) => {
    try {
      if (empRegistered) {
        await axiosInterceptors.put(
          REQ?.CREATE_EMPLOYER.replace(":id", userDetails?.login_id),
          values
        );
        toast.success("Employer updated successfully");
      } else {
        await axiosInterceptors.post(REQ?.CREATE_EMPLOYER, values);
        toast.success("Employer created successfully");
      }
      // actions.resetForm();
      fetchEmployerDetails();
      setEditMode(false);
    } catch (error) {
      if (error.data.error === "Error creating employer") {
        toast.error("Eployer already exists");
      }
    } finally {
      actions.setSubmitting(false);
    }
  };

  // const handleRemoveEmployer = async () => {
  //   try {
  //     await axiosInterceptors.delete(
  //       REQ?.GET_EMPLOYERS.replace(":id", cmpCode)
  //     );
  //     toast.success("Employer details removed successfully");
  //     fetchEmployerDetails();
  //     setEditMode(false);
  //     setEmpRegistered(false);
  //   } catch (error) {
  //     console.error("Error:", error);
  //   } finally {
  //     fetchEmployerDetails();
  //   }
  // };

  const fetchEmployerDetails = async () => {
    await axiosInterceptors
      .get(REQ.GET_EMPLOYERS.replace(":id", userDetails?.login_id))
      .then((response) => {
        if (response?.cmp_code) {
          setCompanyRegistered(true);
          setEmpRegistered(true);
          setInitialValues({
            cmp_name: response?.cmp_name || "",
            cmp_email: response?.cmp_email || "",
            cmp_mobn: response?.cmp_mobn || "",
            cmp_webs: response?.cmp_webs || "",
            emp_loca: response?.emp_loca || "",
            emp_addr: response?.emp_addr || "",
          });
          setCmpCode(response?.cmp_code);
        }
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
        setCompanyRegistered(false);
        setInitialValues({
          cmp_name: "",
          cmp_email: "",
          cmp_mobn: "",
          cmp_webs: "",
          emp_loca: "",
          emp_addr: "",
        });
      });
  };

  useEffect(() => {
    const userDetails = JSON.parse(gContext?.user);
    if (userDetails && userDetails?.login_id) {
      fetchEmployerDetails();
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      oldPass: "",
      newPass: "",
    },
    validationSchema: changePasswordValidationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Authentication required. Please log in.");
        setSubmitting(false);
        return;
      }
      try {
        const response = await axiosInterceptors.put(
          REQ.CHANGE_PASSWORD,
          {
            oldPass: values.oldPass,
            newPass: values.newPass,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success(
          `Password changed successfully for ${response.login_name}.`
        );
        resetForm();
      } catch (error) {
        const errorMessage =
          error?.data?.error ||
          error?.data?.message ||
          "Error changing password. Please try again.";

        toast.error(errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Tab.Container id="left-tabs-example" defaultActiveKey="one">
        <div className="bg-white rounded-4 w-100">
          {/* <!-- Tab Section Start --> */}
          <Nav
            className="nav border-bottom border-mercury pl-12"
            role="tablist"
          >
            <li className="tab-menu-items nav-item pr-12">
              <Nav.Link
                eventKey="one"
                className="text-uppercase font-size-3 font-weight-bold text-default-color py-3 px-0"
              >
                Company Profile
              </Nav.Link>
            </li>
            <li className="tab-menu-items nav-item pr-12">
              <Nav.Link
                eventKey="two"
                className="text-uppercase font-size-3 font-weight-bold text-default-color py-3 px-0"
              >
                Change Password
              </Nav.Link>
            </li>
          </Nav>
          {/* <!-- Tab Content --> */}
          <Tab.Content className="w-100">
            <Tab.Pane eventKey="one">
              {/* <!-- Excerpt Start --> */}
              <div className="pr-xl-11 p-5 pl-xs-12 pt-9 pb-11">
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="mb-4">Company Profile</h4>
                  {!editMode && empRegistered && (
                    <span className="ml-5" onClick={() => setEditMode(true)}>
                      <MdEdit fill="black" size={20} />
                    </span>
                  )}
                  {/* {editMode && (
          <span
            title="Remove employer details"
            className="bg-transpernent mr-2 rounded text-red px-2 py-1"
            onClick={handleRemoveEmployer}
          >
            <FaTrashCan size={20} />
          </span>
        )} */}
                </div>
                <Formik
                  initialValues={initialValues}
                  enableReinitialize={true}
                  validationSchema={EmployerValidationSchema}
                  onSubmit={handleProfileSubmit}
                >
                  {({ handleSubmit, resetForm, dirty }) => (
                    <Form onSubmit={handleSubmit}>
                      <div className="mb-3 mt-3">
                        <label
                          htmlFor="cmp_name"
                          className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                        >
                          Company Name
                        </label>
                        {!empRegistered || editMode ? (
                          <>
                            <Field
                              name="cmp_name"
                              type="text"
                              className="form-control"
                            />
                            <ErrorMessage
                              name="cmp_name"
                              component="div"
                              className="text-danger"
                            />
                          </>
                        ) : (
                          <span>{initialValues?.cmp_name}</span>
                        )}
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="cmp_email"
                          className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                        >
                          Email
                        </label>
                        {!empRegistered || editMode ? (
                          <>
                            <Field
                              name="cmp_email"
                              type="email"
                              className="form-control"
                            />
                            <ErrorMessage
                              name="cmp_email"
                              component="div"
                              className="text-danger"
                            />
                          </>
                        ) : (
                          <span>{initialValues?.cmp_email}</span>
                        )}
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="cmp_mobn"
                          className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                        >
                          Mobile Number
                        </label>
                        {!empRegistered || editMode ? (
                          <>
                            <Field
                              name="cmp_mobn"
                              type="text"
                              className="form-control"
                            />
                            <ErrorMessage
                              name="cmp_mobn"
                              component="div"
                              className="text-danger"
                            />
                          </>
                        ) : (
                          <span>{initialValues?.cmp_mobn}</span>
                        )}
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="cmp_webs"
                          className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                        >
                          Website
                        </label>
                        {!empRegistered || editMode ? (
                          <>
                            <Field
                              name="cmp_webs"
                              type="text"
                              className="form-control"
                            />
                            <ErrorMessage
                              name="cmp_webs"
                              component="div"
                              className="text-danger"
                            />
                          </>
                        ) : (
                          <span>{initialValues?.cmp_webs}</span>
                        )}
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="emp_loca"
                          className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                        >
                          Location
                        </label>
                        {!empRegistered || editMode ? (
                          <>
                            <Field
                              name="emp_loca"
                              type="text"
                              className="form-control"
                            />
                            <ErrorMessage
                              name="emp_loca"
                              component="div"
                              className="text-danger"
                            />
                          </>
                        ) : (
                          <span>{initialValues?.emp_loca}</span>
                        )}
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="emp_addr"
                          className="d-block text-black-2 font-size-4 font-weight-semibold mb-4"
                        >
                          Address
                        </label>
                        {!empRegistered || editMode ? (
                          <>
                            <Field
                              name="emp_addr"
                              as="textarea"
                              rows="4"
                              className="form-control"
                              style={{ resize: "none" }}
                            />
                            <ErrorMessage
                              name="emp_addr"
                              component="div"
                              className="text-danger"
                            />
                          </>
                        ) : (
                          <span>{initialValues?.emp_addr}</span>
                        )}
                      </div>

                      <div className="mt-5 float-right">
                        {editMode ? (
                          <div>
                            <button
                              type="button"
                              className="btn btn-outline-black mr-5"
                              onClick={() => {
                                resetForm();
                                setEditMode(false);
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              disabled={!dirty}
                              title={
                                !dirty
                                  ? "Please udpate deatils to continue"
                                  : "Update details"
                              }
                              type="submit"
                              className="btn btn-primary"
                            >
                              Update
                            </button>
                          </div>
                        ) : (
                          !empRegistered && (
                            <button type="submit" className="btn btn-primary">
                              Submit
                            </button>
                          )
                        )}
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
              {/* <!-- Card Section End --> */}
            </Tab.Pane>
            <Tab.Pane eventKey="two">
              {/* <!-- Excerpt Start --> */}
              <div className="pr-xl-11 p-5 pl-xs-12 pt-9 pb-11">
                <form onSubmit={formik.handleSubmit}>
                  <div className="row">
                    <div className="col-12 mb-7">
                      <label
                        htmlFor="oldPass"
                        className="font-size-4 font-weight-semibold text-black-2 mb-5 line-height-reset"
                      >
                        Old Password
                      </label>
                      <input
                        id="oldPass"
                        type="text"
                        className="form-control"
                        placeholder="Old Password"
                        {...formik.getFieldProps("oldPass")}
                      />

                      {formik.errors.oldPass && formik.touched.oldPass ? (
                        <div className="text-danger">
                          {formik.errors.oldPass}
                        </div>
                      ) : null}
                    </div>
                    <div className="col-12 mb-7">
                      <label
                        htmlFor="newPass"
                        className="font-size-4 font-weight-semibold text-black-2 mb-5 line-height-reset"
                      >
                        New Password
                      </label>
                      <div className="position-relative">
                        <input
                          id="newPass"
                          type={showPass ? "password" : "text"}
                          className="form-control"
                          placeholder="New Password"
                          {...formik.getFieldProps("newPass")}
                        />
                        <a
                          href="/#"
                          className="show-password pos-abs-cr fas mr-6 text-black-2"
                          onClick={(e) => {
                            e.preventDefault();
                            togglePassword();
                          }}
                        >
                          <span className="d-none">none</span>
                        </a>
                      </div>
                      {formik.errors.newPass && formik.touched.newPass ? (
                        <div className="text-danger">
                          {formik.errors.newPass}
                        </div>
                      ) : null}
                    </div>
                    <div className="col-lg-12 pt-4">
                      <button
                        className="btn btn-primary text-uppercase w-100 h-px-48"
                        disabled={formik.isSubmitting}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              {/* <!-- Excerpt End --> */}
            </Tab.Pane>
          </Tab.Content>
          {/* <!-- Tab Content End --> */}
          {/* <!-- Tab Section End --> */}
        </div>
      </Tab.Container>
    </>
  );
};

export default withAuth(EmployeProfile);
