import { useRouter } from "next/router";
import PageContainer from "./PageContainer";

function NotificationLayout({ children, activeKey }) {
    const router = useRouter();
    const handleChangeTabs = (key) => {
        router?.push(`/notifications/${key}`);
    };

    return (
        <PageContainer
            title="Notifikasi"
            subTitle="Aplikasi"
            tabList={[
                {
                    tab: "Diskusi",
                    key: "discussions"
                },
                {
                    tab: "Feedback",
                    key: "feedbacks"
                }
            ]}
            tabProps={{
                size: "small",
                activeKey
            }}
            onTabChange={handleChangeTabs}
        >
            {children}
        </PageContainer>
    );
}

export default NotificationLayout;
