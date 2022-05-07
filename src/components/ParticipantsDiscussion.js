import { Avatar, Card, Tooltip } from "antd";
import React from "react";

function ParticipantsDiscussion({ users }) {
    return (
        <Card title="Peserta Diskusi">
            <Avatar.Group maxCount={5}>
                {users?.map((user) => {
                    return (
                        <Tooltip
                            title={user?.user?.username}
                            key={user?.user?.custom_id}
                        >
                            <Avatar src={user?.user?.image} />
                        </Tooltip>
                    );
                })}
            </Avatar.Group>
        </Card>
    );
}

export default ParticipantsDiscussion;
