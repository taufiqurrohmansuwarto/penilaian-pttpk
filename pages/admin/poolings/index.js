import { Button, Skeleton } from "antd";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getPooling, removePolling } from "../../../services/admin.service";
import AdminLayout from "../../../src/components/AdminLayout";
import PageContainer from "../../../src/components/PageContainer";

function Poolings() {
    const { data, isLoading } = useQuery(["poolings"], () => getPooling());
    const router = useRouter();

    const gotoCreate = () => router.push("/admin/poolings/create");

    const queryClient = useQueryClient();

    const { mutate: remove } = useMutation((data) => removePolling(data), {
        onSuccess: () => queryClient.invalidateQueries(["poolings"])
    });

    const handleRemove = (id) => {
        remove(id);
    };

    return (
        <PageContainer title="Pooling" subTitle="Poolingku">
            <Skeleton loading={isLoading}>
                <Button onClick={gotoCreate}>Goto Create</Button>
                {data?.map((d) => (
                    <div key={d?.id}>
                        {JSON.stringify(d)}
                        <Button onClick={() => handleRemove(d?.id)}>
                            Hapus
                        </Button>
                    </div>
                ))}
            </Skeleton>
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
