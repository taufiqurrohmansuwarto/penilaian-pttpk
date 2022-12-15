import { Table } from "antd";
import { useQuery } from "react-query";
import { riwayatPenilaianByNIPTT } from "../../services/approval.service";

function RiwayatPenilaianByNIPTT({ id }) {
    const { data, isLoading } = useQuery(["riwayat-penilaian", id], () =>
        riwayatPenilaianByNIPTT(id)
    );

    const columns = [
        { dataIndex: "tahun", title: "Tahun", key: "tahun" },
        { dataIndex: "nilai", title: "Nilai", key: "nilai" },
        { dataIndex: "rekomendasi", title: "Rekomendasi", key: "rekomendasi" }
    ];

    return (
        <>
            <Table
                bordered
                style={{ marginBottom: 20 }}
                columns={columns}
                title={() => "Riwayat Penilaian PTT"}
                dataSource={data}
                rowKey={(row) => row?.id}
                loading={isLoading}
                pagination={false}
            />
        </>
    );
}

export default RiwayatPenilaianByNIPTT;
