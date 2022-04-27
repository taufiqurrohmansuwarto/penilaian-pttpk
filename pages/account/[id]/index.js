import { Skeleton } from "antd";
import { useSession } from "next-auth/react";
import AccountDiscussionsLayout from "../../../src/components/AccountDiscussionsLayout";
import Layout from "../../../src/components/Layout";

function Index() {
    const { data, status } = useSession();
    return (
        <Layout>
            <AccountDiscussionsLayout activeKey="details">
                <Skeleton loading={status === "loading"}>
                    <div>{JSON.stringify(data)}</div>
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
