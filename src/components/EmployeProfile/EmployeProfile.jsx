import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { EmployerValidationSchema } from "../../utils/validations/validations";
import GlobalContext from "../../context/GlobalContext";
import { REQ } from "../../libs/constants";
import axiosInterceptors from "../../libs/integration/axiosInterceptors";
import { toast } from "react-toastify";
import { MdEdit } from "react-icons/md";
import { FaTrashCan } from "react-icons/fa6";
import withAuth from "../../hooks/withAuth";

const EmployeProfile = () => {
  const gContext = useContext(GlobalContext);
  const userDetails = JSON.parse(gContext?.user);
  const [empRegistered, setEmpRegistered] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [cmpCode, setCmpCode] = useState(null);
  const { setCompanyRegistered } = gContext;
  console.log(gContext.companyRegistered, "employer");

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

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center">
        <h4 className="mb-4">Company Profile</h4>
        {
          !editMode && empRegistered && (
            <span className="ml-5" onClick={() => setEditMode(true)}>
              <MdEdit fill="black" size={20} />
            </span>
          )
        }
        {/* {editMode && (
          <span
            title="Remove employer details"
            className="bg-transpernent mr-2 rounded text-red px-2 py-1"
            onClick={handleRemoveEmployer}
          >
            <FaTrashCan size={20} />
          </span>
        )} */}
      </div >
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
                  <Field name="cmp_name" type="text" className="form-control" />
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
                  <Field name="cmp_mobn" type="text" className="form-control" />
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
                  <Field name="cmp_webs" type="text" className="form-control" />
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
                  <Field name="emp_loca" type="text" className="form-control" />
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
    </div >
  );
};

export default withAuth(EmployeProfile);
