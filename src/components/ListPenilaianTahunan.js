import { Alert, Table } from "antd";
import React from "react";
import { useQuery } from "react-query";
import { listPenilaian } from "../../services/users.service";

function ListPenilaianTahunan() {
    const { data, isLoading } = useQuery(["penilaian-tahunan"], () =>
        listPenilaian()
    );

    const columns = [
        { title: "Tahun", dataIndex: "tahun", key: "tahun" },
        { title: "Nilai", dataIndex: "nilai", key: "nilai" },
        { title: "Rekomendasi", dataIndex: "rekomendasi", key: "rekomendasi" }
    ];

    return (
        <div>
            <Alert
                type="info"
                description="Pastikan nilai anda naik dari tahun ke tahun"
                message="Perhatian"
                showIcon
                style={{ marginBottom: 10 }}
            />
            <Table
                pagination={false}
                columns={columns}
                loading={isLoading}
                dataSource={data}
                rowKey={(row) => row?.id_ptt_penilaian}
            />
        </div>
    );
}

export default ListPenilaianTahunan;
