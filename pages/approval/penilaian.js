import {
    Button,
    Card,
    DatePicker,
    Divider,
    InputNumber,
    message,
    Modal,
    Skeleton,
    Table
} from "antd";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import {
    getPenilaianApproval,
    getPenilaianBulananApproval
} from "../../services/approval.service";
import ApprovalLayout from "../../src/components/ApprovalLayout";

const FormApprovalModal = ({ id, bulan, tahun, onCancel, visible }) => {
    const { data, isLoading, status } = useQuery(
        ["approval_penilaian_bulanan", `${id}${bulan}${tahun}`],
        () => getPenilaianBulananApproval({ id, bulan, tahun }),
        {
            enabled: !!id && !!bulan && !!tahun
        }
    );

    const [kualitasValue, setKualitasValue] = useState([]);

    useEffect(() => {
        if (status === "success") {
            setKualitasValue(
                data?.kinerja_bulanan?.map((k) => ({
                    id: k?.id,
                    id_penilaian: k?.id_penilaian,
                    tahun: k?.tahun,
                    bulan: k?.bulan,
                    kualitas: k?.kualitas
                }))
            );
        }
    }, [status, data]);

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
            key: "penilaian",
            title: "Penilaian",
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

    const verifMutationApproval = useMutation();
    const handleSubmit = () => {
        const hasZero = kualitasValue?.some((x) => x?.kualitas === 0);
        if (hasZero) {
            message.error(
                "Masih ada yang belum dinilai. Sepertinya ada kualitas yang masih 0"
            );
        }
    };

    return (
        <Modal
            centered
            onCancel={onCancel}
            visible={visible}
            width={800}
            onOk={handleSubmit}
        >
            <Table
                pagination={false}
                columns={columns}
                loading={isLoading}
                dataSource={data?.kinerja_bulanan}
                rowKey={(row) => row?.id}
            />
            <div>{JSON.stringify(kualitasValue)}</div>
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

    const closeModal = () => setShowModal(false);
    const openModal = (id) => {
        setShowModal(true);
        setId(id);
    };

    useEffect(() => {
        if (router?.isReady) return null;
    }, [date, router?.isReady]);

    const columns = [
        {
            key: "nama",
            title: "Nama",
            render: (_, row) => <div>{row?.user_ptt?.username}</div>
        },
        {
            key: "detail",
            title: "Detail",
            render: (_, row) => (
                <div>
                    <Button onClick={() => openModal(row?.id_penilaian)}>
                        Detail
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
