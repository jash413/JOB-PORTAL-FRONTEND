import * as Yup from "yup"

export const registerUserValidationSchema = Yup.object({
    login_name: Yup.string().required("Name is required"),
    login_email: Yup.string().email("Invalid email format").required("Email is required"),
    login_pass: Yup.string()
        .min(8, "Password must be at least 8 characters long")
        .matches(/[A-Z]/, "Password must contain at least 1 uppercase letter")
        .matches(/[^A-Za-z0-9]/, "Password must contain at least 2 special characters")
        .matches(/(?:[^A-Za-z0-9].*[^A-Za-z0-9])/, "Password must contain at least 2 special characters")
        .required("Password is required"),
    login_mobile: Yup.string()
        .matches(/^[0-9]+$/, "Phone number must only contain digits")
        .min(10, "Phone number must be at least 10 digits")
        .max(15, "Phone number cannot exceed 15 digits")
        .required("Phone is required"),
});