import { Avatar, Card, List, Typography } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import { getMail } from "../../../services/main.services";
import MailLayout from "../../../src/components/CustomLayout/MaiLayout";
import Layout from "../../../src/components/Layout";
function Mails() {
    const { data, isLoading } = useQuery(["mails", "inbox"], () =>
        getMail("inbox")
    );

    const router = useRouter();

    const gotoDetail = (id) => {
        router.push(`/mails/inbox/${id}`);
    };

    return (
        <Card title="Inbox">
            <List
                dataSource={data}
                loading={isLoading}
                key="id"
                size="small"
                itemLayout="horizontal"
                renderItem={(item) => {
                    return (
                        <List.Item
                            actions={[
                                <span>{moment(item?.data).format("lll")}</span>,
                                <a onClick={() => gotoDetail(item?.id)}>
                                    lihat
                                </a>
                            ]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={item?.author?.image} />}
                                title={item?.author?.username}
                                description={
                                    <Typography.Paragraph ellipsis={true}>
                                        {item?.body}
                                    </Typography.Paragraph>
                                }
                            />
                        </List.Item>
                    );
                }}
            />
        </Card>
    );
}

Mails.getLayout = function getLayout(page) {
    return (
        <Layout disableContentMargin={true}>
            <MailLayout>{page}</MailLayout>
        </Layout>
    );
};

Mails.Auth = {
    roles: ["USER", "FASILITATOR"],
    groups: ["PTTPK", "MASTER"]
};

export default Mails;
