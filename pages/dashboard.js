import Layout from "../src/components/Layout";

const { default: UserLayout } = require("../src/components/UserLayout");

const Dashboard = () => {
    return <Layout></Layout>;
};

Dashboard.auth = {
    roles: ["USER", "FASILITATOR"],
    groups: ["PTTPK", "MASTER"]
};

export default Dashboard;
