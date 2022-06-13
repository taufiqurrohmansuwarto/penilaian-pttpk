import AccountDiscussionsLayout from "../../../src/components/AccountDiscussionsLayout";
import Layout from "../../../src/components/Layout";

function Downvotes() {
    return (
        <AccountDiscussionsLayout activeKey="downvotes">
            <div>hello</div>
        </AccountDiscussionsLayout>
    );
}

Downvotes.Auth = {
    roles: ["USER", "FASILITATOR", "ADMIN"],
    groups: ["MASTER", "PTTPK"]
};

Downvotes.getLayout = function getLayout({ page }) {
    return <Layout>{page}</Layout>;
};

export default Downvotes;
