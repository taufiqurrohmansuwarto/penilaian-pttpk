import axios from "axios";

const fetcher = axios.create({
    baseURL: "/pttpk-penilaian/api"
});

// create social media
export const createComments = (data) => {
    return fetcher.post("/comments", data).then((res) => res?.data);
};

export const getComments = ({ cursor = 0 }) => {
    return fetcher.get(`/comments?cursor=${cursor}`).then((res) => res?.data);
};

export const likes = ({ commentId, value }) =>
    fetcher
        .put(`/comments/${commentId}/votes`, { value })
        .then((res) => res?.data);

export const dislikes = ({ commentId, value }) =>
    fetcher
        .delete(`/comments/${commentId}/votes`, { data: { value } })
        .then((res) => res?.data);

export const uploads = (data) =>
    fetcher
        .post("/uploads", data, {
            headers: {
                "Content-Type": "multipart/formData"
            }
        })
        .then((r) => r?.data);

// feedbacks
export const getFeedbacks = () =>
    fetcher.get("/feedbacks").then((res) => res?.data);

export const createFeedback = (data) =>
    fetcher.post("/feedbacks", data).then((res) => res?.data);

// discussions
export const getCategories = () =>
    fetcher.get("/discussions/categories").then((res) => res?.data);

export const createCategories = (data) =>
    fetcher.post("/discussions/categories", data).then((res) => res?.data);

// topics
export const getTopics = () => {
    return fetcher.get("/discussions/topics").then((res) => res?.data);
};

// posts
export const getPosts = () =>
    fetcher.get("/discussions/posts").then((res) => res?.data);

export const createPost = (data) =>
    fetcher.post("/discussions/posts", data).then((res) => res?.data);

// create communities
export const createCommunities = (data) => {
    return fetcher
        .post("/discussions/communities", data)
        .then((res) => res?.data);
};

export const findCommunities = (title) => {
    return fetcher
        .get(`/discussions/communities/${title}`)
        .then((res) => res?.data);
};

export const findCommunitiesByTitle = (title) => {
    return fetcher
        .get(`/discussions/communities?title=${title}`)
        .then((res) => res?.data);
};

export const getPostsByCommunities = (title) => {
    return fetcher
        .get(`/discussions/communities/${title}/posts`)
        .then((res) => res?.data);
};

export const createPostByCommunities = ({ title, data }) => {
    return fetcher
        .post(`/discussions/communities/${title}/posts`, data)
        .then((res) => res?.data);
};

export const getCommentsByPost = (id) => {
    return fetcher
        .get(`/discussions/post/${id}/commments`)
        .then((res) => res?.data);
};

export const createCommentByPost = ({ id, data }) => {
    return fetcher
        .get(`/discussions/post/${id}/comments`, data)
        .then((res) => res?.data);
};
