const { default: prisma } = require("../lib/prisma");

const index = async (req, res) => {
    try {
        const result = await prisma.poolings.findMany({
            where: {
                user_custom_id: req?.user?.customId
            },
            include: {
                poolings_answers: true,
                poolings_answers: {
                    orderBy: {
                        id: "asc"
                    },
                    include: {
                        _count: {
                            select: {
                                pollings_user_answer: true
                            }
                        }
                    }
                }
            }
        });

        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const get = async (req, res) => {
    const { customId } = req?.user;
    const { poolingId } = req?.query;

    try {
        const result = await prisma.poolings.findFirst({
            where: {
                user_custom_id: customId,
                id: poolingId
            }
        });
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const create = async (req, res) => {
    const { body } = req;
    const data = { ...body, user_custom_id: req?.user?.customId };

    try {
        await prisma.poolings.create({
            data: {
                title: data?.title,
                user_custom_id: req?.user?.customId,
                due_date: data?.due_date,
                poolings_answers: {
                    createMany: {
                        data: data?.poolings_answers
                    }
                }
            }
        });

        res.json({ code: 200, message: "sukses" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const update = async (req, res) => {
    try {
    } catch (error) {}
};

const remove = async (req, res) => {
    const { poolingId } = req?.query;
    try {
        await prisma.poolings.delete({
            where: {
                id: poolingId
            }
        });
        res.json({ code: 200, message: "sukses" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const answer = async (req, res) => {
    const { poolingId, answerId } = req?.query;
    const { customId } = req?.user;
    try {
        await prisma.pollings_user_answer.upsert({
            where: {
                pooling_id_user_custom_id: {
                    pooling_id: poolingId,
                    user_custom_id: customId
                }
            },
            create: {
                pooling_answer_id: answerId,
                pooling_id: poolingId,
                user_custom_id: customId
            },
            update: {
                pooling_answer_id: answerId
            }
        });

        res.json({ code: 200, message: "success" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const getQuestion = async (req, res) => {
    try {
        const result = await prisma.poolings.findMany({
            where: {
                due_date: {
                    gte: new Date()
                }
            },
            include: {
                pollings_user_answer: {
                    where: {
                        user_custom_id: req?.user?.customId
                    }
                },
                poolings_answers: {
                    orderBy: {
                        id: "asc"
                    },
                    include: {
                        _count: {
                            select: {
                                pollings_user_answer: true
                            }
                        }
                    }
                }
            }
        });
        res.json(result);
    } catch (error) {
        console.log(erorr);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

module.exports = {
    index,
    get,
    create,
    update,
    remove,
    answer,
    getQuestion
};
