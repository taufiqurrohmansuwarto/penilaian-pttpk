import { Button } from "antd";
import { signOut } from "next-auth/react";
import ApprovalPenilaian from "../../src/components/ApprovalPenilaian";

const Dashboard = () => {
    return (
        <div style={{ padding: 20 }}>
            <Button onClick={signOut}>Hello world</Button>
            <ApprovalPenilaian />
        </div>
    );
};

export default Dashboard;
