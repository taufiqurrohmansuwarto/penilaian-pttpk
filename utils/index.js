import axios from "axios";

const dataFetcher = axios.create({
    baseURL: process.env.PROTECTED_URL
});

const getUserId = (req) => req?.user?.userId;

module.exports = {
    getUserId,
    dataFetcher
};
