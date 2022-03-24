export default ({ role, group }) => {
    return async (req, res, next) => {
        const { role, group } = req.user;
        if (role === role && group === group) {
            next();
        } else {
            res.json({ code: 403, message: "Forbidden" });
        }
    };
};
