import AccountDiscussionsLayout from "../../../src/components/AccountDiscussionsLayout";
import Layout from "../../../src/components/Layout";

function Comments() {
    return (
        <Layout>
            <AccountDiscussionsLayout activeKey="komentar">
                <div>komentar</div>
            </AccountDiscussionsLayout>
        </Layout>
    );
}

export default Comments;
