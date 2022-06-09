import { AppShell, Button, Navbar } from "@mantine/core";
import { useRouter } from "next/router";
import { Message2 } from "tabler-icons-react";
import { MainLinks } from "./MainLink";

const MyNavbar = () => {
    const router = useRouter();

    const gotoCreate = () => {
        router.push("/mails/create");
    };

    return (
        <Navbar height="95vh" p="xs" width={{ base: 200 }}>
            <Navbar.Section>
                <Button
                    mt="xs"
                    size="sm"
                    color="green"
                    leftIcon={<Message2 />}
                    onClick={gotoCreate}
                >
                    Buat Pesan
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
