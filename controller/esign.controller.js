import FormData from "form-data";
import qs from "query-string";

// all this fucking shit coming from protected resource url esign
const checkDocument = (fetcher) => (fetcher, documentId) => {
    return fetcher.get(`/documents/${documentId}/check`);
};

const listDocumentsApi = ({ fetcher, query }) => {
    const url = qs.stringify(query);
    return fetcher.get(`/esign/documents?${url}`);
};

// create stamps for each individual employees
const stamps = (fetcher) => fetcher.get("/esign/stamps");

const otp = (fetcher, documentId) =>
    fetcher.post(`/esign/documents/${documentId}/otp`);

const findEmployeeApi = (fetcher, nip) => fetcher.get(`/esign/stamps/${nip}`);

const approveSignApi = (fetcher, documentId, data) =>
    fetcher.put(`/esign/documents/${documentId}/sign-request`, data);

export const approveSign = async (req, res) => {
    try {
        const { documentId } = req.query;
        const data = req.body;
        await approveSignApi(req.fetcher, documentId, data);
        res.json({ code: "sukses" });
    } catch (error) {
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

export const findEmployee = async (req, res) => {
    try {
        const { employeeNumber } = req.query;
        const { fetcher } = req;

        const result = await findEmployeeApi(fetcher, employeeNumber);
        res.json(result.data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

export const getStamps = async (req, res) => {
    try {
        const result = await stamps(req.fetcher);
        res.json(result?.data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

export const approve = async (req, res) => {
    try {
        const { documentId } = req.query;
        const data = req.body;
        await approveDocument(req?.fetcher, documentId, data);
        res.json({ code: 200 });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

export const listDocuments = async (req, res) => {
    try {
        const result = await listDocumentsApi(req);
        res.json(result?.data);
    } catch (error) {
        console.log(error);
    }
};

// recipients
export const getListRecipients = async (req, res) => {
    try {
        const { documentId } = req.query;
        const result = await recipients(req.fetcher, documentId);
        res.json(result?.data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

// discussions
export const discussionsIndex = async (req, res) => {
    try {
        const { documentId } = req.query;
        const result = await fetchDiscussions(req.fetcher, documentId);
        res.json(result?.data);
    } catch (error) {
        res.status(error?.data?.statusCode).json({
            code: 400,
            message: "Internal Server Error"
        });
    }
};

export const discussionsCreate = async (req, res) => {
    try {
        const { documentId } = req.query;
        const { body } = req;
        await createDiscussion(req.fetcher, documentId, body);
        res.status(200).json({ code: 201, message: "successfully created" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

export const historiesIndex = async (req, res) => {
    try {
        const { query } = req;
        const result = await fetchHistories(req.fetcher, query);
        res.json(result?.data);
    } catch (error) {
        console.log(error);
        res.json({ code: 400, message: "Internal Server Error" });
    }
};

export const documentDetail = async (req, res) => {
    try {
        const { documentId } = req.query;
        const result = await detailDocument(req.fetcher, documentId);
        res.json(result?.data);
    } catch (error) {
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

export const createRecipients = async (req, res) => {
    try {
        const { documentId } = req.query;
        const data = req.body;
        const result = await recipientsCreate(req.fetcher, documentId, data);
        res.json(result?.data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Errror" });
    }
};

export const currentDashboard = async (req, res) => {
    try {
        const { fetcher } = req;
        const result = await fetcher.get("/esign/dashboard");
        res.json(result?.data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

export const uploadDocument = async (req, res) => {
    try {
        // console.log(req.file);
        const { workflow, title } = req.body;
        const file = req.file;
        const formData = new FormData();
        formData.append("workflow", workflow);
        formData.append("title", title);
        formData.append("document", file?.buffer, `${title}?.pdf`);
        const result = await uploadBackend(req.fetcher, formData);
        res.json(result?.data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

export const publicDocumentChecker = async (req, res) => {
    try {
        const { documentId } = req.query;
        const result = await checkDocument(req.fetcher, documentId);
        res.json(result?.data);
    } catch (error) {
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

export const requestOtp = async (req, res) => {
    try {
        const { documentId } = req.query;
        const result = await otp(req.fetcher, documentId);
        res.json(result?.data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

export const fetchSingleDocuments = async (req, res) => {
    try {
        const result = await fetchSingleDocument(req.fetcher, req.query);
        res.json(result?.data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};
