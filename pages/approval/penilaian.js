import {
    Avatar,
    Button,
    Card,
    DatePicker,
    Divider,
    InputNumber,
    message,
    Modal,
    Skeleton,
    Space,
    Table
} from "antd";
import { random } from "lodash";
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

const FormApprovalModal = ({ id, bulan, tahun, onCancel, visible, idPtt }) => {
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

    useEffect(() => {
        if (status === "success") {
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
        { dataIndex: "title", title: "Deskripsi Pekerjaan" },
        { dataIndex: "kuantitas", title: "Kuantitas" },
        {
            dataIndex: "start",
            title: "Tanggal Mulai Pekerjaan",
            render: (_, row) => (
                <div>{moment(row?.start).format("DD-MM-YYYY")}</div>
            )
        },
        {
            dataIndex: "end",
            title: "Tanggal Akhir Pekerjaan",
            render: (_, row) => (
                <div>
                    {moment(row?.end).subtract(1, "days").format("DD-MM-YYYY")}
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
                data: kualitasValue,
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
            title="Pekerjaan Bulanan"
            okText="Update Kualitas"
            destroyOnClose
            confirmLoading={verifMutationApproval.isLoading}
            centered
            onCancel={onCancel}
            visible={visible}
            width={800}
            onOk={handleSubmit}
        >
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
                <Button onClick={handleSetRandomValue}>Random</Button>
            </Space>

            <Table
                pagination={false}
                columns={columns}
                loading={isLoading}
                dataSource={data?.kinerja_bulanan}
                rowKey={(row) => row?.id}
            />
        </Modal>
    );
};

// hehe patut di contoh
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

    const closeModal = () => setShowModal(false);
    const openModal = (row) => {
        setShowModal(true);
        setId(row?.id_penilaian);
        setIdPtt(row?.pegawai_id);
    };

    useEffect(() => {
        if (router?.isReady) return null;
    }, [date, router?.isReady, query, idPtt]);

    const columns = [
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
            render: (_, row) => <div>{JSON.stringify(row?.sudah_verif)}</div>
        },
        {
            key: "detail",
            title: "Nilai dan ACC",
            render: (_, row) => (
                <div>
                    <Button onClick={() => openModal(row)}>
                        Nilai dan ACC
                    </Button>
                </div>
            )
        }
    ];

    return (
        <ApprovalLayout title="Daftar Penilaian">
            <FormApprovalModal
                visible={showModal}
                onCancel={closeModal}
                idPtt={idPtt}
                id={id}
                bulan={moment(date).format("M")}
                tahun={moment(date).format("YYYY")}
            />
            <Skeleton loading={!router?.isReady}>
                <Card>
                    <DatePicker.MonthPicker
                        onChange={handleChange}
                        allowClear={false}
                        value={date}
                    />
                    <Divider />
                    <Table
                        rowKey={(row) =>
                            `${row?.id_penilaian}-${row?.bulan}-${row?.tahun}-${row?.custom_id_ptt}`
                        }
                        columns={columns}
                        dataSource={dataPenilaianApproval}
                        loading={loadingDataPenilaianApproval}
                    />
                </Card>
            </Skeleton>
        </ApprovalLayout>
    );
}

Penilaian.Auth = {
    roles: ["USER"],
    groups: ["MASTER"]
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
