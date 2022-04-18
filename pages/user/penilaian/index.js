import { FileAddOutlined } from "@ant-design/icons";
import { Button, Card, message, Space, Table } from "antd";
import moment from "moment";
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
            key: "atasan_langsung",
            title: "Atasan Langsung",
            render: (_, row) => (
                <div>{row?.atasan_langsung?.label?.join("")}</div>
            )
        },
        {
            key: "atasan_banding",
            title: "Atasan Banding",
            render: (_, row) => (
                <div>{row?.atasan_banding?.label?.join("")}</div>
            )
        },
        {
            key: "eselon_ii",
            title: "Eselon II",
            render: (_, row) => <div>{row?.eselon_ii?.label?.join("")}</div>
        },
        {
            key: "awal_periode",
            title: "Awal Periode",
            render: (_, row) => (
                <div>{moment(row?.awal_periode).format("DD-MM-YYYY")}</div>
            )
        },
        {
            key: "akhir_periode",
            title: "Akhir Periode",
            render: (_, row) => (
                <div>{moment(row?.akhir_periode).format("DD-MM-YYYY")}</div>
            )
        },
        {
            key: "jabatan",
            title: "Jabatan",
            render: (_, row) => <div>{row?.jabatan?.nama}</div>
        },
        {
            key: "aktif",
            title: "Aktif",
            render: (_, row) => <div>{JSON.stringify(row?.aktif)}</div>
        },
        {
            key: "action",
            title: "Aksi",
            render: (_, row) => (
                <Space>
                    <Button onClick={() => gotoDetail(row?.id)}>Detail</Button>
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

    return (
        <UserLayout title="Penilaian Tahunan">
            <Card>
                <Table
                    title={() => (
                        <Button
                            icon={<FileAddOutlined />}
                            type="primary"
                            onClick={createPenilaian}
                        >
                            Penilaian
                        </Button>
                    )}
                    size="small"
                    loading={isLoading}
                    columns={columns}
                    rowKey={(row) => row?.id}
                    dataSource={data}
                    pagination={false}
                />
            </Card>
        </UserLayout>
    );
};

Penilaian.Auth = {
    roles: ["USER"],
    groups: ["PTTPK"]
};

export default Penilaian;
