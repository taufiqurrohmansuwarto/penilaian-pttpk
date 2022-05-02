import React from "react";
import { Feed, Icon } from "semantic-ui-react";
import moment from "moment";

function MFeed({ data }) {
    return (
        <Feed>
            <Feed.Event>
                <Feed.Label>
                    <img src={data?.user?.image} />
                </Feed.Label>
                <Feed.Content>
                    <Feed.Summary>
                        <Feed.User>{data?.user?.username}</Feed.User> Memposting{" "}
                        <Feed.Date>
                            {moment(data?.created_at).fromNow()}
                        </Feed.Date>
                    </Feed.Summary>
                    <Feed.Extra text>
                        <div
                            dangerouslySetInnerHTML={{ __html: data?.comment }}
                        />
                    </Feed.Extra>
                    <Feed.Meta>
                        <Feed.Like>
                            <Icon name="like" />4 Likes
                        </Feed.Like>
                    </Feed.Meta>
                </Feed.Content>
            </Feed.Event>
        </Feed>
    );
}

export default MFeed;
