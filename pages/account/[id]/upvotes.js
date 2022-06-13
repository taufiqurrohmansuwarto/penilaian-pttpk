import AccountDiscussionsLayout from "../../../src/components/AccountDiscussionsLayout";
import Layout from "../../../src/components/Layout";

function Upvotes() {
    return (
        <AccountDiscussionsLayout activeKey="upvotes">
            <div>komentar</div>
        </AccountDiscussionsLayout>
    );
}

Upvotes.Auth = {
    roles: ["USER", "FASILITATOR", "ADMIN"],
    groups: ["MASTER", "PTTPK"]
};

Upvotes.getLayout = function getLayout({ page }) {
    return <Layout>{page}</Layout>;
};

export default Upvotes;
