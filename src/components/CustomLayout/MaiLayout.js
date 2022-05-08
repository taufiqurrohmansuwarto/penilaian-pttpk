import { AppShell, Button, Navbar } from "@mantine/core";
import { useRouter } from "next/router";
import { News } from "tabler-icons-react";
import { Brand } from "./Brand";
import { MainLinks } from "./MainLink";

const MyNavbar = () => {
    const router = useRouter();

    const gotoCreate = () => {
        router.push("/mails/create");
    };

    return (
        <Navbar height="95vh" p="xs" width={{ base: 300 }}>
            <Navbar.Section mt="xs">
                <Brand />
            </Navbar.Section>
            <Navbar.Section>
                <Button size="sm" leftIcon={<News />} onClick={gotoCreate}>
                    Create
                </Button>
            </Navbar.Section>
            <Navbar.Section grow mt="md">
                <MainLinks />
            </Navbar.Section>
        </Navbar>
    );
};

function MailLayout({ children }) {
    return <AppShell navbar={<MyNavbar />}>{children}</AppShell>;
}

export default MailLayout;
