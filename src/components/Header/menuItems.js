export const menuItemsCandidate = [
  {
    name: "home",
    label: "Home",
    items: [{ name: "", label: "Home 1" }],
  },
  {
    name: "pages",
    label: "Pages",
    items: [
      {
        name: "job-pages",
        label: "Job Pages",
        items: [
          { name: "search-grid", label: "Job Grid" },
          { name: "search-list", label: "Job List" },
          { name: "job-details", label: "Job Details" },
        ],
      },
    ],
  },
  {
    name: "https://uxtheme.net/product-support/",
    label: "Support",
    isExternal: true,
  },
];

export const menuItemsEmployer = [
  {
    name: "home",
    label: "Home",
    items: [{ name: "", label: "Home 1" }],
  },
  {
    name: "pages",
    label: "Pages",
    items: [
      {
        name: "dashboard",
        label: "Dashboard",
        items: [
          { name: "dashboard-main", label: "Dashboard Main" },
          { name: "dashboard-settings", label: "Dashboard Settings" },
        ],
      },
    ],
  },
  {
    name: "https://uxtheme.net/product-support/",
    label: "Support",
    isExternal: true,
  },
];

export const SignUpOptionsItems = [
  {
    name: "Sign Up",
    label: "Sign Up",
    items: [
      { name: "for-employers", value: "EMP", label: "For employers" },
      { name: "for-candidates", value: "CND", label: "For candidates" },
    ],
  },
];

// export const getMenuItemsByUserType = (userType) => {
//   return menuItems.map((item) => {
//     if (item.items) {
//       const filteredItems = item.items.filter((subItem) => {
//         if (userType === "CND") {
//           // For "CND" users, keep Job Pages, Candidate Pages, and Company Profile
//           return (
//             subItem.name === "job-pages" ||
//             subItem.name === "profile" ||
//             subItem.name === "company-profile" ||
//             subItem.name === "essential"
//           );
//         } else if (userType === "EMP") {
//           // For "EMP" users, keep only Dashboard
//           return (
//             subItem.name === "dashboard-main" || subItem.name === "essential"
//           );
//         }
//         return true;
//       });

//       // Return only filtered items for CND or EMP; otherwise, return item as-is
//       return { ...item, items: filteredItems };
//     }
//     return item;
//   });
// };
