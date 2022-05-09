import axios from "axios";

const fetcher = axios.create({
    baseURL: "/pttpk-penilaian/api/admin"
});

export const getPooling = () => {
    return fetcher.get(`/poolings`).then((res) => res?.data);
};

export const createPooling = (data) => {
    return fetcher.post(`/poolings`, data).then((res) => res?.data);
};
