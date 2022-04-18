import { DatePicker, Skeleton, Table } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { getRefSatuanKinerja } from "../../../services/ref.service";
import {
    createPenilaianBulanan,
    getPenilaianAktif,
    getPenilaianBulanan,
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

const Penilaian = ({ tahun, bulan }) => {
    useEffect(() => {}, [bulan, tahun]);

    const { data: dataPenilaian, isLoading: isLoadingDataPenilaian } = useQuery(
        ["data-penilaian", bulan, tahun],
        () => getPenilaianBulanan(bulan, tahun),
        {
            enabled: !!bulan && !!tahun
        }
    );

    const createPenilaianBulananMutation = useMutation((data) =>
        createPenilaianBulanan(data)
    );
    const updatePenilaianBulannanMutation = useMutation((data) =>
        updatePenilaianBulanan(data)
    );
    const removePenilaianBulananMutation = useMutation((data) =>
        hapusPenilaianBulanan(data)
    );

    // todo create column and custom keys
    const columns = [];

    const {
        data: dataTargetPenilaian,
        isLoading: isLoadingDataTargetPenilaian
    } = useQuery(["target_penilaian"], () => getRefSatuanKinerja("target"));

    return (
        <Skeleton
            loading={isLoadingDataPenilaian || isLoadingDataTargetPenilaian}
        >
            {JSON.stringify(dataTargetPenilaian)}
            {JSON.stringify(dataPenilaian)}
            <Table
                title={() => "Header"}
                footer={() => "Footer"}
                dataSource={dataPenilaian}
                rowKey={(row) => row?.id}
            />
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
        <UserLayout title="Hello world">
            <DatePicker.MonthPicker
                defaultValue={moment(`${tahun}-${bulan}`)}
                onChange={handleChange}
            />
            {/* <DataPenilaianAktif /> */}
            <Penilaian tahun={tahun} bulan={bulan} />
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

BulananBaru.auth = {
    groups: ["PTTPK"],
    roles: ["USER"]
};

export default BulananBaru;
