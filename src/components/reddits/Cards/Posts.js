import moment from "moment";
import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    CommentOutlined,
    NotificationOutlined
} from "@ant-design/icons";
import { Avatar, Card, List, Space, Typography } from "antd";
import { useRouter } from "next/router";
import ReactShowMoreText from "react-show-more-text";

function Posts({ data, loading }) {
    const router = useRouter();

    const UpvoteDownvote = ({ votes }) => {
        return (
            <div>
                <Space align="center" direction="vertical">
                    <ArrowUpOutlined
                        style={{ cursor: "pointer", color: "#eb2f96" }}
                    />
                    {votes}
                    <ArrowDownOutlined style={{ cursor: "pointer" }} />
                </Space>
            </div>
        );
    };

    const Title = ({ title }) => {
        return (
            <>
                <Typography.Paragraph>{title}</Typography.Paragraph>
            </>
        );
    };

    const CustomCard = ({ data }) => {
        const gotoLink = () => {
            router?.push(`/discussions${data?.parent?.link}`);
        };

        const gotoComments = (id) => {
            router?.push(`/discussions/${id}/comments`);
        };

        return (
            <Card
                extra={[
                    <>
                        <Typography.Link onClick={gotoLink}>
                            {data?.parent?.link}
                        </Typography.Link>
                    </>
                ]}
                title={
                    <div style={{ fontWeight: "normal", fontSize: 14 }}>
                        <Space align="start">
                            <Avatar size="default" src={data?.user?.image} />
                            <Typography.Text>
                                {data?.user?.username}
                            </Typography.Text>
                            <Typography.Text type="secondary">
                                {moment(data?.created_at).fromNow()}
                            </Typography.Text>
                        </Space>
                    </div>
                }
                actions={[
                    <>
                        <Space onClick={() => gotoComments(data?.id)}>
                            <span>{data?.votes} komentar</span>
                            <CommentOutlined />
                        </Space>
                    </>,
                    <>
                        <Space>
                            <span>Notif</span>
                            <NotificationOutlined />
                        </Space>
                    </>
                ]}
            >
                <Card.Meta
                    avatar={
                        <>
                            <Space align="start">
                                <div style={{ marginRight: 8 }}>
                                    <UpvoteDownvote votes={data?.votes} />
                                </div>
                            </Space>
                        </>
                    }
                    title={<Title title={data?.title} />}
                    description={
                        <ReactShowMoreText lines={14}>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: data?.content
                                }}
                            />
                        </ReactShowMoreText>
                    }
                />
            </Card>
        );
    };

    return (
        <List
            grid={{
                column: 1,
                gutter: [10, 10]
            }}
            loading={loading}
            dataSource={data}
            rowKey={(row) => row?.id}
            renderItem={(item) => <CustomCard data={item} />}
        />
    );
}

export default Posts;
