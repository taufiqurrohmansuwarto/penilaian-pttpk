import { Button, List } from "@mantine/core";
import { Skeleton, Space, Table } from "antd";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { AddressBook } from "tabler-icons-react";
import { getPooling, removePolling } from "../../../services/admin.service";
import AdminLayout from "../../../src/components/AdminLayout";
import PageContainer from "../../../src/components/PageContainer";
import moment from "moment";

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

    const columns = [
        { title: "Pertanyaan pooling", dataIndex: "title" },
        {
            title: "Tanggal Kadaluarsa",
            dataIndex: "due_date",
            key: "due_date",
            render: (_, row) => <div>{moment(row?.due_date).format("lll")}</div>
        },
        {
            title: "Jawaban",
            dataIndex: "jawaban",
            key: "jawaban",
            render: (_, row) => (
                <List>
                    {row?.poolings_answers?.map((r) => (
                        <List.Item key={r?.id}>
                            {r?.answer} - {r?._count?.pollings_user_answer}
                        </List.Item>
                    ))}
                </List>
            )
        },
        {
            title: "Aksi",
            dataIndex: "action",
            key: "action",
            render: (_, row) => (
                <Space>
                    <Button
                        onClick={() =>
                            router.push(`/admin/poolings/${row?.id}`)
                        }
                    >
                        Edit
                    </Button>
                    <Button color="red" onClick={() => handleRemove(row?.id)}>
                        Hapus
                    </Button>
                </Space>
            )
        }
    ];

    return (
        <PageContainer
            title="Pooling"
            subTitle="Poolingku"
            style={{ minHeight: "95vh" }}
        >
            <Skeleton loading={isLoading}>
                <Button my="sm" onClick={gotoCreate} leftIcon={<AddressBook />}>
                    Buat Pooling
                </Button>
                <Table dataSource={data} columns={columns} pagination={false} />
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
