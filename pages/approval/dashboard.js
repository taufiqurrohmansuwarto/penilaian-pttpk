import { Card } from "antd";
import { useSession } from "next-auth/react";
import ApprovalLayout from "../../src/components/ApprovalLayout";

const Dashboard = () => {
    const { data } = useSession();

    return (
        <ApprovalLayout title="Dashboard Approval Penilaian">
            <Card>
                <p>Halo,{data?.user?.name}</p>
            </Card>
        </ApprovalLayout>
    );
};

Dashboard.Auth = {
    roles: ["USER"],
    groups: ["MASTER"]
};

export default Dashboard;
