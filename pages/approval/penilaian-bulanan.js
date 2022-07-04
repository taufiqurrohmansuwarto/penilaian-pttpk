import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import {
    Alert as AlertMantine,
    Alert as MantineAlert,
    Text
} from "@mantine/core";
import {
    Alert,
    Avatar,
    BackTop,
    Button,
    Card,
    DatePicker,
    Divider,
    Input,
    InputNumber,
    message,
    Modal,
    Skeleton,
    Space,
    Table
} from "antd";
import { random, sumBy } from "lodash";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
    approvaPenilaianBulananApproval,
    getPenilaianApproval,
    getPenilaianBulananApproval
} from "../../services/approval.service";
import ApprovalLayout from "../../src/components/ApprovalLayout";
import PageContainer from "../../src/components/PageContainer";

const FormApprovalModalCutin = ({
    id,
    bulan,
    tahun,
    onCancel,
    visible,
    idPtt,
    catatanAtasanLangsung,
    namaPtt
}) => {
    const { data, isLoading, status } = useQuery(
        ["approval_penilaian_bulanan", `${id}${bulan}${tahun}`],
        () => getPenilaianBulananApproval({ id, bulan, tahun }),
        {
            enabled: !!id
        }
    );

    const querClient = useQueryClient();

    const verifMutationApproval = useMutation(
        (data) => approvaPenilaianBulananApproval(data),
        {
            onSuccess: () => {
                querClient.invalidateQueries(["approval_penilaian_bulanan"]);
                message.success("berhasil");
                onCancel();
            }
        }
    );

    const [catatan, setCatatan] = useState(null);
    const handleChangeCatatan = (e) => {
        setCatatan(e?.target?.value);
    };

    const handleSubmitCuti = () => {
        const value = {
            id,
            data: {
                list: [],
                catatan
            },
            bulan,
            tahun,
            id_ptt: idPtt
        };
        verifMutationApproval.mutate(value);
    };

    useEffect(() => {
        if (status === "success") {
            setCatatan(catatanAtasanLangsung);
        }
    }, [data, status, visible]);

    return (
        <Modal
            title={"Pegawai yang bersangkutan cuti"}
            visible={visible}
            onCancel={onCancel}
            onOk={handleSubmitCuti}
            confirmLoading={verifMutationApproval.isLoading}
            destroyOnClose
            width={800}
            centered
        >
            <Alert
                description={`Pegawai atas nama ${namaPtt} sedang cuti, anda tidak perlu memasukkan nilai untuk melakukan verif. Silahkan isi catatan jika ada, apabila tidak ada bisa dikosongkan dan tekan OK`}
                message="Cuti"
            />
            <Divider />
            <p>Catatan</p>
            <Input.TextArea value={catatan} onChange={handleChangeCatatan} />
        </Modal>
    );
};

