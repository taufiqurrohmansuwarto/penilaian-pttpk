import { Button, Card } from "antd";
import { signOut } from "next-auth/react";
import ApprovalLayout from "../../src/components/ApprovalLayout";
import ApprovalPenilaian from "../../src/components/ApprovalPenilaian";

const Dashboard = () => {
    return (
        <ApprovalLayout title="Dashboard Layout">
            <Card>
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
