import { Button } from "antd";
import { useRouter } from "next/router";

const Dashboard = () => {
    const router = useRouter();

    const gotoPenilaian = () => {
        router.push("/user/penilaian");
    };

    const gotoBulanan = () => {
        router.push("/user/penilaian/bulanan");
    };

    return (
        <div>
            Dashboard fasilitator
            <Button onClick={gotoPenilaian}>hello world</Button>
            <Button onClick={gotoBulanan}>Bulanan</Button>
        </div>
    );
};

export default Dashboard;
