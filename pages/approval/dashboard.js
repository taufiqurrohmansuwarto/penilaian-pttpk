import { Alert, Card, Col, Divider, Row } from "antd";
import { useSession } from "next-auth/react";
import ApprovalLayout from "../../src/components/ApprovalLayout";
import PageContainer from "../../src/components/PageContainer";

const Dashboard = () => {
    const { data } = useSession();

    return (
        <ApprovalLayout title="Dashboard Approval Penilaian">
            <PageContainer title="Dashboard" subTitle="Penilaian PTTPK">
                <Card>
                    <Alert
                        type="warning"
                        message="Perlu diingat"
                        showIcon
                        description="Daftar pegawai yang dinilai (PTTPK) akan muncul ketika PTTPK yang bersangkutan memilih anda sebagai atasan langsung."
                    />
                    <Divider />
                    <p>Halo, {data?.user?.name}</p>
                </Card>
            </PageContainer>
        </ApprovalLayout>
    );
};

Dashboard.Auth = {
    roles: ["USER"],
    groups: ["MASTER"]
};

export default Dashboard;
