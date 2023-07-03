import { Table, Typography } from "antd";
import { round, sumBy } from "lodash";

function DataRealisasiPekerjaanAkhir({ data }) {
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
                dataSource={data?.listKegiatanTahunan}
                columns={columns}
                rowKey={(row) => row?.id}
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
                columns={columnsTugasTambahan}
                dataSource={data?.listPekerjaanTambahan}
                rowKey={(row) => row?.id}
                pagination={false}
                summary={() => (
                    <>
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0}>
                                <Typography.Title strong level={3}>
                                    {data?.nilai?.totalKegiatanTambahan}
                                </Typography.Title>
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    </>
                )}
            />
        </>
    );
}

export default DataRealisasiPekerjaanAkhir;
