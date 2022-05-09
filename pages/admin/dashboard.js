import AdminLayout from "../../src/components/AdminLayout";
import PageContainer from "../../src/components/PageContainer";

function Dashboard() {
    return (
        <PageContainer>
            <div>hello world</div>
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
