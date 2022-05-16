import {
    ActionIcon,
    Box,
    Card,
    Group,
    Image,
    Indicator,
    Spoiler,
    Text,
    Title,
    Tooltip,
    useMantineTheme
} from "@mantine/core";
import { Avatar } from "antd";
import React from "react";
import {
    Bike,
    Bookmark,
    DotsVertical,
    HandRock,
    Link,
    MessageCircle
} from "tabler-icons-react";

function QCard() {
    const theme = useMantineTheme();

    return (
        <div style={{ width: 600, margin: "auto" }}>
            <Card shadow="lg" p="md">
                <Group position="apart">
                    <Group my="xs" spacing="xs">
                        <Avatar src="https://master.bkd.jatimprov.go.id/files_jatimprov/56543-file_foto-20190720-969-DSC_0443.JPG" />
                        <Box sx={{ flex: 1 }}>
                            <Text size="sm" weight={500}>
                                Iput Taufiqurrohman Suwarto S.Kom
                            </Text>

                            <Text size="xs">
                                14 Mei Pukul 23.30 &#x2022; di{" "}
                                <a href="">BKD Provinsi Jawa Timur</a>
                            </Text>
                        </Box>
                    </Group>

                    <Group spacing="xs">
                        <ActionIcon size="xs">
                            <Bookmark />
                        </ActionIcon>
                        <ActionIcon size="xs">
                            <DotsVertical />
                        </ActionIcon>
                    </Group>
                </Group>
                <Group position="apart" my="xs">
                    <Title order={4}>
                        SKP ku adalah skpmu yang aku kerjakan wkwkwk. ayo sama2
                        ngerjakan skp
                    </Title>
                </Group>
                <Box mt="md">
                    <Spoiler
                        maxHeight={60}
                        showLabel="Lanjut"
                        hideLabel="Sembuyikan"
                        transitionDuration={0}
                    >
                        <Text size="sm" style={{ lineHeight: 1.5 }} mb="sm">
                            We Butter the Bread with Butter was founded in 2007
                            by Marcel Neumann, who was originally guitarist for
                            Martin Kesici's band, and Tobias Schultka. The band
                            was originally meant as a joke, but progressed into
                            being a more serious musical duo. The name for the
                            band has no particular meaning, although its origins
                            were suggested from when the two original members
                            were driving in a car operated by Marcel Neumann and
                            an accident almost occurred. Neumann found Schultka
                            "so funny that he briefly lost control of the
                            vehicle." Many of their songs from this point were
                            covers of German folk tales and nursery rhymes.
                        </Text>
                    </Spoiler>
                </Box>

                <Card.Section>
                    <Image src="doodle.png" height="auto" alt="norway" />
                </Card.Section>
                <Group mt="lg" position="apart">
                    <Group position="left" spacing="xl">
                        <Tooltip withArrow label="Metal Bos">
                            <Indicator label={100} withBorder size={20}>
                                <ActionIcon color="red">
                                    <HandRock />
                                </ActionIcon>
                            </Indicator>
                        </Tooltip>
                        <Tooltip withArrow label="Komentar">
                            <ActionIcon>
                                <MessageCircle />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip withArrow label="Aku otw">
                            <ActionIcon>
                                <Bike />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                    <Tooltip withArrow label="Kaitkan jika kamu senasib">
                        <ActionIcon>
                            <Link />
                        </ActionIcon>
                    </Tooltip>
                </Group>
            </Card>
        </div>
    );
}

export default QCard;
