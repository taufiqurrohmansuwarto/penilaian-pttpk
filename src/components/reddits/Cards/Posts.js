import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    CommentOutlined
} from "@ant-design/icons";
import { Card, List, Space } from "antd";

function Posts({ posts }) {
    return (
        <List
            rowKey={(row) => row?.id}
            dataSource={posts}
            grid={{
                gutter: [8, 8],
                column: 1
            }}
            renderItem={(item) => {
                return (
                    <Card
                        style={{ maxHeight: 500, cursor: "pointer" }}
                        actions={[
                            <div>
                                <CommentOutlined />
                                <span style={{ marginLeft: 8 }}>
                                    500 komentar
                                </span>
                            </div>
                        ]}
                    >
                        <Card.Meta
                            description={
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: item?.content
                                    }}
                                />
                            }
                            title="Hello world"
                        />
                    </Card>
                );
            }}
        />
    );
}

export default Posts;
