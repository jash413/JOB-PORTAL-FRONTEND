import React, { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const HorizontalSlider = ({ children }) => {
  const sliderRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    if (sliderRef.current) {
      const { scrollWidth, clientWidth, scrollLeft } = sliderRef.current;

      setIsOverflowing(scrollWidth > clientWidth);
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
    }
  };

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -150, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 150, behavior: "smooth" });
    }
  };

  useEffect(() => {
    updateScrollState();

    const handleResize = () => {
      updateScrollState();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (sliderRef.current) {
      const slider = sliderRef.current;
      slider.addEventListener("scroll", updateScrollState);

      return () => {
        slider.removeEventListener("scroll", updateScrollState);
      };
    }
  }, []);

  return (
    <div className="d-flex justify-content-between align-items-center w-100 slider-container">
      {isOverflowing && canScrollLeft && (
        <span onClick={scrollLeft}>
          <FaChevronLeft />
        </span>
      )}
      <div
        className="d-flex overflow-hidden my-2"
        ref={sliderRef}
        style={{ whiteSpace: "nowrap" }}
      >
        {children}
      </div>
      {isOverflowing && canScrollRight && (
        <span onClick={scrollRight}>
          <FaChevronRight />
        </span>
      )}
    </div>
  );
};

export default HorizontalSlider;
