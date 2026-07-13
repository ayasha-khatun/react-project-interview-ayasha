import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://itder.com/api",
});

const useAxiosPublic = () => {
  return axiosInstance;
};

export default useAxiosPublic;
