import axios from "axios";

const fetcher = axios.create({
    baseURL: "/pttpk-penilaian/api"
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

export const likes = (commentId) =>
    fetcher.put(`/comments/${commentId}/votes`).then((res) => res?.data);

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
export const getPosts = (sort = "terbaru", cursor = 0, userId = "") => {
    return fetcher
        .get(
            `/discussions/posts?sort=${sort}&cursor=${cursor}&userId=${userId}`
        )
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

export const getCommentsByPost = (id, target) => {
    return fetcher
        .get(`/discussions/posts/${id}/comments?target=${target}`)
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

// discussions-notifications
export const getNotificationDiscussions = () => {
    return fetcher.get(`/notifications-discussions`).then((res) => res?.data);
};

export const readAllNotificationDiscussions = () => {
    return fetcher.put(`/notifications-discussions`).then((res) => res?.data);
};

export const readNotificationDiscussionById = (id) => {
    return fetcher
        .patch(`/notifications-discussions/${id}`)
        .then((res) => res?.data);
};
// end of discussions notif

// subscribes
export const subscribeDiscussion = (id) => {
    return fetcher.put(`/discussions/posts/${id}/request?type=subscribe`);
};

// save
export const saveDiscussion = (id) => {
    return fetcher.put(`/discussions/posts/${id}/request?type=save`);
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

export const removePostByUser = (id) => {
    return fetcher
        .delete(`/discussions/posts/${id}/update-personal`)
        .then((res) => res?.data);
};

export const updatePostByUser = ({ id, data }) => {
    return fetcher
        .patch(`/discussions/posts/${id}/update-personal`, data)
        .then((res) => res?.data);
};

export const getUserPooling = () => {
    return fetcher.get(`/poolings`).then((res) => res?.data);
};

export const answerPooling = ({ poolingId, answerId }) => {
    return fetcher.put(`/poolings/${poolingId}?answerId=${answerId}`);
};

// mail
export const sendingEmail = (data) => {
    return fetcher.post(`/mails`, data).then((res) => res?.data);
};

export const getMail = ({ type = "inbox", limit = 50, offset = 0 }) => {
    return fetcher
        .get(`/mails?type=${type}&limit=${limit}&offset=${offset}`)
        .then((res) => res?.data);
};

export const readMail = (id) => {
    return fetcher.get(`/mails/${id}`).then((res) => res?.data);
};

export const getActivities = (cursor = 0) => {
    return fetcher
        .get(`/user-activities?cursor=${cursor}`)
        .then((res) => res?.data);
};

export const getHJoins = (cursor = 0) => {
    return fetcher.get(`/hjoins?cursor=${cursor}`).then((res) => res?.data);
};

export const createHJoins = (data) => {
    return fetcher.post(`/hjoins`, data, {
        headers: {
            "Content-Type": "multipart/formData"
        }
    });
};

// profile
export const getProfile = (id) => {
    return fetcher.get(`/profile?id=${id}`).then((res) => res?.data);
};

// chats motherfucker
export const createGroupChats = (data) => {
    return fetcher.post(`/groups-chats`, data).then((res) => res?.data);
};

export const getGroupsChats = () => {
    return fetcher.get(`/groups-chats`).then((res) => res?.data);
};

export const removeGroupsChats = (id) => {
    return fetcher.delete(`/groups-chats/${id}`).then((res) => res?.data);
};

export const sendChats = ({ id, data }) => {
    return fetcher
        .post(`/groups-chats/${id}/chats`, data)
        .then((res) => res?.data);
};

export const getChats = (id) => {
    return fetcher.get(`/groups-chats/${id}/chats`).then((res) => res?.data);
};
