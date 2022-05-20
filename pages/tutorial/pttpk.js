import { Container, List } from "@mantine/core";
import { Card } from "antd";
import React from "react";
import Layout from "../../src/components/Layout";
import PageContainer from "../../src/components/PageContainer";

function Pttpk() {
    return (
        <PageContainer title="Tutorial" subTitle="Penilaian untuk PTTPK">
            <Container size="xl">
                <Card>
                    <List type="ordered" my="lg" withPadding>
                        <List.Item>
                            Pengentrian Penilaian Baru
                            <iframe
                                src="https://www.iorad.com/player/1963468/PTTPK-Entri-Penilaian?iframeHash=watchsteps-1&src=iframe&oembed=1"
                                width="100%"
                                height="500px"
                                style={{
                                    width: "100%",
                                    height: 800,
                                    borderBottom: "1px solid #ccc"
                                }}
                                referrerpolicy="strict-origin-when-cross-origin"
                                frameborder="0"
                                webkitallowfullscreen="webkitallowfullscreen"
                                mozallowfullscreen="mozallowfullscreen"
                                allowfullscreen="allowfullscreen"
                                allow="camera; microphone"
                            ></iframe>
                        </List.Item>
                        <List.Item>
                            Pengentrian Penilaian Target. Target penilaian
                            adalah rencana pekerjaan yang akan dilakukan setiap
                            periode tertentu.
                            <iframe
                                src="https://www.iorad.com/player/1963471/PTTPK---Entri-target-tahunan?iframeHash=watchsteps-1&src=iframe&oembed=1"
                                width="100%"
                                height="500px"
                                style={{
                                    width: "100%",
                                    height: 800,
                                    borderBottom: "1px solid #ccc"
                                }}
                                referrerpolicy="strict-origin-when-cross-origin"
                                frameborder="0"
                                webkitallowfullscreen="webkitallowfullscreen"
                                mozallowfullscreen="mozallowfullscreen"
                                allowfullscreen="allowfullscreen"
                                allow="camera; microphone"
                            ></iframe>
                        </List.Item>
                        <List.Item>
                            Penilaian Bulanan.
                            <iframe
                                src="https://www.iorad.com/player/1963479/PTTPK---Entri-Pekerjaan-Bulanan?iframeHash=watchsteps-1&src=iframe&oembed=1"
                                width="100%"
                                height="500px"
                                style={{
                                    width: "100%",
                                    height: 800,
                                    borderBottom: "1px solid #ccc"
                                }}
                                referrerpolicy="strict-origin-when-cross-origin"
                                frameborder="0"
                                webkitallowfullscreen="webkitallowfullscreen"
                                mozallowfullscreen="mozallowfullscreen"
                                allowfullscreen="allowfullscreen"
                                allow="camera; microphone"
                            ></iframe>
                        </List.Item>
                        <List.Item>
                            Cetak Penilaian BUlanan.
                            <iframe
                                src="https://www.iorad.com/player/1963489/PTTPK---Cetak-Penilaian-Bulanan?iframeHash=watchsteps-1&src=iframe&oembed=1"
                                width="100%"
                                height="500px"
                                style={{
                                    width: "100%",
                                    height: 800,
                                    borderBottom: "1px solid #ccc"
                                }}
                                referrerpolicy="strict-origin-when-cross-origin"
                                frameborder="0"
                                webkitallowfullscreen="webkitallowfullscreen"
                                mozallowfullscreen="mozallowfullscreen"
                                allowfullscreen="allowfullscreen"
                                allow="camera; microphone"
                            ></iframe>
                        </List.Item>
                        <List.Item>
                            Batal Kirim Atasan. Batal Kirim atasan atau mungkin
                            sering disebut turun status. Fitur ini dapat
                            digunakan apabila pegawai PTTPK ingin mengedit
                            kembali penilaian yang sudah diajukan. Akan tetapi
                            apabila sudah selesai dientri kembali, maka PTTPK
                            yang bersangkutan harus mengirimkan lagi pekerjaanya
                            ke atasan
                            <iframe
                                src="https://www.iorad.com/player/1963490/PTTPK---Batal-Kirim-Atasan?iframeHash=watchsteps-1&src=iframe&oembed=1"
                                width="100%"
                                height="500px"
                                style={{
                                    width: "100%",
                                    height: 800,
                                    borderBottom: "1px solid #ccc"
                                }}
                                referrerpolicy="strict-origin-when-cross-origin"
                                frameborder="0"
                                webkitallowfullscreen="webkitallowfullscreen"
                                mozallowfullscreen="mozallowfullscreen"
                                allowfullscreen="allowfullscreen"
                                allow="camera; microphone"
                            ></iframe>
                        </List.Item>
                    </List>
                </Card>
            </Container>
        </PageContainer>
    );
}

Pttpk.Auth = {
    roles: ["USER", "FASILITATOR", "ADMIN"],
    groups: ["PTTPK", "MASTER"]
};

Pttpk.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

export default Pttpk;
