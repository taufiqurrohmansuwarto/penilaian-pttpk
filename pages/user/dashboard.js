import { Button } from "antd";
import { useRouter } from "next/router";
import UserComments from "../../src/components/UsersComments";

const Dashboard = () => {
    const router = useRouter();

    const gotoPenilaian = () => {
        router.push("/user/penilaian");
    };

    const gotoBulanan = () => {
        router.push("/user/penilaian/bulanan");
    };

    return (
        <div style={{ padding: 100 }}>
            Dashboard fasilitator
            <Button onClick={gotoPenilaian}>hello world</Button>
            <Button onClick={gotoBulanan}>Bulanan</Button>
            <UserComments />
        </div>
    );
};

Dashboard.Auth = {
    roles: ["USER"],
    groups: ["PTTPK"]
};

export default Dashboard;
