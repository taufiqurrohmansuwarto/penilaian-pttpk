const { default: prisma } = require("../lib/prisma");

const index = async (req, res) => {
    const { id } = req.query;
    const { customId } = req.user;
    try {
        const result = await prisma;
    } catch (error) {}
};

const create = async (req, res) => {
    try {
    } catch (error) {}
};

const update = async (req, res) => {
    try {
    } catch (error) {}
};

const detail = async (req, res) => {
    try {
    } catch (error) {}
};

const remove = async (req, res) => {
    try {
    } catch (error) {}
};

module.exports = {
    index,
    create,
    update,
    detail,
    remove
};
