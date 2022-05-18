import { Table, Typography } from "antd";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import { getMail } from "../../../services/main.services";
import MailLayout from "../../../src/components/CustomLayout/MaiLayout";
import Layout from "../../../src/components/Layout";
import { capitalCase } from "../../../utils/utility";
import moment from "moment";

const MailTable = ({ data, loading }) => {
    const router = useRouter();

    const gotoDetail = (id) => {
        router.push(`/mails/sents/${id}`);
    };

    const columns = [
        {
            title: "Dari",
            dataIndex: "name",
            width: 250,
            render: (_, row) => (
                <Typography.Text strong ellipsis>
                    {capitalCase(row?.users_messages_mapped[0]?.user?.username)}
                </Typography.Text>
            )
        },
        {
            title: "Pesan",
            dataIndex: "body",
            render: (_, row) => (
                <Typography.Text strong ellipsis style={{ width: 500 }}>
                    {row?.body}
                </Typography.Text>
            )
        },
        {
            title: "Waktu",
            dataIndex: "waktu",
            width: 150,
            render: (_, row) => (
                <Typography.Text strong>
                    {moment(row?.date).format("l")}
                </Typography.Text>
            )
        },
        {
            title: "Aksi",
            dataIndex: "aksi",
            width: 100,
            render: (_, row) => (
                <Typography.Link onClick={() => gotoDetail(row?.id)}>
                    Lihat
                </Typography.Link>
            )
        }
    ];

    return (
        <>
            <Table
                rowKey={(row) => row?.id}
                rowSelection
                loading={loading}
                columns={columns}
                size="small"
                dataSource={data}
                pagination={false}
            />
        </>
    );
};

function Sents() {
    const { data, isLoading } = useQuery(["mails", "sent"], () =>
        getMail("sent")
    );

    return <MailTable loading={isLoading} data={data} />;
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
