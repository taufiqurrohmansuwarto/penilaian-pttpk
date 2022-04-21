import { Avatar, Button, Card, Skeleton, Space } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import UserLayout from "../../src/components/UserLayout";

const Dashboard = () => {
    const router = useRouter();
    const { data, status } = useSession();

    const gotoPenilaian = () => {
        router.push("/user/penilaian");
    };

    const gotoBulanan = () => {
        router.push("/user/penilaian/bulanan");
    };

    return (
        <UserLayout title="Dashboard Penilaian">
            <Card>
                <Skeleton loading={status === "loading"}>
                    <Avatar src={data?.user?.image} size="large" />
                    <p>Selamat Datang, {data?.user?.name} </p>
                    <p>{data?.user?.employee_number}</p>
                    <Space>
                        <Button onClick={gotoPenilaian}>Buat Penilaian</Button>
                        <Button onClick={gotoBulanan}>Bulanan</Button>
                    </Space>
                </Skeleton>
            </Card>
        </UserLayout>
    );
};

Dashboard.Auth = {
    roles: ["USER"],
    groups: ["PTTPK"]
};

export default Dashboard;
