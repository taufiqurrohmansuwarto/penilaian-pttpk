import { Button, Col, Divider, Row, Space, Typography } from "antd";
import { getProviders, signIn } from "next-auth/react";

export default function SignIn({ providers }) {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minWidth: "100vh",
                minHeight: "100vh",
                paddingTop: "6rem"
            }}
        >
            <Row align="middle">
                <img src="pns.png" style={{ width: 300 }} alt="" />
                <Col>
                    <Typography.Title>Aplikasi ASN</Typography.Title>
                    <Typography.Text type="secondary">
                        Include Penilaian PTTPK
                    </Typography.Text>
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
                        <Space>
                            <Typography.Text type="secondary">
                                Version 0.0.1-a.1
                            </Typography.Text>
                            <img
                                src="logobkd.jpg"
                                alt=""
                                style={{ width: 50 }}
                            />
                        </Space>
                        <div>
                            <Typography.Text strong>
                                @ Copyright BKD Provinsi Jawa Timur 2022
                            </Typography.Text>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps() {
    const providers = await getProviders();
    return {
        props: { providers }
    };
}
