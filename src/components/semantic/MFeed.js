import React from "react";
import { Feed, Icon } from "semantic-ui-react";
import moment from "moment";
import { capitalCase } from "../../../utils/utility";
import Link from "next/link";

const TypeFeed = ({
    type,
    comment,
    disccussion,
    sender,
    receiver,
    createdAt
}) => {
    if (type === "postinganBaru") {
        return (
            <>
                <Feed.Date>{moment(createdAt).fromNow()}</Feed.Date>
                <Feed.Summary>
                    <Feed.User>{capitalCase(sender?.username)}</Feed.User>{" "}
                    menulis{" "}
                    <Link href={`/feeds/${comment?.id}`}>
                        <a>postingan baru</a>
                    </Link>
                </Feed.Summary>
            </>
        );
    } else if (type === "balasanPostingan") {
        return (
            <>
                <Feed.Date>{moment(createdAt).fromNow()}</Feed.Date>
                <Feed.Summary>
                    <Feed.User>{capitalCase(sender?.username)}</Feed.User>{" "}
                    membalas{" "}
                    <Link href={`/feeds/${comment?.parent?.id}`}>
                        <a>postingan</a>
                    </Link>{" "}
                    <a>{receiver?.username}</a>
                </Feed.Summary>
            </>
        );
    } else if (type === "komentarDiskusiBaru") {
        return (
            <>
                <Feed.Date>{moment(createdAt).fromNow()}</Feed.Date>
                <Feed.Summary>
                    <Feed.User>{capitalCase(sender?.username)}</Feed.User>{" "}
                    mengomentari di diskusi{" "}
                    <Link
                        href={`/discussions/${disccussion?.post_id}/comments`}
                    >
                        <a>{disccussion?.parent?.title}</a>
                    </Link>{" "}
                </Feed.Summary>
            </>
        );
    } else if (type === "balasanKomentarDiskusi") {
        return (
            <>
                <Feed.Date>{moment(createdAt).fromNow()}</Feed.Date>
                <Feed.Summary>
                    <Feed.User>{capitalCase(sender?.username)}</Feed.User>{" "}
                    membalas komentar <a>{receiver?.username}</a> di diskusi{" "}
                    <Link
                        href={`/discussions/${disccussion?.post_id}/comments?target=${disccussion?.id}`}
                    >
                        <a>{disccussion?.parent_comments?.title}</a>
                    </Link>
                </Feed.Summary>
            </>
        );
    } else {
        return null;
    }
};

function MFeed({ sender, receiver, createdAt, type, comment, discussion }) {
    return (
        <Feed size="small">
            <Feed.Event>
                <Feed.Label>
                    <img src={sender?.image} />
                </Feed.Label>
                <Feed.Content>
                    <TypeFeed
                        sender={sender}
                        receiver={receiver}
                        createdAt={createdAt}
                        type={type}
                        comment={comment}
                        disccussion={discussion}
                    />
                </Feed.Content>
            </Feed.Event>
        </Feed>
    );
}

export default MFeed;
