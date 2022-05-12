import { Avatar, List, Card } from "antd";
import React from "react";
import { useQuery } from "react-query";
import moment from "moment";
import { getMail } from "../../../services/main.services";
import Layout from "../../../src/components/Layout";
import MailLayout from "../../../src/components/CustomLayout/MaiLayout";
import { Star } from "tabler-icons-react";

function Mails() {
    const { data, isLoading } = useQuery(["mails", "inbox"], () =>
        getMail("inbox")
    );

    return (
        <Card title="Inbox">
            <List
                dataSource={data}
                loading={isLoading}
                key="id"
                itemLayout="horizontal"
                renderItem={(item) => {
                    return (
                        <List.Item
                            actions={[
                                <span>{moment(item?.data).format("lll")}</span>,
                                <span>Lihat</span>,
                                <Star />
                            ]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={item?.author?.image} />}
                                title={item?.author?.username}
                                description={item?.body}
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
