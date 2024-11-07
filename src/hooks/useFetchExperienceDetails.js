import { useState } from "react";
import axiosInterceptors from "../libs/integration/axiosInterceptors";
import { REQ } from "../libs/constants";
import { toast } from "react-toastify";

export const useFetchExperienceDetails = () => {
  const [experienceData, setExperienceData] = useState([]);

  const fetchExperienceDetails = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("Please log in again.");
      return;
    }

    try {
      const response = await axiosInterceptors.post(
        REQ.CANDIDATE_EXP_LIST,
        {
          page: 1,
          limit: 50,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const { records } = response;
      if (records.length > 0) {
        setExperienceData(records);
      } else {
        toast.info("No experience records found.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching experience details:");
    }
  };

  return {
    experienceData,
    fetchExperienceDetails,
  };
};
