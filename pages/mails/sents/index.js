import { Avatar, Card, List, Typography } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import { getMail } from "../../../services/main.services";
import MailLayout from "../../../src/components/CustomLayout/MaiLayout";
import Layout from "../../../src/components/Layout";

function Sents() {
    const { data, isLoading } = useQuery(["mails", "sent"], () =>
        getMail("sent")
    );

    const router = useRouter();

    const gotoDetail = (id) => {
        router.push(`/mails/sents/${id}`);
    };

    return (
        <Card title="Pesan Terkirim">
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
                                avatar={
                                    <Avatar
                                        src={
                                            item?.users_messages_mapped[0]?.user
                                                ?.image
                                        }
                                    />
                                }
                                title={
                                    item?.users_messages_mapped[0]?.user
                                        ?.username
                                }
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

Sents.getLayout = function getLayout(page) {
    return (
        <Layout disableContentMargin={true}>
            <MailLayout>{page}</MailLayout>
        </Layout>
    );
};

Sents.Auth = {
    roles: ["USER", "FASILITATOR", "ADMIN"],
    groups: ["PTTPK", "MASTER"]
};

export default Sents;
