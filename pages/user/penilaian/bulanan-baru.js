import {
    Button,
    Card,
    DatePicker,
    Divider,
    Drawer,
    Form,
    Input,
    InputNumber,
    message,
    Select,
    Skeleton,
    Space,
    Table
} from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getRefSatuanKinerja } from "../../../services/ref.service";
import {
    createPenilaianBulanan,
    getPenilaianAktif,
    getPenilaianBulanan,
    getPenilaianBulananById,
    hapusPenilaianBulanan,
    updatePenilaianBulanan
} from "../../../services/users.service";
import UserLayout from "../../../src/components/UserLayout";

const DataPenilaianAktif = () => {
    const { data: dataPenilaianAktif } = useQuery(["penilaian_aktif"], () =>
        getPenilaianAktif()
    );
    return <div>{JSON.stringify(dataPenilaianAktif)}</div>;
};

const Footer = () => {
    return (
        <Space>
            <Button type="primary">Kirim Atasan</Button>
        </Space>
    );
};

const CreateFormBulanan = ({ targets, form }) => {
    return (
        <Form form={form} name="create-form-bulanan">
            <Form.Item name="id_target_penilaian">
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
            <Form.Item name="title">
                <Input.TextArea />
            </Form.Item>
            <Form.Item name="waktu_pekerjaan">
                <DatePicker.RangePicker />
            </Form.Item>
            <Form.Item name="kuantitas">
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
            <Form form={form} name="create-form-bulanan">
                <Form.Item name="id_target_penilaian">
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
                <Form.Item name="title">
                    <Input.TextArea />
                </Form.Item>
                <Form.Item name="waktu_pekerjaan">
                    <DatePicker.RangePicker />
                </Form.Item>
                <Form.Item name="kuantitas">
                    <InputNumber />
                </Form.Item>
            </Form>
        </Skeleton>
    );
};

const Penilaian = ({ tahun, bulan }) => {
    useEffect(() => {}, [bulan, tahun]);

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

    const {
        data: dataTargetPenilaian,
        isLoading: isLoadingDataTargetPenilaian
    } = useQuery(["target_penilaian"], () => getRefSatuanKinerja("target"));

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
                    <Space>
                        <Button onClick={() => showUpdate(row?.id)}>
                            Edit
                        </Button>
                        <Button onClick={() => handleRemoveBulanan(row?.id)}>
                            Hapus
                        </Button>
                    </Space>
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
            loading={isLoadingDataPenilaian || isLoadingDataTargetPenilaian}
        >
            <Table
                title={() => (
                    <Space>
                        <Button onClick={showCreate}>Tambah Pekerjaan</Button>
                    </Space>
                )}
                columns={columns}
                pagination={false}
                footer={() => <Footer />}
                dataSource={dataPenilaian}
                key="id"
                rowKey={(row) => row?.id}
            />
            <Drawer
                key="create"
                onClose={closeVisibleCreate}
                visible={visibleCreate}
                destroyOnClose
                extra={
                    <Button
                        loading={createPenilaianBulananMutation.isLoading}
                        onClick={handleSubmitCreate}
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
                destroyOnClose
                extra={
                    <Button
                        loading={updatePenilaianBulannanMutation.isLoading}
                        onClick={handleSubmitUpdate}
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
        <UserLayout title="Penilaian Bulanan">
            <Card>
                <DatePicker.MonthPicker
                    defaultValue={moment(`${tahun}-${bulan}`)}
                    onChange={handleChange}
                />
                <Divider />
                <Penilaian tahun={tahun} bulan={bulan} />
            </Card>
        </UserLayout>
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

BulananBaru.Auth = {
    groups: ["PTTPK"],
    roles: ["USER"]
};

export default BulananBaru;