const FormApprovalModal = ({
    id,
    bulan,
    tahun,
    onCancel,
    visible,
    idPtt,
    catatanAtasanLangsung,
    namaPtt
}) => {
    const { data, isLoading, status } = useQuery(
        ["approval_penilaian_bulanan", `${id}${bulan}${tahun}`],
        () => getPenilaianBulananApproval({ id, bulan, tahun }),
        {
            enabled: !!id
        }
    );

    const [kualitasValue, setKualitasValue] = useState([]);
    const [lowValue, setLowValue] = useState(0);
    const [highValue, setHightValue] = useState(0);
    const [catatan, setCatatan] = useState(null);

    const handleChangeCatatan = (e) => {
        setCatatan(e?.target?.value);
    };

    useEffect(() => {
        if (status === "success") {
            setLowValue(0);
            setHightValue(0);
            setCatatan(catatanAtasanLangsung);
            setKualitasValue(
                data?.kinerja_bulanan?.map((k) => ({
                    id: k?.id,
                    tahun: k?.tahun,
                    bulan: k?.bulan,
                    kualitas: k?.kualitas
                }))
            );
        }
    }, [status, data, visible]);

    const columns = [
        {
            dataIndex: "no",
            title: "No.",
            render: (_, row, key) => <div>{key + 1}</div>
        },
        { dataIndex: "title", title: "Deskripsi Pekerjaan" },

        { dataIndex: "kuantitas", title: "Kuantitas" },
        {
            dataIndex: "start",
            title: "Tgl. Mulai Pekerjaan",
            render: (_, row) => (
                <div>{moment(row?.start).format("DD-MM-YYYY")}</div>
            )
        },
        {
            dataIndex: "end",
            title: "Tgl. Akhir Pekerjaan",
            render: (_, row) => (
                <div>{moment(row?.end).format("DD-MM-YYYY")}</div>
            )
        },
        {
            dataIndex: "induk_pekerjaan",
            title: "Induk Pekerjaan",
            render: (_, row) => <div>{row?.target_penilaian?.pekerjaan}</div>
        },
        {
            dataIndex: "target",
            title: "Target",
            render: (_, row) => <div>{row?.target_penilaian?.kuantitas}</div>
        },
        {
            dataIndex: "capaian",
            title: "Capaian",
            render: (_, row) => (
                <div>
                    {sumBy(row?.target_penilaian?.kinerja_bulanan, "kuantitas")}
                </div>
            )
        },
        {
            key: "kualitas",
            title: "Kualitas/Nilai",
            render: (_, row) => (
                <InputNumber
                    min={0}
                    max={100}
                    value={
                        kualitasValue?.find((k) => k?.id === row?.id)?.kualitas
                    }
                    onChange={(e) => {
                        const index = kualitasValue?.findIndex(
                            (k) => k?.id === row?.id
                        );
                        const newArray = [...kualitasValue];
                        newArray[index].kualitas = e;
                        setKualitasValue(newArray);
                    }}
                />
            )
        }
    ];

    const querClient = useQueryClient();

    const verifMutationApproval = useMutation(
        (data) => approvaPenilaianBulananApproval(data),
        {
            onSuccess: () => {
                querClient.invalidateQueries(["approval_penilaian_bulanan"]);
                message.success("berhasil");
                onCancel();
            }
        }
    );
    const handleSubmit = () => {
        const hasZero = kualitasValue?.some((x) => x?.kualitas === 0);
        if (hasZero) {
            message.error(
                "Masih ada yang belum dinilai. Sepertinya ada kualitas yang masih 0"
            );
        } else {
            const value = {
                id,
                data: {
                    list: kualitasValue,
                    catatan
                },
                bulan,
                tahun,
                id_ptt: idPtt
            };
            verifMutationApproval.mutate(value);
        }
    };

    const handleChangeLowValue = (e) => setLowValue(e);
    const handleChangeHighValue = (e) => setHightValue(e);

    const handleSetRandomValue = () => {
        const newValue = kualitasValue?.map((d) => {
            return {
                ...d,
                kualitas: random(lowValue, highValue)
            };
        });
        setKualitasValue(newValue);
    };

    return (
        <Modal
            title={`Pekerjaan Bulanan ${namaPtt}`}
            okText="Beri Nilai"
            destroyOnClose
            confirmLoading={verifMutationApproval.isLoading}
            centered
            onCancel={onCancel}
            visible={visible}
            width={1200}
            onOk={handleSubmit}
        >
            <MantineAlert
                color="yellow"
                style={{ marginBottom: 8 }}
                title="Petunjuk"
            >
                Anda bisa men set nilai dibawah ini untuk mempercepat pengisian
                kualitas PTTPK. Misal ingin menilai PTTPK dengan batasan nilai
                88 sampai 90. Nilai 88 sampai 90 bukan merupakan nilai patokan.
                Anda bisa juga mengisi secara manual di kolom kualitas/nilai
            </MantineAlert>
            {/* {JSON.stringify(data?.kinerja_bulanan)} */}
            <Divider />
            <Space>
                <InputNumber
                    min={0}
                    max={100}
                    defaultValue={0}
                    value={lowValue}
                    onChange={handleChangeLowValue}
                />
                <InputNumber
                    value={highValue}
                    min={0}
                    max={100}
                    defaultValue={0}
                    onChange={handleChangeHighValue}
                />
                <Button onClick={handleSetRandomValue}>
                    Set Nilai dengan batasan
                </Button>
            </Space>
            <Divider />
            <Table
                pagination={false}
                columns={columns}
                loading={isLoading}
                dataSource={data?.kinerja_bulanan}
                rowKey={(row) => row?.id}
            />
            <Divider />
            <p>Catatan : </p>
            <Input.TextArea value={catatan} onChange={handleChangeCatatan} />
        </Modal>
    );
};

