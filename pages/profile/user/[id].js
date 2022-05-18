import { Avatar, Box, Button, Group, Paper, Text } from "@mantine/core";
import { Skeleton } from "antd";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import { Mail } from "tabler-icons-react";
import { getProfile } from "../../../services/main.services";
import Layout from "../../../src/components/Layout";
import PageContainer from "../../../src/components/PageContainer";

function Profile() {
    const router = useRouter();
    const { data, isLoading } = useQuery(
        ["profile", router?.query?.id],
        () => getProfile(router.query?.id),
        {
            enabled: !!router?.query?.id
        }
    );

    return (
        <PageContainer style={{ minHeight: "100vh" }} title="Profil User">
            <Skeleton loading={isLoading} active avatar>
                <Paper p="xl">
                    <Group my="lg">
                        <Avatar src={data?.image} radius={100} size="lg" />
                        <Box style={{ flex: 1 }}>
                            <Text color="gray">{data?.username}</Text>
                            <Text size="sm">{data?.employee_number}</Text>
                            <Text size="xs">{data?.from}</Text>
                        </Box>
                    </Group>
                    <Button leftIcon={<Mail />}>Kirim Pesan</Button>
                </Paper>
            </Skeleton>
        </PageContainer>
    );
}

Profile.Auth = {
    roles: ["USER", "FASILITATOR", "ADMIN"],
    groups: ["PTTPK", "MASTER"]
};

Profile.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

export default Profile;
