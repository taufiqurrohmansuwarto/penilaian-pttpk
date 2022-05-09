import { Button } from "antd";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { getPooling } from "../../../services/admin.service";
import AdminLayout from "../../../src/components/AdminLayout";
import PageContainer from "../../../src/components/PageContainer";

function Poolings() {
    const { data, isLoading } = useQuery(["poolings"], () => getPooling());
    const router = useRouter();

    const gotoCreate = () => router.push("/admin/poolings/create");

    return (
        <PageContainer title="Pooling" subTitle="Poolingku">
            <Button onClick={gotoCreate}>Goto Create</Button>
            <div>{JSON.stringify(data)}</div>
        </PageContainer>
    );
}

Poolings.Auth = {
    isAdmin: true
};

Poolings.getLayout = function getLayout(page) {
    return <AdminLayout>{page}</AdminLayout>;
};

export default Poolings;
