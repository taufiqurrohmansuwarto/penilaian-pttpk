import { Skeleton, Button, List } from "antd";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
    createCategories,
    getCategories,
    getPosts
} from "../../services/main.services";

const fakeList = [{}, {}, {}];

const ListItem = () => {
    return <List></List>;
};

function DiscussionsFeeds() {
    const queryClient = useQueryClient();

    const { data: dataPosts, isLoading: postLoading } = useQuery("posts", () =>
        getPosts()
    );

    const { data: dataCategories } = useQuery("categories", () =>
        getCategories()
    );

    const createMutationCategories = useMutation(
        (data) => createCategories(data),
        {
            onSuccess: () => queryClient.invalidateQueries("categories")
        }
    );

    const handleCreateCategories = () => {
        const data = {
            title: "ngopi",
            link: "www.google.com",
            content: "<p>lorem</p>"
        };
        createMutationCategories.mutate(data);
    };

    return (
        <Skeleton loading={postLoading}>
            {JSON.stringify(dataCategories)}
            <Button onClick={handleCreateCategories}>Create Categories</Button>
        </Skeleton>
    );
}

export default DiscussionsFeeds;
