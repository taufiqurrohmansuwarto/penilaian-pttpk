import Layout from "../../src/components/Layout";
import PageContainer from "../../src/components/PageContainer";

const Index = () => {
    return (
        <PageContainer>
            <div>Hello world</div>
        </PageContainer>
    );
};

Index.Auth = {
    roles: ["USER", "FASILITATOR", "ADMIN"],
    groups: ["PTTPK", "MASTER"]
};

Index.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

export default Index;
