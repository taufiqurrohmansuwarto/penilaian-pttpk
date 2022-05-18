import moment from "moment";
import {
    Avatar,
    Card,
    Col,
    List,
    Row,
    Skeleton,
    Space,
    Tag,
    Typography
} from "antd";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
    readAllNotifications,
    readNotificationById
} from "../../services/main.services";
import Layout from "../../src/components/Layout";
import NotificationLayout from "../../src/components/NotificationLayout";

const CustomDescription = ({ item }) => {
    let kata;

    if (item?.type === "replied") {
        kata = " mengomentari status anda";
    }
    if (item?.type === "replied-comment") {
        kata = ` mengomentari status ${item?.comments?.user?.username}`;
    }
    if (item?.type === "mention") {
        kata = ` memanggil anda`;
    }

    return (
        <Typography.Text type="secondary">
            {item?.user_sender_notification?.username}
            {kata}
        </Typography.Text>
    );
};

const ListNotif = ({
    data,
    handleReadAllNotification,
    handleReadAllNotificationById
}) => {
    const router = useRouter();

    const gotoDetail = async (item) => {
        router.push(`/feeds/${item?.comment_id}`);
        await handleReadAllNotificationById(item?.id);
    };

    return (
        <Card>
            <List
                header={
                    <>
                        {data?.total !== 0 && (
                            <Typography.Link
                                onClick={handleReadAllNotification}
                            >
                                Tandai semua sebagai telah dibaca
                            </Typography.Link>
                        )}
                    </>
                }
                size="small"
                dataSource={data?.result}
                rowKey={(row) => row?.id}
                key="id"
                itemLayout="vertical"
                renderItem={(item) => (
                    <List.Item
                        key={item?.id}
                        extra={[
                            <Space>
                                <Typography.Text type="secondary">
                                    {moment(item?.created_at).fromNow()}
                                </Typography.Text>
                                {!item?.is_read && (
                                    <Tag color="green">Baru</Tag>
                                )}
                            </Space>
                        ]}
                        style={{ cursor: "pointer" }}
                        onClick={() => gotoDetail(item)}
                    >
                        <List.Item.Meta
                            avatar={
                                <Avatar
                                    src={item?.user_sender_notification?.image}
                                />
                            }
                            // title={<CustomDescription item={item} />}
                            description={<CustomDescription item={item} />}
                        />
                        {/* <CustomDescription item={item} />  */}
                    </List.Item>
                )}
            />
        </Card>
    );
};

function Comments() {
    const { data, isLoading } = useQuery(["notifications-feedbacks"], () =>
        getNotifications()
    );

    const queryClient = useQueryClient();

    const readAllNotificationMutation = useMutation(
        () => readAllNotifications(),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["notifications-feedbacks"]);
            }
        }
    );
    const readNotificationByIdMutation = useMutation(
        (data) => readNotificationById(data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["notifications-feedbacks"]);
            }
        }
    );

    const handleReadAllNotification = () => {
        readAllNotificationMutation.mutate();
    };

    const handleReadAllNotificationById = async (id) => {
        await readNotificationByIdMutation.mutateAsync(id);
    };

    return (
        <Layout>
            <NotificationLayout activeKey={"feedbacks"}>
                <Row>
                    <Col span={24}>
                        <Skeleton loading={isLoading}>
                            <ListNotif
                                handleReadAllNotification={
                                    handleReadAllNotification
                                }
                                handleReadAllNotificationById={
                                    handleReadAllNotificationById
                                }
                                data={data}
                            />
                        </Skeleton>
                    </Col>
                </Row>
            </NotificationLayout>
        </Layout>
    );
}

Comments.Auth = {
    roles: ["USER", "FASILITATOR", "ADMIN"],
    groups: ["MASTER", "PTTPK"]
};

export default Comments;
