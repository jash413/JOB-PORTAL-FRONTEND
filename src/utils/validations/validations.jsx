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


export const profileValidationSchema = Yup.object().shape({
  can_name: Yup.string().required("Name is required"),
  can_email: Yup.string().email("Invalid email").required("Email is required"),
  can_mobn: Yup.string()
    .matches(/^\d+$/, "Mobile number must be digits only")
    .required("Mobile number is required"),
  can_job_cate: Yup.number()
    .typeError("Job category must be a number")
    .required("Job category is required"),
  reg_date: Yup.date().required("Registration date is required"),
  profileImage: Yup.mixed().required("Profile image is required"),
  resume: Yup.mixed().required("Resume is required"),
});
