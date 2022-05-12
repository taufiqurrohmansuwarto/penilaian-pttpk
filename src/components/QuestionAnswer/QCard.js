import {
    ActionIcon,
    Badge,
    Card,
    Group,
    Image,
    Text,
    useMantineTheme
} from "@mantine/core";
import React from "react";
import { Adjustments } from "tabler-icons-react";

function QCard() {
    const theme = useMantineTheme();

    return (
        <div style={{ width: 480, margin: "auto" }}>
            <Card shadow="lg" p="lg">
                <Group position="apart" mb="md">
                    <Text weight={500}>Norway Fjord Adventures</Text>
                    <Badge color="pink" variant="light">
                        On Sale
                    </Badge>
                </Group>
                <Card.Section>
                    <Image src="doodle.png" height={180} alt="norway" />
                </Card.Section>
                <Group
                    position="apart"
                    style={{ marginBottom: 5, marginTop: theme.spacing.sm }}
                >
                    <Text weight={500}>Norway Fjord Adventures</Text>
                    <Badge color="pink" variant="light">
                        On Sale
                    </Badge>
                </Group>
                <Text size="sm" style={{ lineHeight: 1.5 }} mb="sm">
                    With Fjord Tours you can explore more of the magical fjord
                    landscapes with tours and activities on and around the
                    fjords of Norway
                </Text>
                <Group position="left">
                    <ActionIcon>
                        <Adjustments />
                    </ActionIcon>
                    <ActionIcon>
                        <Adjustments />
                    </ActionIcon>
                </Group>
            </Card>
        </div>
    );
}

export default QCard;
