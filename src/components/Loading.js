import { Center, Loader, Stack, Text } from "@mantine/core";
import React from "react";
import Image from "next/image";

function Loading() {
    return (
        <Center style={{ width: "100%", height: "100vh" }}>
            <Stack align="center" spacing="xs">
                <Image
                    src="https://siasn.bkd.jatimprov.go.id:9000/public/logobkd.jpg"
                    width="50%"
                    height="50%"
                    objectFit="contain"
                />
                <Loader size="md" />
                <Text size="md">Tunggu dulu yaa...</Text>
            </Stack>
        </Center>
    );
}

export default Loading;
