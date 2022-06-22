import axios from "axios";
import qs from "query-string";

const fetcher = axios.create({
    baseURL: "/pttpk-penilaian/api/esign"
});

const download = () => {
    return fetcher.get("/documents/12323/download").then((res) => res?.data);
};

const getStamps = () => {
    return fetcher.get("/esign/api/stamps").then((res) => res.data?.data);
};

const getDocumentFile = (documentId, type = "initial") => {
    return fetcher
        .get(`/documents/${documentId}?type=${type}`)
        .then((res) => res?.data);
};

// to motherfucker search
const findEmployee = (employeeNumber) => {
    return fetcher.get(`/employees/${employeeNumber}`).then((res) => res.data);
};

const getDocuments = (query = { type: "all", page: 0, pageSize: 10 }) => {
    const currentQuery = {
        type: query?.type,
        page: query?.page - 1,
        pageSize: query?.pageSize,
        title: query?.title
    };

    const url = qs.stringify(currentQuery);
    console.log(url);
    return fetcher.get(`/documents?${url}`).then((res) => res.data);
};

const getRecipients = (documentId) => {
    return fetcher
        .get(`/documents/${documentId}/recipients`)
        .then((res) => res?.data);
};

const fetchDiscussions = (documentId) => {
    return fetcher.get(`/documents/${documentId}/discussions`);
};

const createDiscussions = (documentId, data) => {
    return fetcher
        .post(`/documents/${documentId}/discussions`, data)
        .then((res) => res?.data);
};

const fetchHistories = (query) => {
    const { documentId, ...currentQuery } = query;

    const url = qs.stringify(currentQuery);
    return fetcher
        .get(`/documents/${documentId}/histories?${url}`)
        .then((res) => res?.data);
};

const detailDocument = (documentId) => {
    return fetcher
        .get(`/documents/${documentId}/details`)
        .then((res) => res?.data);
};

const createRecipients = ({ documentId, data }) => {
    return fetcher
        .post(`/documents/${documentId}/recipients`, data)
        .then((res) => res.data);
};

const getDashboard = () => {
    return fetcher.get("/dashboard").then((res) => res.data);
};

const upload = (data) => {
    return fetcher.post("/uploads", data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};

const checkDocument = (documentId) => {
    return fetcher.get(`/documents/${documentId}/check`);
};

const requestOtp = (documentId) => {
    return fetcher.post(`/documents/${documentId}/otp`);
};

const approveSign = (data) => {
    const { documentId, ...result } = data;
    return fetcher.put(`/documents/${documentId}/sign`, result);
};

export default {
    download,
    getStamps,
    getDocumentFile,
    findEmployee,
    getDocuments,
    getRecipients,
    createRecipients,
    getDashboard,
    fetchDiscussions,
    createDiscussions,
    fetchHistories,
    detailDocument,
    upload,
    checkDocument,
    requestOtp,
    approveSign
};
