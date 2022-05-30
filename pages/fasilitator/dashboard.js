import { Card } from "antd";
import { useSession } from "next-auth/react";
import FasilitatorLayout from "../../src/components/FasilitatorLayout";
import PageContainer from "../../src/components/PageContainer";

const Dashboard = () => {
    const { data } = useSession();

    return (
        <PageContainer>
            <Card>Halo, selamat datang {data?.user?.name}</Card>
        </PageContainer>
    );
};

Dashboard.Auth = {
    roles: ["FASILITATOR", "ADMIN"],
    groups: ["PTTPK"]
};

Dashboard.getLayout = function getLayout(page) {
    return <FasilitatorLayout splitMenus={true}>{page}</FasilitatorLayout>;
};

export default Dashboard;
