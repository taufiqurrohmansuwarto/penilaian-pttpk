const cetakPenilaianBulananUser = async (req, res) => {
    try {
        res.json({ code: 200, message: "test" });
    } catch (error) {
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

module.exports = {
    cetakPenilaianBulananUser
};
