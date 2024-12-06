import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Range, getTrackBackground } from "react-range";
import axiosInterceptors from "../../libs/integration/axiosInterceptors";
import { REQ } from "../../libs/constants";
import { Select } from "../Core";
import GlobalContext from "../../context/GlobalContext";
import { MdCurrencyRupee } from "react-icons/md";

const STEP = 10000;
const MIN = 5000;
const MAX = 15000000;

const CheckStyled = styled.span`
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #2b3940 !important;
  font-size: 16px;
  color: inherit;
  &::before {
    content: "\f0c8";
    font-weight: 400;
    font-family: "Font Awesome 5 Free";
    display: inline-block;
    color: #7e8989;
    margin-right: 11px;
    margin-top: 2px;
  }
  &.active {
    color: #2b3940 !important;
    font-weight: 600;
    &::before {
      content: "\f14a";
      font-weight: 900;
      color: #f8285a;
    }
  }
`;

const Check = ({ children, isActive, onClick }) => {
  return (
    <CheckStyled
      className={`toggle-item ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      {children}
    </CheckStyled>
  );
};

const Sidebar = ({ setFilters }) => {
  const [rangeValues, setRangeValues] = useState([5000, 3000000]);
  const [jobCategories, setJobCategories] = useState([]);
  const [postedTime, setPostedTime] = useState(undefined);

  useEffect(() => {
    axiosInterceptors
      .post(REQ.JOB_CATEGORIES, {
        page: 1,
        limit: 50,
      })
      .then((response) => {
        setJobCategories(
          response?.records.map((category) => {
            return { value: category.cate_code, label: category.cate_desc };
          })
        );
      })
      .catch((error) => {
        console.error("Error fetching job categories:", error);
      });
  }, []);

  const handleCategoryChange = (selected) => {
    setFilters((prev) => ({
      ...prev,
      job_cate: selected?.value,
    }));
  };

  const handleSalaryChange = (values) => {
    setRangeValues(values);
    setFilters((prev) => ({
      ...prev,
      salary_from: values[0] || undefined,
      salary_to: values[1] || undefined,
    }));
  };

  const handlePostedTimeChange = (time) => {
    const currentDate = new Date();
    let startDate, endDate;

    switch (time) {
      case "Last day":
        startDate = new Date();
        startDate.setDate(currentDate.getDate() - 1);
        endDate = currentDate;
        break;
      case "Last 3 days":
        startDate = new Date();
        startDate.setDate(currentDate.getDate() - 3);
        endDate = currentDate;
        break;
      case "Last week":
        startDate = new Date();
        startDate.setDate(currentDate.getDate() - 7);
        endDate = currentDate;
        break;
      case "Anytime":
      default:
        startDate = undefined;
        endDate = undefined;
        break;
    }

    setPostedTime((prev) => (prev === time ? undefined : time));
    setFilters((prev) => ({
      ...prev,
      posted_at_from: startDate ? startDate.toISOString() : undefined,
      posted_at_to: endDate ? endDate.toISOString() : undefined,
    }));
  };

  function formatSalary(amount) {
    if (amount < 1000) {
      return amount.toString();
    } else if (amount < 1000000) {
      return (amount / 1000).toFixed(1) + "K";
    } else if (amount < 1000000000) {
      return (amount / 1000000).toFixed(1) + "M";
    } else {
      return (amount / 1000000000).toFixed(1) + "B";
    }
  }

  return (
    <>
      {/* <!-- Sidebar Start --> */}
      <div className="widgets mb-11">
        <h4 className="font-size-6 font-weight-semibold mb-6">Job Category</h4>
        <div
          className="w-70 ml-0 ml-lg-5"
          style={{
            minWidth: "300px",
          }}
        >
          <Select
            isClearable
            options={jobCategories}
            placeholder="Select Job Category"
            className="form-select w-100"
            onChange={handleCategoryChange}
          />
        </div>
      </div>
      <div className="widgets mb-11">
        <div className="d-flex align-items-center pr-15 pr-xs-0 pr-md-0 pr-xl-22">
          <h4 className="font-size-6 font-weight-semibold mb-6 w-75">
            Salary Range
          </h4>
          {/* <!-- Range Slider --> */}

          <div className="slider-price w-25 text-right mr-7">
            <p className="font-weight-bold">
              <span
                className="text-primary font-weight-semibold font-size-4 "
                css={`
                  white-space: nowrap;
                `}
              >
                <MdCurrencyRupee size={18} className="text-primary" />
                {formatSalary(rangeValues[0].toFixed())} -{" "}
                {formatSalary(rangeValues[1].toFixed())}
              </span>
            </p>
          </div>
        </div>
        <div className="graph text-center mx-0 mt-5 position-relative chart-postion">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="range-slider">
          <>
            <Range
              values={rangeValues}
              step={STEP}
              min={MIN}
              max={MAX}
              onChange={handleSalaryChange}
              renderTrack={({ props, children }) => (
                <div
                  role="button"
                  tabIndex={0}
                  onMouseDown={props.onMouseDown}
                  onTouchStart={props.onTouchStart}
                  style={{
                    ...props.style,
                    height: "15px",
                    display: "flex",
                    width: "290px",
                  }}
                >
                  <div
                    ref={props.ref}
                    style={{
                      height: "5px",
                      width: "100%",
                      borderRadius: "4px",
                      background: getTrackBackground({
                        values: rangeValues,
                        colors: ["#ccc", "#f8285a", "#ccc"],
                        min: MIN,
                        max: MAX,
                      }),
                      alignSelf: "center",
                    }}
                  >
                    {children}
                  </div>
                </div>
              )}
              renderThumb={({ props, isDragged }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: "24px",
                    width: "24px",
                    borderRadius: "50%",
                    backgroundColor: "#FFF",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: "none !important",
                    outline: "none !important",
                  }}
                  css={`
                    &:focus {
                      outline: none !important;
                    }
                  `}
                ></div>
              )}
            />
          </>
        </div>
      </div>
      {/* <div className="widgets mb-11">
        <h4 className="font-size-6 font-weight-semibold mb-6">
          Experience Level{" "}
        </h4>
        <ul className="list-unstyled filter-check-list">
          <li className="mb-2">
            <Check>All</Check>
          </li>
          <li className="mb-2">
            <Check>Senior</Check>
          </li>
          <li className="mb-2">
            <Check>Mid</Check>
          </li>
          <li className="mb-2">
            <Check>Junior</Check>
          </li>
        </ul>
      </div> */}
      <div className="widgets mb-11">
        <h4 className="font-size-6 font-weight-semibold mb-6">Posted Time</h4>
        <ul className="list-unstyled filter-check-list">
          {["Anytime", "Last day", "Last 3 days", "Last week"].map((time) => (
            <li className="mb-2" key={time}>
              <Check
                isActive={postedTime === time}
                onClick={() => handlePostedTimeChange(time)}
              >
                {time}
              </Check>
            </li>
          ))}
        </ul>
      </div>
      {/* <!-- Sidebar End --> */}
    </>
  );
};

export default Sidebar;
