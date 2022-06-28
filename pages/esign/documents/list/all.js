// ini adalah halaman esign
import { Avatar, Table, Tag, Tooltip, Typography } from "antd";
import moment from "moment";
import { useState } from "react";
import { useQuery } from "react-query";
import { getDocuments } from "../../../../services/esign.service";
import EsignLayout from "../../../../src/components/Layout/EsignLayout";
import PageContainer from "../../../../src/components/PageContainer";
import { documentStatus, recipientStatus } from "../../../../src/utils/util";

const MyToolTip = ({ recipient }) => {
    return (
        <>
            <Typography.Paragraph ellipsis>
                {recipient?.name}{" "}
            </Typography.Paragraph>
            <Tag color={recipientStatus(recipient)?.color}>
                {recipientStatus(recipient)?.kata}
            </Tag>
        </>
    );
};

const TagStatus = ({ status, workflow, role, signatory_status }) => {
    const { kata, color } = documentStatus({
        status,
        workflow,
        role,
        signatory_status
    });

    return <Tag color={color}>{kata?.toUpperCase()}</Tag>;
};

const columns = [
    {
        title: "Nama dokumen",
        key: "title",
        render: (_, row) => <>{row?.title}.pdf</>,
        width: 400
    },
    {
        title: "Tanggal Upload",
        key: "tanggal_upload",
        render: (_, row) => <>{moment(row?.upload_date).format("LLL")}</>,
        width: 400
    },
    {
        title: "Workflow",
        dataIndex: "workflow",
        key: "workflow"
    },
    {
        title: "Recipients",
        key: "recipients",
        render: (_, row) => (
            <div>
                <Avatar.Group maxCount={3}>
                    {row?.recipients?.map((r) => (
                        <Tooltip
                            title={<MyToolTip recipient={r} />}
                            key={r?.id}
                            color="white"
                        >
                            <Avatar src={r?.profile_picture} />
                        </Tooltip>
                    ))}
                </Avatar.Group>
            </div>
        )
    },
    {
        title: "Status",
        key: "status",

        render: (_, row) => (
            <>
                <TagStatus
                    workflow={row?.workflow}
                    status={row?.status}
                    role={row?.role}
                    signatory_status={row?.signatory_status}
                />
            </>
        )
    }
];

const DocumentTable = ({ data, loading, total, onChangePage }) => {
    return (
        <Table
            columns={columns}
            rowKey={(row) => row?.id}
            pagination={{
                total,
                onChange: onChangePage
            }}
            dataSource={data}
            loading={loading}
        />
    );
};

function All() {
    const [query, setQuery] = useState({
        type: "all",
        page: 1,
        pageSize: 10
    });
    const { data, isLoading } = useQuery(
        ["documents", query],
        () => getDocuments(query),
        {
            enabled: Boolean(query)
        }
    );

    const handleChangePage = (e) => {
        setQuery({ ...query, page: e });
    };

    return (
        <PageContainer title="Documents" subTitle="All">
            <DocumentTable
                total={data?.meta?.total}
                onChangePage={handleChangePage}
                loading={isLoading}
                data={data?.data?.list}
            />
        </PageContainer>
    );
}

All.Auth = {
    roles: ["USER"],
    groups: ["MASTER"]
};

All.getLayout = function getLayout(page) {
    return <EsignLayout>{page}</EsignLayout>;
};

export default All;
