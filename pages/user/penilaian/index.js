import {
    CheckOutlined,
    CloseOutlined,
    FileAddOutlined
} from "@ant-design/icons";
import {
    Alert,
    Button,
    Card,
    Divider,
    message,
    Popconfirm,
    Space,
    Table,
    Typography
} from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
    aktifPenilaian,
    getPenilaian,
    hapusPenilaian
} from "../../../services/users.service";
import PageContainer from "../../../src/components/PageContainer";
import UserLayout from "../../../src/components/UserLayout";

const PeringatanPenilaian = () => {
    return (
        <Alert
            message="Perhatian"
            type="warning"
            description="Untuk membuat penilaian, pastikan anda membuat penilaian tahunan terlebih dahulu kemudian pastikan penilaian yang dipilih aktif. Setelah itu pastikan anda sudah mengentri target penilaian terlebih dahulu"
            showIcon
        />
    );
};

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
    const gotoEdit = (id) => router.push(`/user/penilaian/${id}/edit`);

    const columns = [
        { dataIndex: "tahun", title: "Tahun" },
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
            key: "satuan_kerja",
            title: "Satuan Kerja",
            render: (_, row) => <div>{row?.skpd?.detail}</div>
        },
        {
            key: "aktif",
            title: "Aktif",
            render: (_, row) => (
                <div>{row?.aktif ? <CheckOutlined /> : <CloseOutlined />}</div>
            )
        },
        {
            key: "action",
            title: "Aksi",
            render: (_, row) => (
                <Space>
                    <Typography.Link onClick={() => gotoEdit(row?.id)}>
                        Edit
                    </Typography.Link>
                    <Divider type="vertical" />
                    <Typography.Link onClick={() => gotoDetail(row?.id)}>
                        Target
                    </Typography.Link>
                    <Divider type="vertical" />
                    <Typography.Link
                        onClick={async () => await handleUpdate(row?.id)}
                    >
                        Aktif
                    </Typography.Link>
                    <Divider type="vertical" />
                    <Popconfirm
                        title="Apakah anda yakin menghapus penilaian ini?"
                        onConfirm={async () => await handleRemove(row?.id)}
                    >
                        <Typography.Link>Hapus</Typography.Link>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <PageContainer
            title="Daftar Penilaian"
            subTitle="PTTPK"
            content={<PeringatanPenilaian />}
        >
            <Card>
                <Divider />
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
                    loading={isLoading}
                    columns={columns}
                    rowKey={(row) => row?.id}
                    dataSource={data}
                    pagination={false}
                />
            </Card>
        </PageContainer>
    );
};

Penilaian.Auth = {
    roles: ["USER"],
    groups: ["PTTPK"]
};

Penilaian.getLayout = function getLayout(page) {
    return <UserLayout title="Penilaian">{page}</UserLayout>;
};

export default Penilaian;
