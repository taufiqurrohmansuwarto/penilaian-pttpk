import { Card, List } from "antd";

const data = [
    "Biasakan sopan ketika berkomunikasi dengan orang lain",
    "Jangan membicarakan yang berhubungan dengan politik atau apapun itu",
    "No roasting",
    "No Flamming",
    "Jangan menggunakan akun orang lain untuk berkomunikasi",
    "Jangan menangkap layar (screenshot) untuk balas dendam"
];

function CardRules() {
    return (
        <Card size="small" title="Aturan dalam berdiskusi">
            <Card.Meta
                description={
                    <List
                        size="small"
                        dataSource={data}
                        renderItem={(item) => <List.Item>{item}</List.Item>}
                    />
                }
            />
        </Card>
    );
}

export default CardRules;
