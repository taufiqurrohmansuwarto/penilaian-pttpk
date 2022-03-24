import prisma from "../lib/prisma";
const arrayToTree = require("array-to-tree");

const index = async (req, res) => {
    const { customId } = req?.user;
    const cursor = req?.query?.cursor;

    const take = 10;
    let query = {
        take,
        include: {
            children: {
                orderBy: {
                    created_at: "asc"
                }
            }
        },
        orderBy: [
            {
                created_at: "desc"
            },
            {
                children: {
                    _count: "desc"
                }
            }
        ]
    };

    // pretty wrong btw
    if (cursor && cursor !== 0 && cursor !== "0") {
        query = {
            ...query,
            take,
            skip: 1,
            cursor: {
                id: cursor
            }
        };
    }

    try {
        // todo paging or infinte scroll
        const result = await prisma.comments.findMany({
            ...query,
            where: {
                parent_id: null
            }
        });

        const newResult = arrayToTree(result, {
            customID: "id",
            parentProperty: "parent_id"
        });

        const nextCursor = result[result?.length - 1]?.id || null;

        res.json({ data: result, nextCursor });
    } catch (error) {
        console.log(error);
        res.json({ code: 400, message: "Internal Server Error" });
    }
};

const get = async (req, res) => {};

const create = async (req, res) => {
    const { body } = req;
    const { customId, name: nama, userType, image } = req.user;

    try {
        const data = {
            nama,
            user_custom_id: customId,
            comment: body?.comment,
            parent_id: body?.parent_id,
            avatar: image,
            user_type: userType
        };
        console.log(data);
        const result = await prisma.comments.create({
            data
        });
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({ code: 400, message: "Internal Server Error" });
    }
};

const update = async (req, res) => {};
const remove = async (req, res) => {};

export default {
    index,
    get,
    create,
    update,
    remove
};
