import { Button, Card } from "antd";
import { signOut, useSession } from "next-auth/react";
import ApprovalLayout from "../../src/components/ApprovalLayout";
import ApprovalPenilaian from "../../src/components/ApprovalPenilaian";

const Dashboard = () => {
    const { data } = useSession();

    return (
        <ApprovalLayout title="Dashboard Approval Penilaian">
            <Card>
                <p>Halo,{data?.user?.name}</p>
                <Button onClick={signOut}>Hello world</Button>
            </Card>
        </ApprovalLayout>
    );
};

Dashboard.Auth = {
    roles: ["USER"],
    groups: ["MASTER"]
};

export default Dashboard;
