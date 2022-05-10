import { Alert } from "@mantine/core";
import { Card, Divider } from "antd";
import { useSession } from "next-auth/react";
import { ExclamationMark } from "tabler-icons-react";
import ApprovalLayout from "../../src/components/ApprovalLayout";
import PageContainer from "../../src/components/PageContainer";

const Dashboard = () => {
    const { data } = useSession();

    return (
        <PageContainer
            style={{ minHeight: "100vh" }}
            title="Dashboard"
            subTitle="Penilaian PTTPK"
        >
            <Card>
                <Alert
                    color="red"
                    title="Untuk diperhatikan"
                    icon={<ExclamationMark />}
                >
                    Daftar Pegawai PTTPK yang akan dinilai akan secara otomatis
                    masuk di menu bulanan / tahunan anda ketika PTTPK yang
                    bersangkutan memilih anda sebagai penilai
                </Alert>
                <Divider />
                <p>Halo, {data?.user?.name}</p>
            </Card>
        </PageContainer>
    );
};

Dashboard.getLayout = function getLayout(page) {
    return <ApprovalLayout>{page}</ApprovalLayout>;
};

Dashboard.Auth = {
    roles: ["USER"],
    groups: ["MASTER"]
};

export default Dashboard;
