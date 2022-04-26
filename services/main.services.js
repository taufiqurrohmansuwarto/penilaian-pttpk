import axios from "axios";

const fetcher = axios.create({
    baseURL: "/ptt-penilaian/api"
});

// create social media
export const createComments = (data) => {
    return fetcher.post("/comments", data).then((res) => res?.data);
};

export const removeComment = (id) => {
    return fetcher.delete(`/comments/${id}`).then((res) => res?.data);
};

export const updateComment = ({ id, comment }) => {
    return fetcher
        .patch(`/comments/${id}`, { comment })
        .then((res) => res?.data);
};

export const detailComment = (id) => {
    console.log(id);
    return fetcher.get(`/comments/${id}`).then((res) => res?.data);
};

export const getComments = ({ cursor = 0, sort = "terbaru" }) => {
    return fetcher
        .get(`/comments?cursor=${cursor}&sort=${sort}`)
        .then((res) => res?.data);
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
export const getPosts = (sort = "terbaru", cursor = 0) => {
    return fetcher
        .get(`/discussions/posts?sort=${sort}&cursor=${cursor}`)
        .then((res) => res?.data);
};

export const getPostById = (id) => {
    return fetcher.get(`/discussions/posts/${id}`).then((res) => res?.data);
};

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

export const getPostsByCommunities = (title, sort = "terbaru", cursor = 0) => {
    return fetcher
        .get(
            `/discussions/communities/${title}/posts?sort=${sort}&cursor=${cursor}`
        )
        .then((res) => res?.data);
};

export const createPostByCommunities = ({ title, data }) => {
    return fetcher
        .post(`/discussions/communities/${title}/posts`, data)
        .then((res) => res?.data);
};

export const getCommentsByPost = (id) => {
    return fetcher
        .get(`/discussions/posts/${id}/comments`)
        .then((res) => res?.data);
};

export const createCommentByPost = ({ id, data }) => {
    return fetcher
        .post(`/discussions/posts/${id}/comments`, data)
        .then((res) => res?.data);
};

export const getListSubscribers = () => {
    return fetcher.get(`/discussions/user-subscribe`).then((res) => res?.data);
};

// subscribe
export const subscribePost = (id) => {
    return fetcher
        .put(`/discussions/posts/${id}/request-vote`)
        .then((res) => res?.data);
};

export const unsubscribePost = (id) => {
    return fetcher
        .delete(`/discussions/posts/${id}/request-vote`)
        .then((res) => res?.data);
};

export const getSubscribe = (id) => {
    return fetcher
        .get(`/discussions/posts/${id}/request-vote`)
        .then((res) => res?.data);
};

// upvote
export const upvotePost = ({ id, vlag }) => {
    return fetcher
        .put(`/discussions/posts/${id}/action-vote`, { vlag })
        .then((res) => res?.data);
};

// downvote
export const downvotePost = ({ id, vlag }) =>
    fetcher
        .delete(`/discussions/posts/${id}/action-vote`, { vlag })
        .then((res) => res?.data);

export const getNotifications = () => {
    return fetcher.get(`/notifications-comments`).then((res) => res?.data);
};

export const readAllNotifications = () => {
    return fetcher.put(`/notifications-comments`).then((res) => res?.data);
};

export const readNotificationById = (id) => {
    return fetcher
        .patch(`/notifications-comments/${id}`)
        .then((res) => res?.data);
};

export const dashboardDiscussions = (type) => {
    return fetcher
        .get(`/discussions/dashboard?type=${type}`)
        .then((res) => res?.data);
};

export const deletePost = (id) => {
    return fetcher.delete(`/discussions/posts/${id}`).then((res) => res?.data);
};

export const updatePost = ({ id, data }) => {
    return fetcher
        .patch(`/discussions/posts/${id}`, data)
        .then((res) => res?.data);
};

export const findUsers = (username) => {
    return fetcher
        .get(`/refs/users?username=${username}`)
        .then((res) => res?.data);
};
