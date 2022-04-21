import { Card, Divider, Skeleton, Table } from "antd";
import { sumBy } from "lodash";
import { useQuery } from "react-query";
import { getPenilaianAktif } from "../../../services/users.service";
import UserLayout from "../../../src/components/UserLayout";

const DataTargetPenilaian = ({ data }) => {
    const columns = [
        { dataIndex: "pekerjaan", title: "Pekerjaan", key: "pekerjaan" },
        { dataIndex: "kuantitas", title: "Kuantitas", key: "kuantitas" },
        {
            key: "satuan",
            title: "Satuan",
            render: (_, row) => row?.ref_satuan_kinerja?.nama
        },
        {
            key: "capaian",
            title: "Capaian",
            render: (_, row) => {
                return <div>{sumBy(row?.kinerja_bulanan, "kuantitas")}</div>;
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
        useQuery(["penilaian-aktif"], () => getPenilaianAktif(), {
            refetchOnWindowFocus: false
        });

    return (
        <UserLayout>
            <Skeleton loading={isLoadingDataPenilaianAktif}>
                <Card>
                    <Card.Meta title="Penilaian Akhir" />
                    <Divider />
                    <DataTargetPenilaian
                        data={dataPenilaianAktif?.target_penilaian}
                    />
                </Card>
            </Skeleton>
        </UserLayout>
    );
}

export default PenilaianAkhir;
