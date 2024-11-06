import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import GlobalContext from "../../context/GlobalContext";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { profileValidationSchema } from "../../utils/validations/validations";
import axiosInterceptors from "../../libs/integration/axiosInterceptors";
import { REQ, SERVER } from "../../libs/constants";
import { FaCamera, FaUpload } from "react-icons/fa";
import { useDropzone } from "react-dropzone";
import { VscChromeClose } from "react-icons/vsc";
import { toast } from "react-toastify";

const ModalStyled = styled(Modal)`
  /* &.modal {
    z-index: 10050;
  } */
`;
const ProfilePictureWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const ProfilePicture = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #d3d3d3;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f2f2f2;
  background-image: ${(props) =>
    props.image ? `url(${props.image})` : "none"};
  background-size: cover;
  background-position: center;
`;

const CameraIconWrapper = styled.label`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #4285f4;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const HiddenInput = styled.input`
  display: none;
`;

const DropzoneContainer = styled.div`
  border: 2px dashed #d3d3d3;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ResumeUpload = ({ setFieldValue }) => {
  const [file, setFile] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setFieldValue("resume", selectedFile);
    },
    accept: {
      "application/pdf": [".pdf"],
      // "application/msword": [".doc", ".docx"],
    },
  });

  const clearFile = () => {
    setFile(null);
    setFieldValue("resume", null);
  };

  return (
    <>
      {!file && (
        <DropzoneContainer {...getRootProps()}>
          <input {...getInputProps()} />
          <FaUpload />
          <p>Drop files or click here to upload</p>
          <ErrorMessage name="resume" component="div" className="text-danger" />
        </DropzoneContainer>
      )}

      {file && (
        <div className="file-preview mt-3 border px-2 py-1 d-flex w-max justify-content-between align-items-center">
          <p className="mb-0">{file.name}</p>
          <span onClick={clearFile} style={{ cursor: "pointer" }}>
            <VscChromeClose />
          </span>
        </div>
      )}
    </>
  );
};

