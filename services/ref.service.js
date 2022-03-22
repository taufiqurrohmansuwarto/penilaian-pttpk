import axios from "axios";
const fetcher = axios.create({
    baseURL: "/pttpk-penilaian/api"
});

export const getRefSatuanKinerja = (query = "satuan") => {
    return fetcher.get(`/ref?show=${query}`).then((res) => res?.data);
};
