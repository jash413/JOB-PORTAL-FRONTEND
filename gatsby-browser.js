import React from "react";
import { GlobalProvider } from "./src/context/GlobalContext";
import { CartProvider } from "./src/context/CartContext";
import Layout from "./src/components/Layout";

export const wrapPageElement = ({ element, props }) => {
  // props provide same data to Layout as Page element will get
  // including location, data, etc - you don't need to pass it
  return (
    <>
      {element.key === "/verify-email/:token" ? (
        <div>{element}</div>
      ) : (
        <Layout {...props}>{element}</Layout>
      )}
    </>
  );
};

export const wrapRootElement = ({ element }) => (
  <GlobalProvider>
    <CartProvider>{element}</CartProvider>
  </GlobalProvider>
);
