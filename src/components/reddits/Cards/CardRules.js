import { Card, List } from "antd";

const data = [
    "Biasakan sopan ketika berkomunikasi dengan orang lain",
    "Jangan membicarakan yang berhubungan dengan politik atau apapun itu",
    "No roasting",
    "No Flamming",
    "Jangan menggunakan akun orang lain untuk berkomunikasi",
    "Jangan menangkap layar (screenshot) untuk balas dendam"
];

function CardRules({ rules }) {
    return (
        <Card size="small" title="Aturan dalam berdiskusi">
            {JSON.stringify(rules)}
            {/* <Card.Meta
                description={
                    <List
                        size="small"
                        dataSource={rules}
                        renderItem={(item) => (
                            <List.Item>{JSON.stringify(item)}</List.Item>
                        )}
                    />
                }
            /> */}
        </Card>
    );
}

export default CardRules;
