import EsignLayout from "../../../src/components/Layout/EsignLayout";

const Sertifikat = () => {
    return <div>sertifikat</div>;
};

Sertifikat.getLayout = function getLayout(page) {
    return <EsignLayout>{page}</EsignLayout>;
};

Sertifikat.Auth = {
    roles: ["USER"],
    groups: ["MASTER"]
};

export default Sertifikat;
