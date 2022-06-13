import AccountDiscussionsLayout from "../../../src/components/AccountDiscussionsLayout";
import Layout from "../../../src/components/Layout";

function Disimpan() {
    return (
        <AccountDiscussionsLayout activeKey="disimpan">
            <div>komentar</div>
        </AccountDiscussionsLayout>
    );
}

Disimpan.Auth = {
    roles: ["USER", "FASILITATOR", "ADMIN"],
    groups: ["MASTER", "PTTPK"]
};

Disimpan.getLayout = function getLayout({ page }) {
    return <Layout>{page}</Layout>;
};

export default Disimpan;
