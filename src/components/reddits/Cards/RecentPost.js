import { Card, List } from "antd";

function RecentPost() {
    const rawData = [
        { id: 1, title: "test", totalComments: 180, created_at: 10 },
        {
            id: 2,
            title: "test",
            totalComments: 180,
            created_at: 10
        },
        {
            id: 3,
            title: "test",
            totalComments: 180,
            created_at: 10
        }
    ];

    return (
        <Card title="Postingan Terbaru">
            <List
                dataSource={rawData}
                rowKey={(row) => row?.id}
                renderItem={(item) => <div>item</div>}
            />
        </Card>
    );
}

export default RecentPost;
