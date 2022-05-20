import { Container, List, Text } from "@mantine/core";
import { Card } from "antd";
import React from "react";
import Layout from "../../src/components/Layout";
import PageContainer from "../../src/components/PageContainer";

function Fasilitator() {
    return (
        <PageContainer title="Tutorial" subTitle="Penilaian untuk Fasilitator">
            <Container size="xl">
                <Card title="Fasilitator">
                    <List type="ordered" my="lg">
                        <List.Item>
                            Fitur dari fasilitator di aplikasi ini adalah
                            melakukan perekapan. Fasilitator dapat mengetahui
                            pegawai yang sudah mengerjakan penilaian atau belum.
                            Perekapan dapat dilakukan per bulan dengan hasil
                            dokumen berupa excel. Berikut langkah-langkahnya
                        </List.Item>
                    </List>
                    <iframe
                        src="https://www.iorad.com/player/1963451/Penilaian-PTTPK--Tutorial-Fasilitator?iframeHash=watchsteps-1&src=iframe&oembed=1"
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
                </Card>
            </Container>
        </PageContainer>
    );
}

Fasilitator.Auth = {
    roles: ["USER", "FASILITATOR", "ADMIN"],
    groups: ["PTTPK", "MASTER"]
};

Fasilitator.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

export default Fasilitator;
