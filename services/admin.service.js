import axios from "axios";

const fetcher = axios.create({
    baseURL: "/pttpk-penilaian/api/admin"
});

export const getPooling = () => {
    return fetcher.get(`/poolings`).then((res) => res?.data);
};

export const detailPooling = (id) => {
    return fetcher.get(`/poolings/${id}`).then((res) => res?.data);
};

export const createPooling = (data) => {
    return fetcher.post(`/poolings`, data).then((res) => res?.data);
};

export const removePolling = (id) => {
    return fetcher.delete(`/poolings/${id}`).then((res) => res?.data);
};

// create pengumuman

export const createAnnouncement = (data) => {
    return fetcher.post("/announcements", data).then((res) => res?.data);
};

export const updateAnnouncement = ({ id, data }) => {
    return fetcher.patch(`/announcements/${id}`, data).then((res) => res?.data);
};

export const getAnnouncements = () => {
    return fetcher.get(`/announcements`).then((res) => res?.data);
};
