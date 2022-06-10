import { PlusOutlined } from "@ant-design/icons";
import {
    Alert,
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
    batalKirimAtasanPenilaianAkhir,
    createTugasTambahan,
    getPenilaianAktif,
    getTugasTambahan,
    kirimAtasanPenilaianAkhir,
    removeTugasTambahan,
    updateTugasTambahan
} from "../../../services/users.service";
import FormCetakPenilaianAkhir from "../../../src/components/FormCetakPenilaianAkhir";
import PageContainer from "../../../src/components/PageContainer";
import UserLayout from "../../../src/components/UserLayout";

const DataPekerjaanTambahan = ({ penilaianId, status }) => {
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
                <>
                    {status === "dikerjakan" ? (
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
                    ) : null}
                </>
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
                        disabled={status !== "dikerjakan"}
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

    const Warning = () => {
        return <div>Header</div>;
    };

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
    const queryClient = useQueryClient();
    const { data: dataPenilaianAktif, isLoading: isLoadingDataPenilaianAktif } =
        useQuery(["penilaian-aktif"], () => getPenilaianAktif(), {});

    const kirimAtasanMutation = useMutation(() => kirimAtasanPenilaianAkhir(), {
        onSuccess: () => {
            message.success("Berhasil Kirim");
            queryClient.invalidateQueries(["penilaian-aktif"]);
        }
    });

    const batalKirimAtasanMutation = useMutation(
        () => batalKirimAtasanPenilaianAkhir(),
        {
            onSuccess: () => {
                message.success("Turun Status Berhasil");
                queryClient.invalidateQueries(["penilaian-aktif"]);
            }
        }
    );

    const handleKirimAtasan = () => {
        Modal.confirm({
            title: "Perhatian",
            centered: true,
            width: 600,

            content:
                "Apakah anda yakin ingin mengirim penilaian akhir ke atasan anda?. Anda tidak bisa lagi menambah / mengurangi pekerjaan tambahan anda.",
            onOk: () => {
                return new Promise(async (resolve, reject) => {
                    try {
                        await kirimAtasanMutation.mutateAsync();
                        resolve("succes");
                    } catch (error) {
                        reject("error");
                    }
                });
            }
        });
    };

    const handleBatalKirimAtasan = () => {
        Modal.confirm({
            title: "Perhatian",
            centered: true,
            width: 600,

            content:
                "Apakah anda yakin membatalkan kirim atasan?. Anda dapat menambah / menguruangi pekerjaan tambahan anda.",
            onOk: () => {
                return new Promise(async (resolve, reject) => {
                    try {
                        await batalKirimAtasanMutation.mutateAsync();
                        resolve("succes");
                    } catch (error) {
                        reject("error");
                    }
                });
            }
        });
    };

    const [visible, setVisible] = useState(false);
    const handleCancelModal = () => setVisible(false);

    const cetakPenilaianAkhir = () => {
        setVisible(true);
    };

    return (
        <PageContainer
            title="Penilaian Akhir"
            subTitle="PTTPK"
            fixedHeader
            content={
                <Alert
                    type="warning"
                    showIcon
                    message="Perhatian"
                    description="Untuk dapat mencetak penilaian tahunan/akhir. Pastikan kembali atasan langsung anda masuk pada aplikasi dan menilai penilaian akhir tahunan anda. Perlu diingat, Capaian pada penilaian akhir merupakan pekerjaan bulanan yang sudah dinilai dan diacc atasan langsung"
                />
            }
        >
            <Skeleton loading={isLoadingDataPenilaianAktif}>
                <FormCetakPenilaianAkhir
                    visible={visible}
                    onCancel={handleCancelModal}
                />
                <div style={{ marginBottom: 8 }}>
                    Status : {dataPenilaianAktif?.status?.toUpperCase()}
                </div>
                <Space>
                    {dataPenilaianAktif?.status === "dikerjakan" ? (
                        <Button onClick={handleKirimAtasan}>
                            Kirim Atasan
                        </Button>
                    ) : (
                        <Space>
                            <Button onClick={handleBatalKirimAtasan}>
                                Batal Kirim
                            </Button>
                            <Button
                                onClick={cetakPenilaianAkhir}
                                disabled={
                                    dataPenilaianAktif?.status !== "diverif"
                                }
                            >
                                Cetak
                            </Button>
                        </Space>
                    )}
                </Space>
                <Divider />
                <DataTargetPenilaian
                    data={dataPenilaianAktif?.target_penilaian}
                />
                <DataPekerjaanTambahan
                    penilaianId={dataPenilaianAktif?.id}
                    status={dataPenilaianAktif?.status}
                />
            </Skeleton>
        </PageContainer>
    );
}

PenilaianAkhir.Auth = {
    roles: ["USER"],
    groups: ["PTTPK"]
};

PenilaianAkhir.getLayout = function getLayout(page) {
    return <UserLayout title="Penilaian Akhir">{page}</UserLayout>;
};

export default PenilaianAkhir;
