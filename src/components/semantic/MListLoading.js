import { List, Skeleton } from "antd";

function MListLoading({ children, loading }) {
    if (!loading) {
        return children;
    }

    return (
        <List
            dataSource={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]}
            renderItem={() => (
                <List.Item>
                    <Skeleton
                        avatar
                        active
                        title={false}
                        loading={loading}
                    ></Skeleton>
                </List.Item>
            )}
        />
    );
}

export default MListLoading;
