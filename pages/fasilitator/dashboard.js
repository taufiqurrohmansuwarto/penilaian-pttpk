import { Card } from "antd";
import { useSession } from "next-auth/react";
import FasilitatorLayout from "../../src/components/FasilitatorLayout";

const Dashboard = () => {
    const { data } = useSession();
    return (
        <FasilitatorLayout title="Dashboard">
            <Card>{JSON.stringify(data)}</Card>
        </FasilitatorLayout>
    );
};

export default Dashboard;
