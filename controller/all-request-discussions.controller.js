const { default: prisma } = require("../lib/prisma");

module.exports = async (req, res) => {
    const { customId } = req?.user;
    const { id } = req?.query;

    try {
        const type = req?.query?.type || "save";

        if (type === "save") {
            // check first if there is some data then it should be delete permanently
            const result = await prisma.discussions_saves.findUnique({
                where: {
                    discussion_post_id_user_custom_id: {
                        discussion_post_id: id,
                        user_custom_id: customId
                    }
                }
            });

            if (!result) {
                await prisma.discussions_saves.create({
                    data: {
                        discussion_post_id: id,
                        user_custom_id: customId
                    }
                });
            } else {
                await prisma.discussions_saves.delete({
                    where: {
                        discussion_post_id_user_custom_id: {
                            discussion_post_id: id,
                            user_custom_id: customId
                        }
                    }
                });
            }
        }

        if (type === "subscribe") {
            // check first if there is some data then it should be deleted
            const result = await prisma.discussions_subscribes.findUnique({
                where: {
                    discussion_post_id_user_custom_id: {
                        discussion_post_id: id,
                        user_custom_id: customId
                    }
                }
            });

            if (!result) {
                await prisma.discussions_subscribes.create({
                    data: {
                        discussion_post_id: id,
                        user_custom_id: customId
                    }
                });
            } else {
                await prisma.discussions_subscribes.delete({
                    where: {
                        discussion_post_id_user_custom_id: {
                            discussion_post_id: id,
                            user_custom_id: customId
                        }
                    }
                });
            }
        }

        res.json({ code: 200, message: "success" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};
