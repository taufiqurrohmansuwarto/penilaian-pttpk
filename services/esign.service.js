import axios from "axios";
import qs from "query-string";

export const fetcher = axios.create({
    baseURL: "/pttpk-penilaian/api/esign"
});

export const download = () => {
    return fetcher.get("/documents/12323/download").then((res) => res?.data);
};

export const getStamps = () => {
    return fetcher.get("/stamps").then((res) => res.data?.data);
};

export const getDocumentFile = (documentId, type = "initial") => {
    return fetcher
        .get(`/documents/${documentId}?type=${type}`)
        .then((res) => res?.data);
};

// to motherfucker search
export const findEmployee = (employeeNumber) => {
    return fetcher.get(`/employees/${employeeNumber}`).then((res) => res.data);
};

export const getDocuments = (
    query = { type: "all", page: 0, pageSize: 10 }
) => {
    const currentQuery = {
        type: query?.type,
        page: query?.page - 1,
        pageSize: query?.pageSize,
        title: query?.title
    };

    const url = qs.stringify(currentQuery);
    return fetcher.get(`/documents?${url}`).then((res) => res.data);
};

export const getRecipients = (documentId) => {
    return fetcher
        .get(`/documents/${documentId}/recipients`)
        .then((res) => res?.data);
};

export const fetchDiscussions = (documentId) => {
    return fetcher.get(`/documents/${documentId}/discussions`);
};

export const createDiscussions = (documentId, data) => {
    return fetcher
        .post(`/documents/${documentId}/discussions`, data)
        .then((res) => res?.data);
};

export const fetchHistories = (query) => {
    const { documentId, ...currentQuery } = query;

    const url = qs.stringify(currentQuery);
    return fetcher
        .get(`/documents/${documentId}/histories?${url}`)
        .then((res) => res?.data);
};

export const detailDocument = (documentId) => {
    return fetcher
        .get(`/documents/${documentId}/details`)
        .then((res) => res?.data);
};

export const createRecipients = ({ documentId, data }) => {
    return fetcher
        .post(`/documents/${documentId}/recipients`, data)
        .then((res) => res.data);
};

export const getDashboard = () => {
    return fetcher.get("/dashboard").then((res) => res.data);
};

export const upload = (data) => {
    return fetcher.post("/uploads", data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};

export const checkDocument = (documentId) => {
    return fetcher.get(`/documents/${documentId}/check`);
};

export const requestOtp = (documentId) => {
    return fetcher.post(`/documents/${documentId}/otp`);
};

export const approveSign = (data) => {
    const { documentId, ...result } = data;
    return fetcher.put(`/documents/${documentId}/sign`, result);
};

export const status = () => {
    return fetcher.get(`/status`);
};
