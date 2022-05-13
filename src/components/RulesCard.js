import { Card, List } from "antd";
import React from "react";

const rules = [
    { key: 1, title: "Tidak boleh ada unsur pornografi" },
    { key: 2, title: "Tidak boleh ada unsur kekerasan" },
    { key: 3, title: "Tidak boleh ada unsur pembulian" },
    { key: 4, title: "Tidak boleh ada spam" },
    { key: 5, title: "Tidak boleh ada unsur SARA / Politik" },
    { key: 6, title: "Tidak men-share aib" },
    { key: 7, title: "Tidak boleh menggunakan akun orang lain" }
];

function RulesCard() {
    return (
        <Card title="Peraturan Berbicara di public">
            <List
                dataSource={rules}
                key="key"
                renderItem={(item) => <List.Item>{item?.title}</List.Item>}
            />
        </Card>
    );
}

export default RulesCard;
