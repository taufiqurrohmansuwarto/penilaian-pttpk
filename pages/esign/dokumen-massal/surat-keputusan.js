import EsignLayout from "../../../src/components/Layout/EsignLayout";
import PageContainer from "../../../src/components/PageContainer";

const SuratKeputusan = () => {
    return (
        <PageContainer title="Surat Keputusan">
            <div>Hello world</div>
        </PageContainer>
    );
};

SuratKeputusan.Auth = {
    roles: ["USER"],
    groups: ["MASTER"]
};

SuratKeputusan.getLayout = function getLayout(page) {
    return <EsignLayout>{page}</EsignLayout>;
};

export default SuratKeputusan;
