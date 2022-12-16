import { Table } from "antd";

function RiwayatPenilaianByNIPTT({ data, loading }) {
    const columns = [
        { dataIndex: "tahun", title: "Tahun", key: "tahun" },
        { dataIndex: "nilai", title: "Nilai", key: "nilai" },
        { dataIndex: "rekomendasi", title: "Rekomendasi", key: "rekomendasi" }
    ];

    return (
        <Table
            style={{ marginBottom: 20 }}
            columns={columns}
            title={() => "Riwayat Penilaian PTT"}
            dataSource={data}
            rowKey={(row) => row?.id}
            loading={loading}
            pagination={false}
        />
    );
}

export default RiwayatPenilaianByNIPTT;
