import React from "react";
import { Group, ActionIcon, Box, useMantineTheme } from "@mantine/core";
import { Sun, MoonStars } from "tabler-icons-react";
import { Logo } from "./Logo";

export function Brand() {
    const { colorScheme, toggleColorScheme } = useMantineTheme();

    return (
        <Box
            sx={(theme) => ({
                paddingLeft: theme.spacing.xs,
                paddingRight: theme.spacing.xs,
                paddingBottom: theme.spacing.lg,
                borderBottom: `1px solid ${
                    theme.colorScheme === "dark"
                        ? theme.colors.dark[4]
                        : theme.colors.gray[2]
                }`
            })}
        >
            <Group position="apart">
                <Logo colorScheme={colorScheme} />
            </Group>
        </Box>
    );
}
