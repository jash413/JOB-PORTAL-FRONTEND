export const menuItems = [
  {
    name: "pages",
    label: "Pages",
    items: [
      {
        name: "job-pages",
        label: "Job Pages",
        items: [
          { name: "search-jobs", label: "Search Jobs" },
          { name: "job-details", label: "Job Details" },
        ],
      },
      {
        name: "dashboard-main",
        label: "Dashboard",
      },
      // {
      //   name: "profile",
      //   label: "Candidate Profile",
      // },
      // {
      //   name: "company-profile",
      //   label: "Company Profile",
      // },
      // {
      //   name: "essential",
      //   label: "Essential",
      //   items: [
      //     { name: "faq", label: "FAQ" },
      //     { name: "404", label: "404" },
      //     { name: "pricing", label: "Pricing" },
      //     { name: "contact", label: "Contact" },
      //   ],
      // },
    ],
  },
  // {
  //   name: "https://uxtheme.net/product-support/",
  //   label: "Support",
  //   isExternal: true,
  // },
];

export const SignUpOptionsItems = [
  {
    name: "Log in",
    label: "Log in",
    items: [
      {
        name: "for-employers",
        value: "EMP",
        label: "For employers",
        itemOf: "login",
      },
      {
        name: "for-candidates",
        value: "CND",
        label: "For candidates",
        itemOf: "login",
      },
    ],
  },
  {
    name: "Sign Up",
    label: "Sign Up",
    items: [
      {
        name: "for-employers",
        value: "EMP",
        label: "For employers",
        itemOf: "signup",
      },
      {
        name: "for-candidates",
        value: "CND",
        label: "For candidates",
        itemOf: "signup",
      },
    ],
  },
];

export const getMenuItemsByUserType = (userType) => {
  return menuItems.map((item) => {
    if (item.items) {
      const filteredItems = item.items.filter((subItem) => {
        if (userType === "CND") {
          // For "CND" users, keep Job Pages, Candidate Pages, and Company Profile
          return (
            subItem.name === "job-pages" ||
            subItem.name === "profile" ||
            subItem.name === "company-profile" ||
            subItem.name === "essential"
          );
        } else if (userType === "EMP") {
          // For "EMP" users, keep only Dashboard
          return (
            subItem.name === "dashboard-main" || subItem.name === "essential"
          );
        }
        return true;
      });

      // Return only filtered items for CND or EMP; otherwise, return item as-is
      return { ...item, items: filteredItems };
    }
    return item;
  });
};
