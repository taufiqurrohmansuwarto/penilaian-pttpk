import {
    CloseOutlined,
    FileAddOutlined,
    PrinterOutlined,
    SendOutlined
} from "@ant-design/icons";
import {
    Alert,
    BackTop,
    Button,
    Card,
    DatePicker,
    Divider,
    Drawer,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    Popconfirm,
    Select,
    Skeleton,
    Space,
    Table,
    Typography
} from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getRefSatuanKinerja } from "../../../services/ref.service";
import {
    batalKirimAtasan,
    createPenilaianBulanan,
    getPenilaianAktif,
    getPenilaianBulanan,
    getPenilaianBulananById,
    getRequestPenilaian,
    hapusPenilaianBulanan,
    kirimAtasan,
    updatePenilaianBulanan
} from "../../../services/users.service";
import FormCetakModal from "../../../src/components/FormCetakModal";
import PageContainer from "../../../src/components/PageContainer";
import PekerjaanBulananCuti from "../../../src/components/PegawaiCuti/PekerjaanBulananCuti";
import UserLayout from "../../../src/components/UserLayout";

const DataPenilaianAktif = () => {
    const { data: dataPenilaianAktif } = useQuery(["penilaian_aktif"], () =>
        getPenilaianAktif()
    );
    return <div>{JSON.stringify(dataPenilaianAktif)}</div>;
};

const Footer = ({ data, bulan, tahun, dataBulanan }) => {
    const queryClient = useQueryClient();

    const kirimAtasanMutation = useMutation((data) => kirimAtasan(data), {
        onSuccess: () => {
            queryClient.invalidateQueries(["data-request-penilaian"]);
            message.success("Berhasil kirim ke atasan");
        }
    });

    const batalKirimAtasaMutation = useMutation(
        (data) => batalKirimAtasan(data),
        {
            onSuccess: () => {
                message.success("Turun Status Berhasil!");
                queryClient.invalidateQueries(["data-request-penilaian"]);
            }
        }
    );

    const handleKirimAtasan = () => {
        if (!dataBulanan?.length) {
            message.error("Kinerja bulanan anda masih kosong!");
        } else {
            Modal.confirm({
                title: "Perhatian",
                content:
                    "Apakah anda ingin mengirimkan penilaian ke Atasan? Penilaian yang sudah dikirim ke atasan tidak dapat dihapus ataupun di edit.",
                width: 500,
                centered: true,
                onOk: () => {
                    kirimAtasanMutation.mutate({ bulan, tahun });
                }
            });
        }
    };

    const [visible, setVisible] = useState(false);
    const handleShowModal = () => setVisible(true);
    const handleCancelShowModal = () => setVisible(false);
    const [formCetak] = Form.useForm();

    const handleCetak = () => {
        setVisible(true);
    };

    const handleBatalKirimAtasan = () => {
        Modal.confirm({
            title: "Perhatian",
            content:
                "Dengan mengklik tombol Turun Status anda dapat mengentri ulang data pekerjaan bulanan anda kembali.  Apakah anda yakin?",
            width: 500,
            centered: true,
            onOk: () => {
                batalKirimAtasaMutation.mutate({ bulan, tahun });
            }
        });
    };

    return (
        <>
            <FormCetakModal
                visible={visible}
                onCancel={handleCancelShowModal}
                form={formCetak}
                bulan={bulan}
                tahun={tahun}
                onClose={handleCancelShowModal}
            />
            <Skeleton
                loading={
                    kirimAtasanMutation.isLoading ||
                    batalKirimAtasaMutation.isLoading
                }
            >
                {!data ? (
                    <Space>
                        <Button
                            disabled={!dataBulanan?.length}
                            type="primary"
                            onClick={handleKirimAtasan}
                            icon={<SendOutlined />}
                        >
                            Kirim pekerjaan ke penilai
                        </Button>
                    </Space>
                ) : (
                    <>
                        {data?.sudah_verif && (
                            <div>
                                <p>Catatan : </p>
                                <p>{data?.catatan}</p>
                                <Divider />
                            </div>
                        )}
                        <Space>
                            <Button
                                type="danger"
                                onClick={handleBatalKirimAtasan}
                                icon={<CloseOutlined />}
                            >
                                Turun Status Bulanan
                            </Button>
                            <Button
                                disabled={!data?.sudah_verif}
                                type="primary"
                                onClick={handleCetak}
                                icon={<PrinterOutlined />}
                            >
                                Penilaian Bulanan
                            </Button>
                        </Space>
                    </>
                )}
            </Skeleton>
        </>
    );
};

