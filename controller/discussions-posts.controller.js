const { default: prisma } = require("../lib/prisma");
const index = async (req, res) => {
    const { id } = req.query;

    try {
        const community = await prisma.discussions_posts.findFirst({
            where: {
                title: id
            }
        });

        const result = await prisma.discussions_posts.findMany({
            where: {
                parent_id: community?.id,
                status: "active",
                type: "posts"
            },
            include: {
                _count: {
                    select: {
                        children: true
                    }
                }
            },
            orderBy: {
                created_at: "asc"
            }
        });

        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};
const create = async (req, res) => {
    const { customId } = req.user;
    const { id } = req.query;
    try {
    } catch (error) {}
};

const update = async (req, res) => {};
const remove = async (req, res) => {};

module.exports = {
    index,
    create,
    update,
    remove
};
