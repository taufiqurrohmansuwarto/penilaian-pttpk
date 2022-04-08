import { useRouter } from "next/router";
import Layout from "../../../../src/components/Layout";
import Communities from "../../../../src/components/reddits/Communities";

const SubCategories = () => {
    return (
        <Layout>
            <Communities />
        </Layout>
    );
};

export default SubCategories;
