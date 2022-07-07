import { Button, Container, Divider, List, ThemeIcon } from "@mantine/core";
import React from "react";
import { CircleCheck } from "tabler-icons-react";
import Link from "next/link";

function Changelog() {
    return (
        <Container py={2}>
            <Link href="/">
                <Button>Kembali</Button>
            </Link>
            <Divider
                my="xs"
                label="Versi 0.0.d 4 Juli 2022"
                labelPosition="center"
            />
            <List
                spacing="xs"
                size="sm"
                center
                icon={
                    <ThemeIcon color="teal" size={24} radius="xl">
                        <CircleCheck size={16} />
                    </ThemeIcon>
                }
            >
                <List.Item>Penambahan fitur untuk cuti (Meliputi user, approval, dan fasilitator)</List.Item>
                <List.Item>Perbaikan dokumen laporan bulanan yang kadang terpotong</List.Item>
            </List>
            <Divider
                my="xs"
                label="Versi 0.0.c 9 Juni 2022"
                labelPosition="center"
            />
            <List
                spacing="xs"
                size="sm"
                center
                icon={
                    <ThemeIcon color="teal" size={24} radius="xl">
                        <CircleCheck size={16} />
                    </ThemeIcon>
                }
            >
                <List.Item>Penambahan fitur chat online</List.Item>
                <List.Item>Penambahan target dan capaian di approval</List.Item>
                <List.Item>
                    Penambahan total pegawai, pegawai sudah verif dan pegawai
                    belum verif
                </List.Item>
            </List>
            <Divider
                my="xs"
                label="Versi 0.0.b 20 Mei 2022"
                labelPosition="center"
            />
            <List
                spacing="xs"
                size="sm"
                center
                icon={
                    <ThemeIcon color="teal" size={24} radius="xl">
                        <CircleCheck size={16} />
                    </ThemeIcon>
                }
            >
                <List.Item>
                    Penambahan halaman tutorial PTTPK, Penilai dan Fasilitator{" "}
                </List.Item>
            </List>
            <Divider
                my="xs"
                label="Versi 0.0.a 19 Mei 2022"
                labelPosition="center"
            />
            <List
                spacing="xs"
                size="sm"
                center
                icon={
                    <ThemeIcon color="teal" size={24} radius="xl">
                        <CircleCheck size={16} />
                    </ThemeIcon>
                }
            >
                <List.Item>
                    Penambahan fitur pesan (pojok kanan atas) sudah bisa dipake
                    meskipun gratul-gratul
                </List.Item>
                <List.Item>
                    Penambahan fitur notifikasi email pada saat PTT-PK melakukan
                    kirim pekerjaan dan pns melakukan verifikasi penilaian
                    PTT-PK
                </List.Item>
                <List.Item>
                    Gambar-gambar dikompres biar agak cepetan dikit pas load
                </List.Item>
                <List.Item>Poles dikit halaman signin</List.Item>
                <List.Item>
                    Detail Changelog ditulis di page baru biar user tau apa yang
                    baru dan fix (Sekalian skp saya biar mudah h3h3h3h3).
                </List.Item>
            </List>
        </Container>
    );
}

export default Changelog;
