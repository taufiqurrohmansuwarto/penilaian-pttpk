import {
    Button,
    Group,
    Paper,
    Text,
    Title,
    Space as SpaceMantine,
    Stack
} from "@mantine/core";
import { Col, Divider, Row, Space } from "antd";
import { getProviders, signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Login } from "tabler-icons-react";

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function SignIn({ providers }) {
    return (
        <Row
            style={{
                height: "100vh",
                display: "flex"
            }}
            align="middle"
            justify="center"
        >
            <Col>
                <Paper p="xl" shadow="xl" style={{ width: 400 }} withBorder>
                    <Group position="apart">
                        <Image
                            src="https://siasn.bkd.jatimprov.go.id:9000/public/pemprov.png"
                            width="40%"
                            height="40%"
                            objectFit="contain"
                        />

                        <Image
                            src="https://siasn.bkd.jatimprov.go.id:9000/public/logobkd.jpg"
                            width="40%"
                            height="40%"
                            objectFit="contain"
                        />
                    </Group>
                    <Group position="center">
                        <Space direction="vertical" align="center">
                            <Title>Aplikasi</Title>
                            <Image
                                src="https://siasn.bkd.jatimprov.go.id:9000/public/pns.png"
                                width="200%"
                                height="200%"
                                objectFit="contain"
                            />
                            <Text size="sm">Penilaian PTTPK</Text>
                        </Space>
                        <Divider />
                        <Space direction="vertical">
                            {Object?.values(providers).map((provider) => (
                                <div key={provider.name}>
                                    <Button
                                        variant="outline"
                                        fullWidth
                                        leftIcon={<Login />}
                                        onClick={() => signIn(provider.id)}
                                    >
                                        Masuk dengan akun {provider.name}
                                    </Button>
                                </div>
                            ))}
                        </Space>
                        <Stack spacing="xs">
                            <Text size="xs">
                                <Link
                                    href="https://bkd.jatimprov.go.id/pttpk"
                                    passHref
                                >
                                    <a target="_blank">
                                        Lupa/Reset password akun PTT-PK
                                    </a>
                                </Link>
                            </Text>
                        </Stack>
                        <Divider />
                    </Group>
                    <Text align="center" size="xs">
                        @ Copyright BKD Provinsi Jawa Timur 2022
                    </Text>
                    <Text align="center" size="xs">
                        <Link href="/changelog">
                            <a>Changelog 0.0.g</a>
                        </Link>
                    </Text>
                </Paper>
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
