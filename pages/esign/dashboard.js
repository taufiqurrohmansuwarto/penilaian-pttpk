// ini adalah halaman esign
import {
    FileDoneOutlined,
    FileSyncOutlined,
    MailOutlined
} from "@ant-design/icons";
import { Alert } from "@mantine/core";
import {
    Col,
    Card,
    Skeleton,
    Row,
    Statistic,
    Avatar,
    Typography,
    Divider
} from "antd";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import { getDashboard, getStatusEsign } from "../../services/esign.service";
import EsignLayout from "../../src/components/Layout/EsignLayout";
import PageContainer from "../../src/components/PageContainer";

const { Title } = Typography;

const Greetings = ({ user }) => {
    return (
        <>
            <Row gutter={[32, 16]}>
                <Col>
                    <Avatar size={80} src={user?.image} />
                </Col>
                <Col>
                    <Row>
                        <Title level={4}>Selamat Datang , {user?.name}</Title>
                    </Row>

                    <Row>
                        <p>{user?.employee_number}</p>
                    </Row>
                </Col>
            </Row>
        </>
    );
};

const DashboardStatistic = ({ data, loading }) => {
    return (
        <Skeleton loading={loading} active>
            <Row>
                <Col span={12}>
                    <Row>
                        <Col span={8}>
                            <Statistic
                                prefix={<MailOutlined />}
                                title="Dokument Draf"
                                value={`${data?.draft}`}
                            />
                        </Col>
                        <Col span={8}>
                            <Statistic
                                prefix={<FileDoneOutlined />}
                                title="Dokumen Selesai"
                                value={data?.completed}
                            />
                        </Col>
                        <Col span={8}>
                            <Statistic
                                prefix={<FileSyncOutlined />}
                                title="Dokumen Menunggu"
                                value={data?.pending}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Skeleton>
    );
};

function Dashboard() {
    const { data, isLoading } = useQuery("esign-dashboard", () =>
        getDashboard()
    );

    const { data: dataStatus, isLoading: isLoadingStatus } = useQuery(
        "esign-status",
        () => getStatusEsign()
    );

    const { status, data: userData } = useSession();

    return (
        <PageContainer title="Dashboard" subTitle="Demo E-Sign">
            <Card>
                <Alert
                    color="red"
                    title="Perhatian"
                    style={{ marginBottom: 10 }}
                >
                    Esign masih dalam tahapan pengembangan. Data dan dokumen
                    akan dihapus secara berkala.
                </Alert>
                <Skeleton loading={isLoading || status === "loading"}>
                    <Greetings user={userData?.user} />
                    <Divider />
                    <DashboardStatistic data={data?.data} loading={isLoading} />
                    <Divider />
                </Skeleton>
                <Skeleton loading={isLoadingStatus}>
                    {dataStatus?.message !==
                        "User tidak terdaftar dalam bsre" && (
                        <Button>Create Sign</Button>
                    )}
                </Skeleton>
            </Card>
        </PageContainer>
    );
}

// should be have some scope from oidc
Dashboard.Auth = {
    roles: ["USER"],
    groups: ["MASTER"]
};

Dashboard.getLayout = function getLayout(page) {
    return <EsignLayout>{page}</EsignLayout>;
};

export default Dashboard;
