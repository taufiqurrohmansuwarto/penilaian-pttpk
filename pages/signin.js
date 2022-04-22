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
                <Col>
                    <div>
                        <h1 style={{ marginBottom: 0 }}>
                            Seleksi Terbuka Pengisian Lowongan JPT Madya
                        </h1>
                    </div>
                    <h2 style={{ marginBottom: 0 }}>
                        Sekretaris Daerah Provinsi Jawa Timur
                    </h2>
                    <Divider />
                    <Space direction="vertical">
                        {Object?.values(providers).map((provider) => (
                            <div key={provider.name}>
                                <Button
                                    //   shape="round"
                                    type="primary"
                                    onClick={() => signIn(provider.id)}
                                >
                                    Masuk dengan {provider.name}
                                </Button>
                            </div>
                        ))}
                    </Space>
                    <div style={{ marginTop: 10 }}>
                        <p>Version 0.0.1-a.1</p>
                        <Space>
                            <img
                                src="logobkd.jpg"
                                alt=""
                                style={{ width: 50 }}
                            />
                            <img
                                src="pemprov.png"
                                alt=""
                                style={{ width: 20 }}
                            />
                        </Space>
                        <div>
                            <Typography.Text strong>
                                @Copyright BKD Provinsi Jawa Timur 2022
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
