import { Avatar, Card, List } from "antd";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { dashboardDiscussions } from "../../../../services/main.services";

function TopDiscussions() {
    const { data, isLoading } = useQuery(["top-discussions"], () =>
        dashboardDiscussions("ramai")
    );

    const router = useRouter();

    const gotoDetail = (id) => {
        router.push(`/discussions/${id}/comments`);
    };

    return (
        <Card size="small" title="Diskusi Paling Ramai" loading={isLoading}>
            <List
                dataSource={data}
                loading={isLoading}
                size="small"
                rowKey={(row) => row?.id}
                renderItem={(item) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={item?.user?.image} />}
                            title={
                                <div
                                    style={{ cursor: "pointer" }}
                                    onClick={() => gotoDetail(item?.id)}
                                >
                                    {item?.title}
                                </div>
                            }
                            description={`oleh ${item?.user?.username}`}
                        />
                    </List.Item>
                )}
            />
        </Card>
    );
}

export default TopDiscussions;
