import EsignFasilitatorLayout from "../../../src/components/Layout/EsignFasilitatorLayout";
import PageContainer from "../../../src/components/PageContainer";

const DashboardEsign = () => {
    return (
        <PageContainer>
            <div>ini adalah dashboard</div>
        </PageContainer>
    );
};

DashboardEsign.Auth = {
    roles: ["FASILITATOR", "ADMIN"],
    groups: ["MASTER"]
};

DashboardEsign.getLayout = function getLayout(page) {
    return <EsignFasilitatorLayout>{page}</EsignFasilitatorLayout>;
};

export default DashboardEsign;
