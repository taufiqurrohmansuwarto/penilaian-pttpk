import axios from "axios";

const fetcher = axios.create({
    baseURL: "/pttpk-penilaian/api/approval"
});

export const getPenilaian = () => {
    return fetcher.get("/penilaian").then((res) => res?.data);
};
