import { PlusOutlined } from "@ant-design/icons";
import {
    Button,
    Divider,
    Form,
    Input,
    message,
    Modal,
    Popconfirm,
    Skeleton,
    Space,
    Table,
    Typography
} from "antd";
import { sumBy } from "lodash";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
    createTugasTambahan,
    getPenilaianAktif,
    getTugasTambahan,
    removeTugasTambahan,
    updateTugasTambahan
} from "../../../services/users.service";
import UserLayout from "../../../src/components/UserLayout";

const DataPekerjaanTambahan = ({ penilaianId }) => {
    const { data, isLoading } = useQuery(
        ["tugas-tambahan", penilaianId],
        () => getTugasTambahan(penilaianId),
        {
            enabled: !!penilaianId
        }
    );

    const queryClient = useQueryClient();

    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);

    const handleOpenCreateModal = () => setOpenCreateModal(true);
    const handleCloseCreateModal = () => setOpenCreateModal(false);

    const handleOpenUpdateModal = () => setOpenUpdateModal(true);
    const handleCloseUpdateModal = () => setOpenUpdateModal(false);

    const [currentRow, setCurrentRow] = useState(false);

    const [createForm] = Form.useForm();
    const [updateForm] = Form.useForm();

    useEffect(() => {
        updateForm.setFieldsValue({
            title: currentRow?.title
        });
    }, [penilaianId, currentRow]);

    const createMutation = useMutation((data) => createTugasTambahan(data), {
        onSuccess: () => {
            message.success("Tugas tambahan berhasil ditambahkan");
            queryClient.invalidateQueries(["tugas-tambahan"]);
            setOpenCreateModal(false);
        },
        onError: (e) => message.error("data")
    });

    const updateMutation = useMutation((data) => updateTugasTambahan(data), {
        onSuccess: () => {
            message.success("Tugas tambahan berhasil diupdate");
            queryClient.invalidateQueries(["tugas-tambahan"]);
            setOpenUpdateModal(false);
        },
        onError: () => message.error("Gagal")
    });

    const removeMutation = useMutation((data) => removeTugasTambahan(data), {
        onSuccess: () => {
            queryClient.invalidateQueries(["tugas-tambahan"]);
            message.success("Berhasil dihapus");
        },
        onError: (e) => message.error("error")
    });

    const handleCreate = async () => {
        try {
            const result = await createForm.validateFields();
            createMutation.mutate({ id: penilaianId, data: result });
        } catch (error) {
            console.log(error);
        }
    };

    const handleRemove = (id) => {
        removeMutation.mutate({ penilaianId, id });
    };

    const handleEdit = (row) => {
        setCurrentRow(row);
        setOpenUpdateModal(true);
    };

    const submitUpdate = async () => {
        try {
            const values = await updateForm.validateFields();
            const { id } = currentRow;
            updateMutation.mutate({
                penilaianId,
                data: { title: values?.title },
                id
            });
        } catch (error) {}
    };

    const columns = [
        { dataIndex: "title", title: "Pekerjaan" },
        {
            key: "aksi",
            title: "Aksi",
            render: (_, row) => (
                <Space>
                    <Typography.Link onClick={() => handleEdit(row)}>
                        Edit
                    </Typography.Link>
                    <Popconfirm
                        title="Apakah anda yakin ingin menghapus data?"
                        onConfirm={() => handleRemove(row?.id)}
                    >
                        <Typography.Link>Hapus</Typography.Link>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div>
            <Divider />
            <Table
                title={() => (
                    <Button
                        onClick={handleOpenCreateModal}
                        type="primary"
                        icon={<PlusOutlined />}
                    >
                        Pekerjaan Tambahan
                    </Button>
                )}
                columns={columns}
                pagination={false}
                dataSource={data}
                isLoading={isLoading}
                rowKey={(row) => row?.id}
            />
            <Modal
                key="create_modal"
                visible={openCreateModal}
                onCancel={handleCloseCreateModal}
                onOk={handleCreate}
                confirmLoading={createMutation.isLoading}
                destroyOnClose
                centered
                width={800}
                title="Tambah Tugas Tambahan"
            >
                <Form form={createForm}>
                    <Form.Item
                        name="title"
                        label="Nama Pekerjaan"
                        requiredMark={false}
                    >
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                width={800}
                key="open_modal"
                visible={openUpdateModal}
                onCancel={handleCloseUpdateModal}
                onOk={submitUpdate}
                confirmLoading={updateMutation.isLoading}
                destroyOnClose
                centered
                title="Update Pekerjaan Tambahan"
            >
                <Form form={updateForm}>
                    <Form.Item
                        name="title"
                        label="Nama Pekerjaan"
                        requiredMark={false}
                    >
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

const DataTargetPenilaian = ({ data }) => {
    const columns = [
        { dataIndex: "pekerjaan", title: "Pekerjaan", key: "pekerjaan" },
        { dataIndex: "kuantitas", title: "Kuantitas", key: "kuantitas" },

        {
            key: "capaian",
            title: "Capaian",
            render: (_, row) => {
                return <div>{sumBy(row?.kinerja_bulanan, "kuantitas")}</div>;
            }
        },
        {
            key: "satuan",
            title: "Satuan",
            render: (_, row) => row?.ref_satuan_kinerja?.nama
        },
        {
            key: "persentase",
            title: "Persentase",
            render: (text, record, index) => {
                return (
                    <div>
                        {(sumBy(record?.kinerja_bulanan, "kuantitas") /
                            record?.kuantitas) *
                            100}{" "}
                        %
                    </div>
                );
            }
        }
    ];

    return (
        <>
            <Table
                dataSource={data}
                columns={columns}
                rowKey={(row) => row?.id}
                pagination={false}
            />
        </>
    );
};

function PenilaianAkhir() {
    const { data: dataPenilaianAktif, isLoading: isLoadingDataPenilaianAktif } =
        useQuery(["penilaian-aktif"], () => getPenilaianAktif(), {});

    return (
        <UserLayout>
            <Skeleton loading={isLoadingDataPenilaianAktif}>
                <DataTargetPenilaian
                    data={dataPenilaianAktif?.target_penilaian}
                />
                <DataPekerjaanTambahan penilaianId={dataPenilaianAktif?.id} />
            </Skeleton>
        </UserLayout>
    );
}

export default PenilaianAkhir;
