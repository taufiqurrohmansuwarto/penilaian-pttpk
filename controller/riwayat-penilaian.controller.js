const listPenilaianTahunan = async (req, res) => {
    try {
        const { fetcher } = req;
        const { userId } = req?.user;

        const result = await fetcher.get(`/pttpk/penilaian-tahunan`);

        res.json(result?.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ code: 500, message: "Internal Server Error" });
    }
};

module.exports = {
    listPenilaianTahunan
};
