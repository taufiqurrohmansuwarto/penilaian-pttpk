import { Skeleton } from "antd";
import Link from "next/link";
import { useQuery } from "react-query";
import { getGroupsChats } from "../../services/main.services";
import Layout from "../../src/components/Layout";
import PageContainer from "../../src/components/PageContainer";

const Index = () => {
    const { data, isLoading } = useQuery(["groups-chats"], () =>
        getGroupsChats()
    );

    return (
        <PageContainer>
            <Skeleton loading={isLoading}>
                {data?.map((d) => (
                    <Link href={`/online-chat/${d?.id}`}>{d.name}</Link>
                ))}
            </Skeleton>
        </PageContainer>
    );
};

Index.Auth = {
    roles: ["USER", "FASILITATOR", "ADMIN"],
    groups: ["PTTPK", "MASTER"]
};

Index.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

export default Index;
