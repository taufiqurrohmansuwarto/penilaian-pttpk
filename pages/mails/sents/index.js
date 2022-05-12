import { Avatar, Card, List } from "antd";
import moment from "moment";
import React from "react";
import { useQuery } from "react-query";
import { getMail } from "../../../services/main.services";
import MailLayout from "../../../src/components/CustomLayout/MaiLayout";
import Layout from "../../../src/components/Layout";

function Sents() {
    const { data, isLoading } = useQuery(["mails", "sent"], () =>
        getMail("sent")
    );

    const gotoDetail = (id) => {
        router.push("/mails/sents/", id);
    };

    return (
        <Card title="Pesan Terkirim">
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
                                <a onClick={() => gotoDetail(id)}>lihat</a>
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

Sents.getLayout = function getLayout(page) {
    return (
        <Layout disableContentMargin={true}>
            <MailLayout>{page}</MailLayout>
        </Layout>
    );
};

Sents.Auth = {
    roles: ["USER", "FASILITATOR"],
    groups: ["PTTPK", "MASTER"]
};

export default Sents;
