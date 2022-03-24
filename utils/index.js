import axios from "axios";

const dataFetcher = axios.create({
  baseURL: process.env.PROTECTED_URL,
});

export default {
  dataFetcher,
};
