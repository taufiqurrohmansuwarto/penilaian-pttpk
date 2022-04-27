import AccountDiscussionsLayout from "../../../src/components/AccountDiscussionsLayout";
import Layout from "../../../src/components/Layout";

function Upvotes() {
    return (
        <Layout>
            <AccountDiscussionsLayout activeKey="upvotes">
                <div>komentar</div>
            </AccountDiscussionsLayout>
        </Layout>
    );
}

export default Upvotes;
