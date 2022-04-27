import { useRouter } from "next/router";
import PageContainer from "./PageContainer";

function AccountDiscussionsLayout({ children, activeKey }) {
    const router = useRouter();
    const handleChangeTabs = (key) => {
        if (key === "details") {
            router.push(`/account/${router?.query?.id}`);
        } else {
            router.push(`/account/${router?.query?.id}/${key}`);
        }
    };

    return (
        <PageContainer
            title="Informasi"
            subTitle="Akun"
            tabList={[
                {
                    tab: "Detail",
                    key: "details"
                },
                {
                    tab: "Diskusi",
                    key: "diskusi"
                },
                {
                    tab: "Komentar",
                    key: "komentar"
                },
                {
                    tab: "Disimpan",
                    key: "disimpan"
                },
                {
                    tab: "Upvotes",
                    key: "upvotes"
                },
                {
                    tab: "Downvotes",
                    key: "downvotes"
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

export default AccountDiscussionsLayout;
