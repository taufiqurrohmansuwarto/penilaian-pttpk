import { Card } from "antd";
import { useSession } from "next-auth/react";
import AdminLayout from "../../src/components/AdminLayout";
import PageContainer from "../../src/components/PageContainer";

function Dashboard() {
    const { data } = useSession();
    return (
        <PageContainer title="Admin Dashboard" style={{ minHeight: "95vh" }}>
            <Card>{data?.user?.name}</Card>
        </PageContainer>
    );
}

Dashboard.Auth = {
    isAdmin: true
};

Dashboard.getLayout = function getLayout(page) {
    return <AdminLayout>{page}</AdminLayout>;
};

export default Dashboard;
