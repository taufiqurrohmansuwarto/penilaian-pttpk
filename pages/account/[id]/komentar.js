import AccountDiscussionsLayout from "../../../src/components/AccountDiscussionsLayout";
import Layout from "../../../src/components/Layout";

function Comments() {
    return (
        <AccountDiscussionsLayout activeKey="komentar">
            <div>komentar</div>
        </AccountDiscussionsLayout>
    );
}

Comments.Auth = {
    roles: ["USER", "FASILITATOR", "ADMIN"],
    groups: ["MASTER", "PTTPK"]
};

Comments.getLayout = function getLayout({ page }) {
    return <Layout>{page}</Layout>;
};

export default Comments;
