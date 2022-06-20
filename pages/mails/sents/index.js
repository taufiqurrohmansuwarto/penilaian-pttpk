import { Table, Typography } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "react-query";
import { getMail } from "../../../services/main.services";
import MailLayout from "../../../src/components/CustomLayout/MaiLayout";
import Layout from "../../../src/components/Layout";

const MailTable = ({ data, loading, handleChangePage }) => {
    const router = useRouter();

    const gotoDetail = (id) => {
        router.push(`/mails/sents/${id}`);
    };

    const columns = [
        {
            title: "Ke",
            dataIndex: "name",
            width: 250,
            render: (_, row) => (
                <Typography.Text ellipsis>
                    {row?.users_messages_mapped[0]?.user?.username}
                </Typography.Text>
            )
        },
        { title: "Subyek", dataIndex: "subject", key: "subject" },
        {
            title: "Pesan",
            dataIndex: "body",
            render: (_, row) => (
                <Typography.Text ellipsis style={{ width: 500 }}>
                    <div dangerouslySetInnerHTML={{ __html: row?.body }} />
                </Typography.Text>
            )
        },
        {
            title: "Tgl. Kirim",
            dataIndex: "waktu",
            width: 150,
            render: (_, row) => (
                <Typography.Text>
                    {moment(row?.date).format("lll")}
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
                loading={loading}
                columns={columns}
                size="small"
                dataSource={data?.result}
            />
        </>
    );
};

function Sents() {
    const [query, setQuery] = useState({
        offset: 0,
        limit: 50
    });

    const { data, isLoading } = useQuery(
        ["mails", "sent"],
        () =>
            getMail({
                type: "sent",
                offset: query?.offset,
                limit: query?.limit
            }),
        {
            enabled: !!Boolean(query)
        }
    );

    const handleChangePage = (page, pageSize) => {
        setQuery({ ...query, offset: page * pageSize - query?.limit });
    };

    return (
        <MailTable
            loading={isLoading}
            data={data}
            handleChangePage={handleChangePage}
        />
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
