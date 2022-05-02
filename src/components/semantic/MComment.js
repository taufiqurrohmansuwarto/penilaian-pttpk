import moment from "moment";
import { useRouter } from "next/router";
import { Comment, Icon } from "semantic-ui-react";

function MComment({ data, user }) {
    const router = useRouter();

    const gotoDetail = () => {
        router.push(`/feeds/${data?.id}`);
    };

    return (
        <Comment.Group>
            <Comment>
                <Comment.Avatar src={data?.user?.image} />
                <Comment.Content>
                    <Comment.Author as="a">
                        {data?.user?.username}
                    </Comment.Author>
                    <Comment.Metadata>
                        <div>{moment(data?.created_at).fromNow()}</div>
                    </Comment.Metadata>
                    <Comment.Text>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: data?.comment
                            }}
                        />
                    </Comment.Text>
                    <Comment.Actions>
                        <Comment.Action>
                            <Icon name="like" color="red" /> 0 Likes
                        </Comment.Action>
                        <Comment.Action onClick={gotoDetail}>
                            <Icon name="comment outline" /> 10 Komentar
                        </Comment.Action>
                    </Comment.Actions>
                </Comment.Content>
            </Comment>
        </Comment.Group>
    );
}

export default MComment;
