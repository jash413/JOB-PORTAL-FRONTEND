import { useState } from "react";
import axiosInterceptors from "../libs/integration/axiosInterceptors";
import { REQ } from "../libs/constants";
import { toast } from "react-toastify";

export const useFetchJobPostsRecords = () => {
  const [jobPostsData, setJobPostsData] = useState([]);

  const fetchJobPostsRecords = async () => {
    try {
      const response = await axiosInterceptors.post(
        REQ.GET_JOBPOST_RECORDS,
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
        setJobPostsData(records);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    jobPostsData,
    fetchJobPostsRecords,
  };
};
