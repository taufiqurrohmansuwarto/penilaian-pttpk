const { default: prisma } = require("../lib/prisma");

module.exports.createActivity = async (type, id, senderId, receiverId) => {
    try {
        if (type === "postinganBaru") {
            await prisma.user_activities.create({
                data: {
                    comment_id: id,
                    sender_custom_id: senderId,
                    type
                }
            });
        }

        if (type === "balasanPostingan") {
            await prisma.user_activities.create({
                data: {
                    type,
                    comment_id: id,
                    sender_custom_id: senderId,
                    receiver_custom_id: receiverId
                }
            });
        }

        if (type === "komentarDiskusiBaru") {
            await prisma.user_activities.create({
                data: {
                    type,
                    discussion_post_id: id,
                    sender_custom_id: senderId
                }
            });
        }

        if (type === "balasanKomentarDiskusi") {
            await prisma.user_activities.create({
                data: {
                    type,
                    discussion_post_id: id,
                    sender_custom_id: senderId,
                    receiver_custom_id: receiverId
                }
            });
        }
    } catch (error) {
        console.log(error);
    }
};
