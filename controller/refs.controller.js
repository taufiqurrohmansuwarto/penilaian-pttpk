const { default: prisma } = require("../lib/prisma");

const findUsers = async (req, res) => {
    try {
        let query = {};

        if (req?.query?.username) {
            query = {
                ...query,
                select: {
                    custom_id: true,
                    username: true
                },
                take: 20,
                where: {
                    username: {
                        contains: req?.query?.username,
                        mode: "insensitive"
                    }
                }
            };
        } else {
            query = {
                ...query,
                select: {
                    custom_id: true,
                    username: true
                },
                take: 20,
                orderBy: {
                    username: "asc"
                }
            };
        }

        const result = await prisma.users.findMany(query);
        let results = [];
        if (result?.length !== 0) {
            results = result?.map((r) => ({
                id: r?.custom_id,
                value: r?.username
            }));
        }
        res.json(results);
    } catch (error) {
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

module.exports = {
    findUsers
};
