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
                <MComment/>
                </Skeleton>
            </AccountDiscussionsLayout>
        </Layout>
    );
}

Index.Auth = {
    roles: ["USER", "FASILITATOR"],
    groups: ["MASTER", "PTTPK"]
};

export default Index;
