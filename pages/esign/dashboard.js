// ini adalah halaman esign
import {
    FileDoneOutlined,
    FileSyncOutlined,
    MailOutlined
} from "@ant-design/icons";
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
import { getDashboard } from "../../services/esign.service";
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

    const { status, data: userData } = useSession();

    return (
        <PageContainer title="Dashboard" subTitle="Demo E-Sign">
            <Card>
                <Skeleton loading={isLoading || status === "loading"}>
                    <Greetings user={userData?.user} />
                    <Divider />
                    <DashboardStatistic data={data?.data} loading={isLoading} />
                    <Divider />
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
