import { Center, Image, Loader, Stack, Text } from "@mantine/core";
import React from "react";

function Loading() {
    return (
        <Center style={{ width: "100%", height: "100vh" }}>
            <Stack align="center" spacing="xs">
                <div style={{ width: 100 }}>
                    <Image src="logobkd.jpg" />
                </div>
                <Loader size="md" />
                <Text size="md">Tunggu dulu yaa...</Text>
            </Stack>
        </Center>
    );
}

export default Loading;
