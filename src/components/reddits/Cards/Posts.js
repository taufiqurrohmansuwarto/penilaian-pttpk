import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    BellOutlined,
    CommentOutlined
} from "@ant-design/icons";
import { Button, Avatar, Card, List, Space, Typography } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import ReactShowMoreText from "react-show-more-text";

const UpvoteDownvote = ({ votes, id }) => {
    return (
        <div>
            <Space align="center" direction="vertical">
                <ArrowUpOutlined style={{ cursor: "pointer" }} />
                {votes}
                <ArrowDownOutlined style={{ cursor: "pointer" }} />
            </Space>
        </div>
    );
};

function Posts({ data, loading, isFetchingNextPage }) {
    const router = useRouter();

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
                            <span>
                                {data?._count?.children_comments} komentar
                            </span>
                            <CommentOutlined />
                        </Space>
                    </>,
                    <>
                        <Space>
                            <span>Beritahu</span>
                            <BellOutlined />
                        </Space>
                    </>
                ]}
            >
                <Card.Meta
                    avatar={
                        <>
                            <Space align="start">
                                <div style={{ marginRight: 8 }}>
                                    <UpvoteDownvote
                                        id={data?.id}
                                        votes={data?.votes}
                                    />
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
        <div style={{ marginTop: 10 }}>
            <List
                grid={{
                    column: 1,
                    gutter: [10, 10]
                }}
                loading={loading || isFetchingNextPage}
                dataSource={data}
                rowKey={(row) => row?.id}
                renderItem={(item) => {
                    return <CustomCard data={item} />;
                }}
            />
        </div>
    );
}

export default Posts;
