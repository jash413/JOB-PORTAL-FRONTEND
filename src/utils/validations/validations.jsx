import * as Yup from "yup";

export const loginUserValidationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export const registerUserValidationSchema = Yup.object({
  login_name: Yup.string().required("Name is required"),
  login_email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  login_pass: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password cannot exceed 20 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one digit")
    .required("Password is required"),
  login_mobile: Yup.string()
    .matches(/^[0-9]+$/, "Phone number must only contain digits")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits")
    .required("Phone is required"),
});
export const forgetPasswordValidationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
});
export const resetPasswordValidationSchema = Yup.object({
  newPassword: Yup.string().required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

export const changePasswordValidationSchema = Yup.object({
  oldPass: Yup.string().required("Old Password is required"),
  newPass: Yup.string().required("New Password is required"),
});

export const workExprerienceValidationSchema = Yup.object().shape({
  emp_name: Yup.string().required("Company name is required"),
  exp_type: Yup.string().required("Experience type is required"),
  exp_desg: Yup.string().required("Job designation is required"),
  cur_ctc: Yup.number()
    .typeError("Current CTC must be a number")
    .required("Current CTC is required"),
  job_stdt: Yup.date().required("Start date is required"),
  job_endt: Yup.date()
    .min(Yup.ref("job_stdt"), "End date cannot be before start date")
    .required("End date is required"),
});

export const educationDetailsValidationSchema = Yup.object().shape({
  can_edu: Yup.string()
    .required("Education level is required")
    .matches(/^[a-zA-Z\s]+$/, "Education level should only contain letters"),
  can_scho: Yup.string()
    .required("School/University name is required")
    .max(100, "School/University name should not exceed 100 characters"),
  can_pasy: Yup.string()
    .required("Passing year is required")
    .matches(/^(19|20)\d{2}$/, "Please enter a valid year"),
  can_perc: Yup.number()
    .required("Percentage is required")
    .min(0, "Percentage cannot be less than 0")
    .max(100, "Percentage cannot be more than 100")
    .typeError("Percentage must be a number"),
  can_stre: Yup.string()
    .required("Stream/Major is required")
    .max(50, "Stream/Major should not exceed 50 characters"),
  can_cgpa: Yup.number()
    .required("CGPA is required")
    .min(0, "CGPA cannot be less than 0")
    .max(10, "CGPA cannot be more than 10")
    .typeError("CGPA must be a number"),
  // can_code: Yup.string()
  //   .required("Unique code is required")
  //   .matches(/^[0-9]+$/, "Unique code should only contain numbers")
  //   .max(10, "Unique code should not exceed 10 digits"),
});

export const canProfileValidationSchema = Yup.object().shape({
  can_name: Yup.string().required("Name is required"),
  can_email: Yup.string().email("Invalid email").required("Email is required"),
  can_mobn: Yup.string()
    .matches(/^\d+$/, "Mobile number must be digits only")
    .required("Mobile number is required"),
  can_job_cate: Yup.number()
    .typeError("Job category must be a number")
    .required("Job category is required"),
  // reg_date: Yup.date().required("Registration date is required"),
  // profileImage: Yup.mixed().required("Profile image is required"),
  // resume: Yup.mixed().required("Resume is required"),
});

export const empProfileValidationSchema = Yup.object().shape({
  login_name: Yup.string().required("Name is required"),
  login_email: Yup.string().email("Invalid email").required("Email is required"),
  login_mobile: Yup.string()
    .matches(/^\d+$/, "Mobile number must be digits only")
    .required("Mobile number is required"),
});

export const EmployerValidationSchema = Yup.object({
  cmp_name: Yup.string()
    .required("Company name is required")
    .min(2, "Company name should be at least 2 characters"),
  cmp_email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  cmp_mobn: Yup.string()
    .required("Mobile number is required")
    .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
  cmp_webs: Yup.string()
    // .url("Enter a valid URL")
    .required("Website URL is required"),
  emp_loca: Yup.string().required("Location is required"),
  emp_addr: Yup.string().required("Address is required"),
});