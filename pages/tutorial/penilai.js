import { Container, List } from "@mantine/core";
import { Card } from "antd";
import React from "react";
import Layout from "../../src/components/Layout";
import PageContainer from "../../src/components/PageContainer";

function Penilai() {
    return (
        <PageContainer title="Tutorial" subTitle="Penilaian untuk Penilai/PNS">
            <Container size="xl">
                <Card>
                    <List type="ordered" my="lg" withPadding>
                        <List.Item>
                            Tutorial Menilai Pegawai PTTPK. PNS yang dipilih
                            sebagai penilai, di menu penilaian bulanan akan
                            tampil daftar pegawai PTTPK yang akan dinilai. Tugas
                            dari penilai adalah memverif dan memberi nilai
                            disetiap pekerjaan PTTPK. Untuk mempercepat
                            penilaian, Penilai bisa memanfaatkan range random.
                            <iframe
                                src="https://www.iorad.com/player/1963485/Penilai---Menilai-PTTPK?iframeHash=watchsteps-1&src=iframe&oembed=1"
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

Penilai.Auth = {
    roles: ["USER", "FASILITATOR", "ADMIN"],
    groups: ["PTTPK", "MASTER"]
};

Penilai.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

export default Penilai;
