import moment from "moment";
// this from microservcies
const serializeJabatan = (jabatan) => {
    if (!jabatan?.length) {
        return [];
    } else {
        return jabatan
            ?.filter((x) => !!x?.id_jabatan)
            .map((j) => ({
                id: j?.id_ptt_jab,
                nama: j?.jabatan?.name || "",
                aktif: j?.aktif,
                tgl_aktif: `${moment(j?.tgl_mulai).format(
                    "DD-MM-YYYY"
                )} s.d ${moment(j?.tgl_akhir).format("DD-MM-YYYY")}`
            }));
    }
};

const getJabatan = async (req, res) => {
    const { fetcher } = req;
    try {
        const result = await fetcher.get("/pttpk/jabatan");
        res.json(serializeJabatan(result?.data?.data));
    } catch (error) {
        console.log(error);
    }
};

const getUnor = async (req, res) => {
    const { fetcher } = req;
    try {
        const result = await fetcher.get("/pttpk/unor");
        res.json(result?.data?.perangkatDaerah);
    } catch (error) {
        console.log(error);
        res.json({ code: 400, message: "Internal Server Error" });
    }
};

const getEmployee = async (req, res) => {
    const { nip } = req.query;
    const { fetcher } = req;

    try {
        const result = await fetcher.get(`/master/pegawai/${nip}`);
        res.json(result?.data);
    } catch (error) {
        console.log(error);
        res.json({ code: 400, message: "Internal Server Error" });
    }
};

module.exports = {
    getJabatan,
    getUnor,
    getEmployee
};