const CreateFormBulanan = ({ targets, form }) => {
    return (
        <Form
            form={form}
            name="create-form-bulanan"
            requiredMark={false}
            layout="vertical"
        >
            <Form.Item
                name="id_target_penilaian"
                label="Induk Pekerjaan"
                rules={[{ required: true, message: "Tidak boleh kosong" }]}
            >
                <Select showSearch optionFilterProp="name">
                    {targets?.map((target) => (
                        <Select.Option
                            value={target?.id}
                            name={target?.pekerjaan}
                        >
                            {target?.pekerjaan}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                name="title"
                label="Detail Pekerjaan"
                rules={[{ required: true, message: "Tidak boleh kosong" }]}
            >
                <Input.TextArea />
            </Form.Item>
            <Form.Item
                name="waktu_pekerjaan"
                label="Waktu Pengerjaan"
                rules={[{ required: true, message: "Tidak boleh kosong" }]}
            >
                <DatePicker.RangePicker />
            </Form.Item>
            <Form.Item
                name="kuantitas"
                label="Kuantitas"
                rules={[{ required: true, message: "Tidak boleh kosong" }]}
            >
                <InputNumber />
            </Form.Item>
        </Form>
    );
};

const UpdateFormBulanan = ({ form, id, targets }) => {
    const { data, isLoading } = useQuery(
        ["penilaian-bulanan", id],
        () => {
            return getPenilaianBulananById(id);
        },
        {
            enabled: !!id
        }
    );

    useEffect(() => {
        if (!isLoading) {
            form.setFieldsValue({
                id_target_penilaian: data?.target_penilaian?.id,
                title: data?.title,
                waktu_pekerjaan: [moment(data?.start), moment(data?.end)],
                kuantitas: data?.kuantitas
            });
        }
    }, [id, isLoading, data]);

    return (
        <Skeleton loading={isLoading}>
            <Form
                form={form}
                name="create-form-bulanan"
                layout="vertical"
                requiredMark={false}
            >
                <Form.Item
                    name="id_target_penilaian"
                    label="Induk Pekerjaan"
                    rules={[{ required: true, message: "Tidak boleh kosong" }]}
                >
                    <Select showSearch optionFilterProp="name">
                        {targets?.map((target) => (
                            <Select.Option
                                value={target?.id}
                                name={target?.pekerjaan}
                            >
                                {target?.pekerjaan}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="title"
                    label="Detail Pekerjaan"
                    rules={[{ required: true, message: "Tidak boleh kosong" }]}
                >
                    <Input.TextArea />
                </Form.Item>
                <Form.Item
                    name="waktu_pekerjaan"
                    label="Waktu Pengerjaan"
                    rules={[{ required: true, message: "Tidak boleh kosong" }]}
                >
                    <DatePicker.RangePicker />
                </Form.Item>
                <Form.Item
                    name="kuantitas"
                    label="Kuantitas"
                    rules={[{ required: true, message: "Tidak boleh kosong" }]}
                >
                    <InputNumber />
                </Form.Item>
            </Form>
        </Skeleton>
    );
};

const Penilaian = ({ tahun, bulan }) => {
    const [visibleCreate, setVisibleCreate] = useState(false);
    const [visibleUpdate, setVisibleUpdate] = useState(false);

    const [id, setId] = useState(null);

    const closeVisibleCreate = () => setVisibleCreate(false);
    const closeVisibleUpdate = () => setVisibleUpdate(false);

    const showCreate = () => setVisibleCreate(true);
    const showUpdate = (id) => {
        setVisibleUpdate(true);
        setId(id);
    };

    const { data: dataPenilaian, isLoading: isLoadingDataPenilaian } = useQuery(
        ["data-penilaian", bulan, tahun],
        () => getPenilaianBulanan(bulan, tahun),
        {
            enabled: !!bulan && !!tahun
        }
    );

    useEffect(() => {}, [bulan, tahun]);

    const {
        data: dataTargetPenilaian,
        isLoading: isLoadingDataTargetPenilaian
    } = useQuery(["target_penilaian"], () => getRefSatuanKinerja("target"));

    const {
        data: dataRequestPenilaian,
        isLoading: isLoadingDataRequestPenilaian
    } = useQuery(
        ["data-request-penilaian", bulan, tahun],
        () => getRequestPenilaian(bulan, tahun),
        {
            enabled: !!tahun && !!bulan
        }
    );

    const [createForm] = Form.useForm();
    const [updateForm] = Form.useForm();

    const queryClient = useQueryClient();

    const createPenilaianBulananMutation = useMutation(
        (data) => createPenilaianBulanan(data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["data-penilaian"]);
                createForm.resetFields();
                setVisibleCreate(false);
                message.success("Berhasil ditambahkan");
            },
            onError: (e) => {
                console.log(e);
            }
        }
    );

    const updatePenilaianBulannanMutation = useMutation(
        (data) => updatePenilaianBulanan(data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["data-penilaian"]);
                message.success("Berhasil diupdate");
                setVisibleUpdate(false);
            }
        }
    );
    const removePenilaianBulananMutation = useMutation(
        (id) => hapusPenilaianBulanan(id),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["data-penilaian"]);
                message.success("Berhasil dihapus");
            }
        }
    );

    const handleRemoveBulanan = (id) => {
        removePenilaianBulananMutation.mutate(id);
    };

    // todo create column and custom keys
    const columns = [
        { dataIndex: "title", title: "Detail Pekerjaan" },
        {
            key: "induk_pekerjaan",
            title: "Induk Pekerjaan",
            render: (_, row) => <div>{row?.target_penilaian?.pekerjaan}</div>
        },
        {
            key: "satuan",
            title: "Satuan",
            render: (_, row) => (
                <div>{row?.target_penilaian?.ref_satuan_kinerja?.nama}</div>
            )
        },
        { dataIndex: "kuantitas", title: "Kuantitas" },
        { dataIndex: "kualitas", title: "Kualitas" },
        {
            dataIndex: "waktu_pekerjaan",
            title: "Waktu Pekerjaan",
            render: (_, row) => (
                <div>
                    {moment(row?.start).format("DD-MM-YYYY")} s/d{" "}
                    {moment(row?.end).format("DD-MM-YYYY")}
                </div>
            )
        },
        {
            key: "aksi",
            title: "Aksi",
            render: (_, row) => {
                return (
                    <>
                        {!dataRequestPenilaian ? (
                            <Space>
                                <Typography.Link
                                    disabled={dataRequestPenilaian}
                                    onClick={() => showUpdate(row?.id)}
                                >
                                    Edit
                                </Typography.Link>
                                <Divider />
                                <Popconfirm
                                    title="Apakah anda yakin ingin menghapus data pekerjaan bulanan anda?"
                                    onConfirm={() =>
                                        handleRemoveBulanan(row?.id)
                                    }
                                >
                                    <Typography.Link
                                        disabled={dataRequestPenilaian}
                                    >
                                        Hapus
                                    </Typography.Link>
                                </Popconfirm>
                            </Space>
                        ) : null}
                    </>
                );
            }
        }
    ];

    const handleSubmitCreate = async () => {
        try {
            const values = await createForm.validateFields();
            const { waktu_pekerjaan, id_target_penilaian, kuantitas, title } =
                values;
            const [mulai, akhir] = waktu_pekerjaan;
            const start = moment(mulai);
            const end = moment(akhir);
            const data = {
                start,
                end,
                id_target_penilaian,
                kuantitas,
                title,
                bulan: parseInt(bulan),
                tahun: parseInt(tahun)
            };

            createPenilaianBulananMutation.mutate(data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmitUpdate = async () => {
        try {
            const values = await updateForm.validateFields();
            const { waktu_pekerjaan, id_target_penilaian, kuantitas, title } =
                values;
            const [mulai, akhir] = waktu_pekerjaan;
            const start = moment(mulai);
            const end = moment(akhir);

            const data = {
                start,
                end,
                id_target_penilaian,
                kuantitas,
                title,
                bulan: parseInt(bulan),
                tahun: parseInt(tahun)
            };

            const currentData = { id, data };
            updatePenilaianBulannanMutation.mutate(currentData);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Skeleton
            loading={
                isLoadingDataPenilaian ||
                isLoadingDataTargetPenilaian ||
                isLoadingDataRequestPenilaian
            }
        >
            <Table
                title={() => (
                    <>
                        {!dataRequestPenilaian && (
                            <div>
                                <Space>
                                    <Button
                                        onClick={showCreate}
                                        type="primary"
                                        icon={<FileAddOutlined />}
                                    >
                                        Pekerjaan
                                    </Button>
                                    <PekerjaanBulananCuti
                                        bulan={bulan}
                                        tahun={tahun}
                                    />
                                </Space>
                            </div>
                        )}
                    </>
                )}
                columns={columns}
                pagination={false}
                footer={() => (
                    <Footer
                        bulan={bulan}
                        tahun={tahun}
                        dataBulanan={dataPenilaian}
                        data={dataRequestPenilaian}
                    />
                )}
                dataSource={dataPenilaian}
                key="id"
                rowKey={(row) => row?.id}
            />
            <BackTop />
            <Drawer
                key="create"
                onClose={closeVisibleCreate}
                visible={visibleCreate}
                width={500}
                destroyOnClose
                extra={
                    <Button
                        loading={createPenilaianBulananMutation.isLoading}
                        onClick={handleSubmitCreate}
                        type="primary"
                    >
                        Submit
                    </Button>
                }
            >
                <CreateFormBulanan
                    form={createForm}
                    targets={dataTargetPenilaian}
                />
            </Drawer>
            <Drawer
                key="update"
                visible={visibleUpdate}
                onClose={closeVisibleUpdate}
                width={500}
                destroyOnClose
                extra={
                    <Button
                        loading={updatePenilaianBulannanMutation.isLoading}
                        onClick={handleSubmitUpdate}
                        type="primary"
                    >
                        Update
                    </Button>
                }
            >
                <UpdateFormBulanan
                    form={updateForm}
                    id={id}
                    targets={dataTargetPenilaian}
                />
            </Drawer>
        </Skeleton>
    );
};

const BulananBaru = ({ data }) => {
    const [bulan, setBulan] = useState(data?.query?.bulan);
    const [tahun, setTahun] = useState(data?.query?.tahun);

    const router = useRouter();

    useEffect(() => {
        if (!router?.isReady) return;
    }, [router?.query, bulan, tahun]);

    const handleChange = (e) => {
        const bulan = moment(e).format("M");
        const tahun = moment(e).format("YYYY");

        setBulan(bulan);
        setTahun(tahun);
        router.push({
            query: {
                bulan,
                tahun
            }
        });
    };

    return (
        <PageContainer
            title="Penilaian Bulanan"
            subTitle="PTTPK"
            content={
                <Alert
                    type="warning"
                    message="Info"
                    showIcon
                    description="Untuk dapat mencetak penilaian bulanan, pastikan atasan langsung anda (PNS) masuk pada aplikasi dan menilai kinerja bulanan anda."
                />
            }
        >
            <Card>
                <Form.Item label="Bulan">
                    <DatePicker.MonthPicker
                        defaultValue={moment(`${tahun}-${bulan}`)}
                        onChange={handleChange}
                    />
                </Form.Item>
                <Divider />
                <Penilaian tahun={tahun} bulan={bulan} />
            </Card>
        </PageContainer>
    );
};

export const getServerSideProps = async (ctx) => {
    const tahun = ctx?.query?.tahun || moment(new Date()).format("YYYY");
    const bulan = ctx?.query?.bulan || moment(new Date()).format("M");

    return {
        props: {
            data: {
                query: {
                    tahun,
                    bulan
                }
            }
        }
    };
};

BulananBaru.getLayout = function getLayout(page) {
    return <UserLayout title="Penilaian Bulanan">{page}</UserLayout>;
};

BulananBaru.Auth = {
    roles: ["USER"],
    groups: ["PTTPK"]
};

export default BulananBaru;
