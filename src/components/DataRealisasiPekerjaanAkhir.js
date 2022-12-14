import { Divider, Table, Typography } from "antd";
import { round, sumBy } from "lodash";
import { useQuery } from "react-query";
import { getPenilaianAkhirDetail } from "../../services/approval.service";

function DataRealisasiPekerjaanAkhir({ id, tahun }) {
    const { data, isLoading: loading } = useQuery(
        ["detail-penilaian-akhir", id, tahun],
        () => getPenilaianAkhirDetail({ id, tahun })
    );

    const columnsTugasTambahan = [
        { dataIndex: "title", title: "Judul Pekerjaan", key: "title" }
    ];

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
                        {round(
                            (sumBy(record?.kinerja_bulanan, "kuantitas") /
                                record?.kuantitas) *
                                100,
                            2
                        )}{" "}
                        %
                    </div>
                );
            }
        }
    ];

    return (
        <>
            <Table
                bordered
                title={() => "Data Realisasi Pekerjaan Akhir"}
                dataSource={data?.listKegiatanTahunan}
                columns={columns}
                rowKey={(row) => row?.id}
                loading={loading}
                pagination={false}
                summary={() => (
                    <>
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0}>
                                Rerata
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={1} colSpan={4}>
                                <Typography.Title level={3} strong>
                                    {data?.nilai?.totalPenilaianPekerjaan} %
                                </Typography.Title>
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    </>
                )}
            />
            <Table
                style={{ marginTop: 20 }}
                bordered
                columns={columnsTugasTambahan}
                title={() => "Pekerjaan Tambahan"}
                dataSource={data?.listPekerjaanTambahan}
                loading={loading}
                rowKey={(row) => row?.id}
                pagination={false}
                summary={() => (
                    <>
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0}>
                                <Typography.Title strong level={3}>
                                    Total {data?.nilai?.totalKegiatanTambahan}
                                </Typography.Title>
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    </>
                )}
            />
            <Divider>Total Nilai Capaian Kinerja</Divider>
            <Typography.Title strong level={3} style={{ color: "green" }}>
                {round(
                    data?.nilai?.totalPenilaianPekerjaan +
                        data?.nilai?.totalKegiatanTambahan,
                    2
                )}
            </Typography.Title>
        </>
    );
}

export default DataRealisasiPekerjaanAkhir;
