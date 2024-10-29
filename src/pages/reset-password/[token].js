import React from "react";
import ModalChangePassword from "../../components/ModalChangePassword";
import Hero from "../../sections/landing1/Hero";
import PageWrapper from "../../components/PageWrapper";
import Brands from "../../sections/landing1/Brands";
import Categories from "../../sections/landing1/Categories";
import Content from "../../sections/landing1/Content1";
import FeaturedJobs from "../../sections/landing1/FeaturedJobs";

const ChangePassword = () => {
  return (
    <>
      <PageWrapper
        headerConfig={{
          bgClass: "dynamic-sticky-bg",
        }}
      >
        <Hero />
        <Brands />
        <Categories />
        <Content />
        <FeaturedJobs />
        <Content />
        <ModalChangePassword />
      </PageWrapper>
    </>
  );
};

export default ChangePassword;