const ModalProfile = (props) => {
  const gContext = useContext(GlobalContext);
  const [profileImage, setProfileImage] = useState(null);
  const [jobCategories, setJobCategories] = useState([]);
  const [initialValues, setInitialValues] = useState({
    can_name: "",
    can_email: "",
    can_mobn: "",
    can_job_cate: "",
    profileImage: null,
    resume: null,
  });
  const userDetails = JSON.parse(gContext?.user);

  const handleClose = () => {
    gContext.toggleProfileModal();
    setProfileImage(null);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && /(\.jpg|\.jpeg|\.png)$/i.test(file.name)) {
      setProfileImage(file);
    } else {
      toast.error(
        "Please select a file with a valid extension (JPEG, JPG, PNG)."
      );
    }
  };

  const handleSubmit = async (values, actions) => {
    const formData = new FormData();

    formData.append("can_name", values.can_name);
    formData.append("can_email", values.can_email);
    formData.append("can_mobn", values.can_mobn);
    formData.append("can_job_cate", values.can_job_cate);

    const currentDate = new Date().toISOString().split("T")[0];
    formData.append("reg_date", currentDate);

    if (profileImage) {
      formData.append("profileImage", profileImage);
    }
    if (values.resume) {
      formData.append("resume", values.resume);
    }

    try {
      const response = await axiosInterceptors.post(
        REQ?.CREATE_CANDIDATE,
        formData
      );
      const userDetails = JSON.parse(gContext?.user);

      const updatedUserDetails = {
        ...userDetails,
        can_code: response?.can_code,
      };
      gContext.setUser(JSON.stringify(updatedUserDetails));
      handleClose();
    } catch (error) {
      console.error("API error:", error);
    } finally {
      actions.setSubmitting(false);
    }
  };

  useEffect(() => {
    if (gContext.profileModal) {
      axiosInterceptors
        .post(REQ.JOB_CATEGORIES, {
          page: 1,
          limit: 50,
        })
        .then((response) => {
          setJobCategories(response?.records);
        })
        .catch((error) => {
          console.error("Error fetching job categories:", error);
        });
    }
  }, [gContext.profileModal]);

  useEffect(() => {
    const userDetails = JSON.parse(gContext?.user);
    if (userDetails && userDetails?.login_id) {
      axiosInterceptors
        .get(REQ.GET_CANDIDATE + `/${userDetails?.login_id}`, {
          id: userDetails?.login_id,
        })
        .then((response) => {
          console.log("User details:", response);
          setInitialValues({
            can_name: response?.can_name || "",
            can_email: response?.can_email || "",
            can_mobn: response?.can_mobn || "",
            can_job_cate: response?.can_job_cate || "",
            profileImage: `${SERVER}/${response?.can_profile_img}` || null,
            resume: response?.can_resume || null,
          });
          // {
          //     "login_id": 60,
          //     "can_code": 21,
          //     "can_name": "React Dev",
          //     "can_email": "react.dev@yopmail.com",
          //     "can_mobn": "8780761335",
          //     "can_job_cate": 5,
          //     "can_profile_img": "uploads/candidates/profileImage-1730809668235-619950937.jpg",
          //     "reg_date": "2024-11-05",
          //     "can_about": null,
          //     "can_skill": null,
          //     "can_appr": false,
          //     "can_resume": "uploads/candidates/resume-1730809668729-530876935.pdf",
          //     "createdAt": "2024-11-05T12:27:48.000Z",
          //     "updatedAt": "2024-11-05T12:27:48.000Z"
          // }
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
        });
    }
  }, [gContext.profileModal]);

  return (
    <ModalStyled
      {...props}
      size="lg"
      centered
      show={gContext.profileModal}
      onHide={gContext.toggleProfileModal}
    >
      <Modal.Body className="p-0">
        <button
          type="button"
          className="circle-32 btn-reset bg-white pos-abs-tr mt-md-n6 mr-lg-n6 focus-reset z-index-supper"
          onClick={handleClose}
        >
          <i className="fas fa-times"></i>
        </button>
        <div className="login-modal-main bg-white rounded-8 overflow-hidden">
          <div className="row no-gutters">
            <div className="col-lg-12 col-md-12">
              <div className="bg-white-2 h-100 px-11 pt-11 pb-12">
                <h5 className="mb-6">Profile Information</h5>
                <Formik
                  initialValues={initialValues}
                  validationSchema={profileValidationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ setFieldValue, isSubmitting }) => (
                    <Form>
                      <div className="d-flex justify-content-center align-items-center">
                        <ProfilePictureWrapper>
                          <ProfilePicture
                            image={
                              profileImage && URL.createObjectURL(profileImage)
                            }
                          >
                            {!profileImage && <span>+</span>}
                          </ProfilePicture>
                          <CameraIconWrapper>
                            <HiddenInput
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                            <FaCamera color="white" size={16} />
                          </CameraIconWrapper>
                        </ProfilePictureWrapper>
                      </div>

                      <div className="form-group">
                        <label>Name</label>
                        <Field
                          type="text"
                          name="can_name"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="can_name"
                          component="div"
                          className="text-danger"
                        />
                      </div>

                      <div className="form-group">
                        <label>Email</label>
                        <Field
                          type="email"
                          name="can_email"
                          className="form-control"
                          disabled={userDetails?.email_ver_status === 1}
                        />
                        <ErrorMessage
                          name="can_email"
                          component="div"
                          className="text-danger"
                        />
                      </div>

                      <div className="form-group">
                        <label>Mobile Number</label>
                        <Field
                          type="text"
                          name="can_mobn"
                          className="form-control"
                          disabled={userDetails?.phone_ver_status === 1}
                        />
                        <ErrorMessage
                          name="can_mobn"
                          component="div"
                          className="text-danger"
                        />
                      </div>

                      <div className="form-group">
                        <label>Job Category</label>
                        <Field
                          as="select"
                          name="can_job_cate"
                          className="form-control"
                        >
                          <option value="">Select Job Category</option>
                          {jobCategories.map((category) => (
                            <option
                              key={category.cate_code}
                              value={category.cate_code}
                            >
                              {category.cate_desc}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="can_job_cate"
                          component="div"
                          className="text-danger"
                        />
                      </div>

                      <div className="form-group">
                        <label>Resume</label>
                        <ResumeUpload setFieldValue={setFieldValue} />
                      </div>

                      <div className="d-flex justify-content-end">
                        <button
                          type="button"
                          className="btn btn-outline-black mr-2"
                          onClick={handleClose}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={isSubmitting}
                        >
                          Submit
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </ModalStyled>
  );
};

export default ModalProfile;
