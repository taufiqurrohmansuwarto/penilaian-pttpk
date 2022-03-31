import { Button, message, Space, Table } from "antd";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
    aktifPenilaian,
    getPenilaian,
    hapusPenilaian
} from "../../../services/users.service";
import UserLayout from "../../../src/components/UserLayout";

const Penilaian = () => {
    const createPenilaian = () => router.push("/user/penilaian/create");
    const router = useRouter();

    const { data, isLoading } = useQuery("penilaian", () => getPenilaian());
    const queryClient = useQueryClient();

    const hapusMutation = useMutation((id) => hapusPenilaian(id), {
        onSuccess: () => {
            queryClient.invalidateQueries("penilaian");
            message.success("Berhasil dihapus");
        }
    });

    const aktifMutation = useMutation((id) => aktifPenilaian(id), {
        onSuccess: () => {
            message.success("Berhasil diaktifkan");
            queryClient.invalidateQueries("penilaian");
        },
        onError: (error) => message.error(error)
    });

    const handleRemove = (id) => hapusMutation.mutate(id);
    const handleUpdate = (id) => aktifMutation.mutate(id);
    const gotoDetail = (id) => router.push(`/user/penilaian/${id}/detail`);

    const columns = [
        { dataIndex: "tahun", title: "Tahun" },
        {
            key: "action",
            title: "Aksi",
            render: (_, row) => (
                <Space>
                    <Button onClick={() => gotoDetail(row?.id)}>Detial</Button>
                    <Button
                        loading={aktifMutation.isLoading}
                        onClick={async () => await handleUpdate(row?.id)}
                    >
                        Aktif
                    </Button>
                    <Button
                        loading={hapusMutation.isLoading}
                        onClick={async () => await handleRemove(row?.id)}
                    >
                        Hapus
                    </Button>
                </Space>
            )
        }
    ];

    if (isLoading) {
        return <div>loading..</div>;
    }

    return (
        <UserLayout title="Penilaian">
            <Button onClick={createPenilaian}>Buat</Button>
            {JSON.stringify(data)}
            <Table
                columns={columns}
                rowKey={(row) => row?.id}
                dataSource={data}
                pagination={false}
            />
        </UserLayout>
    );
};

Penilaian.Auth = {
    roles: ["USER"],
    groups: ["PTTPK"]
};

export default Penilaian;