// hehe patut di contoh
/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
function Penilaian({ data: query }) {
    const [date, setDate] = useState(
        moment(`${query?.tahun}-${query?.bulan}-01`)
    );

    const {
        data: dataPenilaianApproval,
        isLoading: loadingDataPenilaianApproval
    } = useQuery(
        ["approval_penilaian_bulanan", date],
        () =>
            getPenilaianApproval({
                bulan: moment(date).format("M"),
                tahun: moment(date).format("YYYY")
            }),
        {
            enabled: !!date
        }
    );

    const router = useRouter();

    const handleChange = (e) => {
        const bulan = moment(e).format("M");
        const tahun = moment(e).format("YYYY");
        setDate(e);
        router.push(
            {
                query: {
                    bulan,
                    tahun
                }
            },
            undefined,
            {
                scroll: false
            }
        );
    };

    const [showModal, setShowModal] = useState(false);
    const [id, setId] = useState();
    const [idPtt, setIdPtt] = useState();
    const [catatanAtasan, setCatatanAtasan] = useState("");
    const [namaPtt, setNamaPtt] = useState("");

    // modal untuk cuti
    const [showModalCuti, setShowModalCuti] = useState(false);
    const onCancelModalCuti = () => setShowModalCuti(false);

    const closeModal = () => setShowModal(false);
    const openModal = (row) => {
        if (row?.is_cuti) {
            setShowModalCuti(true);
            setId(row?.id_penilaian);
            setCatatanAtasan(row?.catatan);
            setIdPtt(row?.pegawai_id);
            setNamaPtt(row?.pegawai?.username);
        } else {
            setShowModal(true);
            setId(row?.id_penilaian);
            setCatatanAtasan(row?.catatan);
            setIdPtt(row?.pegawai_id);
            setNamaPtt(row?.pegawai?.username);
        }
    };

    useEffect(() => {
        if (router?.isReady) return null;
    }, [date, router?.isReady, query, idPtt]);

    const columns = [
        {
            key: "nomer",
            title: "No.",
            render: (_, row, index) => <div>{index + 1}</div>
        },
        {
            key: "foto",
            title: "Foto",
            render: (_, row) => <Avatar src={row?.pegawai?.image} />
        },
        {
            key: "nama",
            title: "Nama",
            render: (_, row) => <div>{row?.pegawai?.username}</div>
        },
        {
            key: "niptt",
            title: "NIPTT",
            render: (_, row) => <div>{row?.pegawai?.employee_number}</div>
        },
        {
            key: "sudah_verif",
            title: "Sudah Verif?",
            render: (_, row) => (
                <div>
                    {row?.sudah_verif ? <CheckOutlined /> : <CloseOutlined />}
                </div>
            )
        },
        {
            key: "detail",
            title: "Aksi",
            render: (_, row) => (
                <div>
                    <Button onClick={() => openModal(row)}>
                        Beri Nilai dan Verif
                    </Button>
                </div>
            )
        }
    ];

    return (
        <PageContainer
            title="Daftar Penilaian Bulanan"
            style={{ minHeight: "95vh" }}
            subTitle="PTTPK"
            content={
                <Alert
                    type="info"
                    message="Perhatian"
                    showIcon
                    description="Jika PTTPK dirasa sudah memilih anda sebagai atasan langsung akan tetapi tidak muncul, pastikan PTTPK yang bersangkutan mengaktifkan penilaiannya. Anda bisa memilih berdasarkan bulan dengan memilih Pilihan tanggal dibawah ini."
                />
            }
        >
            <FormApprovalModalCutin
                visible={showModalCuti}
                onCancel={onCancelModalCuti}
                bulan={moment(date).format("M")}
                tahun={moment(date).format("YYYY")}
                catatanAtasanLangsung={catatanAtasan}
                idPtt={idPtt}
                namaPtt={namaPtt}
                id={id}
            />

            <FormApprovalModal
                visible={showModal}
                onCancel={closeModal}
                catatanAtasanLangsung={catatanAtasan}
                idPtt={idPtt}
                namaPtt={namaPtt}
                id={id}
                bulan={moment(date).format("M")}
                tahun={moment(date).format("YYYY")}
            />
            <Skeleton loading={!router?.isReady}>
                <Card>
                    <AlertMantine title="Detail" mb="sm">
                        <Text size="sm">
                            Total Pegawai {dataPenilaianApproval?.length} orang
                        </Text>
                        <Text size="sm">
                            Pegawai verif{" "}
                            {
                                dataPenilaianApproval?.filter(
                                    (x) => !!x?.sudah_verif
                                )?.length
                            }{" "}
                            orang
                        </Text>
                        <Text size="sm">
                            Pegawai belum verif{" "}
                            {
                                dataPenilaianApproval?.filter(
                                    (x) => !x?.sudah_verif
                                )?.length
                            }{" "}
                            orang
                        </Text>
                    </AlertMantine>

                    <DatePicker.MonthPicker
                        onChange={handleChange}
                        allowClear={false}
                        value={date}
                    />
                    <Divider />
                    <Table
                        size="small"
                        rowKey={(row) =>
                            `${row?.id_penilaian}-${row?.bulan}-${row?.tahun}-${row?.custom_id_ptt}`
                        }
                        columns={columns}
                        dataSource={dataPenilaianApproval}
                        loading={loadingDataPenilaianApproval}
                        pagination={false}
                    />
                    <BackTop />
                </Card>
            </Skeleton>
        </PageContainer>
    );
}

Penilaian.Auth = {
    roles: ["USER"],
    groups: ["MASTER"]
};

Penilaian.getLayout = function getLayout(page) {
    return <ApprovalLayout>{page}</ApprovalLayout>;
};

export const getServerSideProps = async (ctx) => {
    const bulan = ctx?.query?.bulan || moment(new Date()).format("M");
    const tahun = ctx?.query?.tahun || moment(new Date()).format("YYYY");

    return {
        props: {
            data: {
                bulan,
                tahun
            }
        }
    };
};

export default Penilaian;
