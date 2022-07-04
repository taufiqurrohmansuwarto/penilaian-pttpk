import { Alert } from "@mantine/core";
import React from "react";
import { useQuery } from "react-query";
import { Antenna } from "tabler-icons-react";
import { getAnnouncements } from "../../services/users.service";

function Pengumuman() {
    const { data, isLoading } = useQuery(["announcements"], () =>
        getAnnouncements()
    );

    if (isLoading) {
        return <div>loading...</div>;
    }

    return (
        <>
            {data && (
                <Alert
                    my="xs"
                    title="Perhatian"
                    icon={<Antenna />}
                    color="yellow"
                >
                    <div
                        dangerouslySetInnerHTML={{ __html: data?.description }}
                    />
                </Alert>
            )}
        </>
    );
}

export default Pengumuman;
