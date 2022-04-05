import {
    Button,
    Card,
    DatePicker,
    Divider,
    InputNumber,
    Modal,
    Skeleton,
    Table
} from "antd";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import {
    getPenilaianApproval,
    getPenilaianBulananApproval
} from "../../services/approval.service";
import ApprovalLayout from "../../src/components/ApprovalLayout";

const FormApprovalModal = ({ id, bulan, tahun }) => {
    const { data, isLoading, status } = useQuery(
        ["approval_penilaian_bulanan", `${id}${bulan}${tahun}`],
        () => getPenilaianBulananApproval({ id, bulan, tahun })
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
        { dataIndex: "start", title: "Tanggal Mulai Pekerjaan" },
        { dataIndex: "end", title: "Tanggal Akhir Pekerjaan" },
        {
            key: "penilaian",
            title: "Penilaian",
            render: (_, row) => (
                <InputNumber
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

    return (
        <div>
            <Table
                pagination={false}
                columns={columns}
                loading={isLoading}
                dataSource={data?.kinerja_bulanan}
                rowKey={(row) => row?.id}
            />
            <div>{JSON.stringify(kualitasValue)}</div>
        </div>
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

    const { data } = useSession();

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

    const Nama = (_, row) => <div>{row?.user_ptt?.nama}</div>;

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
            <Modal
                destroyOnClose
                visible={showModal}
                onCancel={closeModal}
                centered
                width={800}
            >
                <FormApprovalModal
                    id={id}
                    bulan={moment(date).format("M")}
                    tahun={moment(date).format("YYYY")}
                />
            </Modal>
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
