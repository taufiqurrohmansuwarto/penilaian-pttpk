import { Card, List } from "antd";

const data = [
    "Biasakan sopan ketika berkomunikasi dengan orang lain",
    "Jangan membicarakan yang berhubungan dengan politik atau apapun itu",
    "No roasting",
    "No Flamming"
];

function CardRules() {
    return (
        <Card>
            <Card.Meta
                title="Aturan dalam berdiskusi"
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
