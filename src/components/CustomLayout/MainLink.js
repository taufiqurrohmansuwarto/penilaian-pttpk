import { Group, Text, ThemeIcon, UnstyledButton } from "@mantine/core";
import { useRouter } from "next/router";
import React from "react";
import { Inbox, Mailbox, Send, Star } from "tabler-icons-react";

function MainLink({ icon, color, label, routes }) {
    const router = useRouter();
    const gotoRouter = () => {
        router.push(routes);
    };

    return (
        <UnstyledButton
            onClick={gotoRouter}
            sx={(theme) => ({
                display: "block",
                width: "100%",
                padding: theme.spacing.xs,
                borderRadius: theme.radius.sm,
                color:
                    theme.colorScheme === "dark"
                        ? theme.colors.dark[0]
                        : theme.black,
                backgroundColor:
                    router?.pathname === routes ? theme.colors.gray[0] : null,

                "&:hover": {
                    backgroundColor:
                        theme.colorScheme === "dark"
                            ? theme.colors.dark[6]
                            : theme.colors.gray[0]
                }
            })}
        >
            <Group>
                <ThemeIcon color={color} variant="light">
                    {icon}
                </ThemeIcon>

                <Text size="sm">{label}</Text>
            </Group>
        </UnstyledButton>
    );
}

const data = [
    {
        icon: <Inbox size={16} />,
        color: "blue",
        label: "Kotak Masuk",
        routes: "/mails/inbox"
    },
    {
        icon: <Send size={16} />,
        color: "teal",
        label: "Terkirim",
        routes: "/mails/sents"
    },
    {
        icon: <Star size={16} />,
        color: "violet",
        label: "Terbintang",
        routes: "/mails/starred"
    }
];

export function MainLinks() {
    const links = data.map((link) => <MainLink {...link} key={link.label} />);
    return <div>{links}</div>;
}
