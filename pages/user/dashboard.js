import { Avatar, Card, Skeleton } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import PageContainer from "../../src/components/PageContainer";
import UserLayout from "../../src/components/UserLayout";

const Dashboard = () => {
    const { data, status } = useSession();

    return (
        <UserLayout title="Dashboard Penilaian">
            <PageContainer title="Dashboard Penilaian" subTitle="PTTPK">
                <Card>
                    <Skeleton loading={status === "loading"}>
                        <Avatar src={data?.user?.image} size="large" />
                        <p>Selamat Datang, {data?.user?.name} </p>
                        <p>{data?.user?.employee_number}</p>
                    </Skeleton>
                </Card>
            </PageContainer>
        </UserLayout>
    );
};

Dashboard.Auth = {
    roles: ["USER"],
    groups: ["PTTPK"]
};

export default Dashboard;
