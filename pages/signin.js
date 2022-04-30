import { Button, Col, Divider, Row, Space, Typography } from "antd";
import { getProviders, signIn } from "next-auth/react";

export default function SignIn({ providers }) {
    return (
        <Row
            style={{ height: "100vh", display: "flex" }}
            align="middle"
            justify="center"
        >
            {/* <Col></Col> */}
            <Col flex>
                <Space direction="vertical" align="center">
                    <Typography.Title>Aplikasi ASN</Typography.Title>
                    <div>
                        <img src="pns.png" style={{ width: 200 }} alt="" />
                    </div>
                    <Typography.Text type="secondary">
                        Include Penilaian PTTPK
                    </Typography.Text>
                </Space>
                <Divider />
                <Space direction="vertical">
                    {Object?.values(providers).map((provider) => (
                        <div key={provider.name}>
                            <Button
                                shape="round"
                                type="primary"
                                onClick={() => signIn(provider.id)}
                            >
                                Masuk dengan {provider.name}
                            </Button>
                        </div>
                    ))}
                </Space>
                <Divider />
                <div style={{ marginTop: 10 }}>
                    <Typography.Text type="secondary">
                        Version 0.0.1-a.1
                    </Typography.Text>
                    <img src="logobkd.jpg" alt="" style={{ width: 30 }} />
                    <div>
                        <Typography.Text strong>
                            @ Copyright BKD Provinsi Jawa Timur 2022
                        </Typography.Text>
                    </div>
                </div>
            </Col>
        </Row>
    );
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps() {
    const providers = await getProviders();
    return {
        props: { providers }
    };
}
