import Layout from "../../src/components/Layout";
import PageContainer from "../../src/components/PageContainer";

const Index = () => {
    return (
        <PageContainer title="Test" subTitle="Hello world">
            Hello world
        </PageContainer>
    );
};
Index.Auth = {
    roles: ["USER", "FASILITATOR", "ADMIN"],
    groups: ["PTTPK", "MASTER"]
};

Index.getLayout = function getLayout(page) {
    return <Layout splitMenus={true}>{page}</Layout>;
};

export default Index;
