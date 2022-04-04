import { Button, Card, Divider, Space } from "antd";
import { useRouter } from "next/router";
import RichTextEditor from "../../src/components/RichTextEditor";
import UserLayout from "../../src/components/UserLayout";
import UserComments from "../../src/components/UsersComments";
import { useState } from "react";
import { useSession } from "next-auth/react";

const Dashboard = () => {
    const router = useRouter();
    const { data, status } = useSession();

    const gotoPenilaian = () => {
        router.push("/user/penilaian");
    };

    const gotoBulanan = () => {
        router.push("/user/penilaian/bulanan");
    };

    const [message, setMessage] = useState(null);

    const handleShowMessage = () => {
        console.log(message);
    };

    return (
        <UserLayout title="Dashboard Penilaian">
            <Card loading={!data}>
                <p>Selamat Datang, {data?.user?.name}</p>
                <div>{JSON.stringify(data)}</div>
                <Space>
                    <Button onClick={gotoPenilaian}>Buat Penilaian</Button>
                    <Button onClick={gotoBulanan}>Bulanan</Button>
                </Space>
            </Card>
        </UserLayout>
    );
};

Dashboard.Auth = {
    roles: ["USER"],
    groups: ["PTTPK"]
};

export default Dashboard;
