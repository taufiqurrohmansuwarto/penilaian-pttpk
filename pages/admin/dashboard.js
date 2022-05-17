import AdminLayout from "../../src/components/AdminLayout";
import PageContainer from "../../src/components/PageContainer";

function Dashboard() {
    return (
        <PageContainer
            title="Hello mofo"
            style={{ minHeight: "95vh" }}
        ></PageContainer>
    );
}

Dashboard.Auth = {
    isAdmin: true
};

Dashboard.getLayout = function getLayout(page) {
    return <AdminLayout>{page}</AdminLayout>;
};

export default Dashboard;
