import axios from "axios";

const fetcher = axios.create({
    baseURL: "/pttpk-penilaian/api"
});

export const createComments = (data) => {
    return fetcher.post("/comments", data).then((res) => res?.data);
};

export const getComments = ({ cursor = 0 }) => {
    return fetcher.get(`/comments?cursor=${cursor}`).then((res) => res?.data);
};
