const penilaianAkhirFasilitator = async (req, res) => {
    try {
        const { pttId } = req?.query;
        // todo akan diisi penilaian akhir berdasarkan ptt Id, kalem saja ya
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    penilaianAkhirFasilitator
};
