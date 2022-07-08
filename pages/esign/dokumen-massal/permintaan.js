import EsignLayout from "../../../src/components/Layout/EsignLayout";
import PageContainer from "../../../src/components/PageContainer";

const PermintaanDokumenMassal = () => {
    return (
        <PageContainer title="Permintaan" subTitle="Dokumen Massal">
            Permintaan dokumen massal
        </PageContainer>
    );
};

PermintaanDokumenMassal.Auth = {
    roles: ["USER"],
    groups: ["MASTER"]
};

PermintaanDokumenMassal.getLayout = function getLayout(page) {
    return <EsignLayout>{page}</EsignLayout>;
};

export default PermintaanDokumenMassal;
