import { Avatar, Card, List, Skeleton, Space, Tag, Typography } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
    getNotificationDiscussions,
    readAllNotificationDiscussions,
    readNotificationDiscussionById
} from "../../services/main.services";
import Layout from "../../src/components/Layout";
import NotificationLayout from "../../src/components/NotificationLayout";

const CustomDescription = ({ item }) => {
    return (
        <Typography.Text type="secondary">
            {item?.user_sender_notification?.username} mengomentari di diskusi{" "}
            {item?.discussion?.parent_comments?.title}
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
        const id = item?.discussion?.parent_comments?.id;
        router.push(
            `/discussions/${id}/comments?target=${item?.discussion_post_id}`
        );
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
                            description={<CustomDescription item={item} />}
                        />
                    </List.Item>
                )}
            />
        </Card>
    );
};

function Discussions() {
    const { data, isLoading } = useQuery(["notifications-discussions"], () =>
        getNotificationDiscussions()
    );

    const queryClient = useQueryClient();

    const readAllNotificationMutation = useMutation(
        () => readAllNotificationDiscussions(),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["notifications-discussions"]);
            }
        }
    );
    const readNotificationByIdMutation = useMutation(
        (data) => readNotificationDiscussionById(data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["notifications-discussions"]);
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
        <NotificationLayout activeKey={"discussions"}>
            <Skeleton loading={isLoading}>
                <ListNotif
                    data={data}
                    handleReadAllNotification={handleReadAllNotification}
                    handleReadAllNotificationById={
                        handleReadAllNotificationById
                    }
                />
            </Skeleton>
        </NotificationLayout>
    );
}

Discussions.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

Discussions.Auth = {
    roles: ["USER", "FASILITATOR", "ADMIN"],
    groups: ["MASTER", "PTTPK"]
};

export default Discussions;
