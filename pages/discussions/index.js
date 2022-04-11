import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    CommentOutlined,
    MoreOutlined
} from "@ant-design/icons";
import { Avatar, Button, Card, Col, List, Row, Space, Typography } from "antd";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { getPosts } from "../../services/main.services";
import Layout from "../../src/components/Layout";

const PostLists = ({ data, loading }) => {
    const router = useRouter();

    const UpvoteDownvote = ({ votes }) => {
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

    const Title = ({ title }) => {
        return (
            <>
                <Typography.Paragraph>{title}</Typography.Paragraph>
            </>
        );
    };

    const CustomCard = ({ data }) => {
        return (
            <Card
                extra={[
                    <>
                        <Typography.Link>{data?.parent?.link}</Typography.Link>
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
                                {data?.created_at}
                            </Typography.Text>
                        </Space>
                    </div>
                }
                actions={[
                    <>
                        <Space>
                            <span>0 komentar</span>
                            <CommentOutlined />
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
                        <div>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: data?.content
                                }}
                            />
                        </div>
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
};

const Discussions = () => {
    const router = useRouter();

    const gotoCreatePost = () => {
        router.push("/discussions/submit");
    };

    const gotoCreateKomunitas = () => {
        router.push("/discussions/komunitas/create");
    };

    const { data: dataPosts, isLoading: loadingDataPosts } = useQuery(
        ["posts"],
        () => getPosts()
    );

    const UpvoteDownvote = () => {
        return (
            <div>
                <Space align="center" direction="vertical">
                    <ArrowUpOutlined style={{ cursor: "pointer" }} />
                    10
                    <ArrowDownOutlined style={{ cursor: "pointer" }} />
                </Space>
            </div>
        );
    };

    const Title = () => {
        return (
            <>
                <Typography.Paragraph>
                    Kenapa orang orang tidak melawan
                </Typography.Paragraph>
            </>
        );
    };

    return (
        <Layout>
            <Button onClick={gotoCreatePost}>Create Posts</Button>
            <Button onClick={gotoCreateKomunitas}>Create Komunitas</Button>
            <PostLists data={dataPosts} loading={loadingDataPosts} />
            <Row>
                <Col span={14}></Col>
            </Row>
        </Layout>
    );
};

export default Discussions;
