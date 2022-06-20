import { Skeleton } from "antd";
import { useSession } from "next-auth/react";
import AccountDiscussionsLayout from "../../../src/components/AccountDiscussionsLayout";
import Layout from "../../../src/components/Layout";
import MComment from "../../../src/components/semantic/MComment";

function Index() {
    const { data, status } = useSession();
    return (
        <Layout>
            <AccountDiscussionsLayout activeKey="details">
                <Skeleton loading={status === "loading"}>
                    <MComment />
                </Skeleton>
            </AccountDiscussionsLayout>
        </Layout>
    );
}

Index.Auth = {
    roles: ["USER", "FASILITATOR", "ADMIN"],
    groups: ["MASTER", "PTTPK"]
};

Index.getLayout = function getLayout({ page }) {
    return <Layout>{page}</Layout>;
};

export default Index;
