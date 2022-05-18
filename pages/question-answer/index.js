import React from "react";
import HJoinCreate from "../../src/components/HJoins/HJoinCreate";
import Layout from "../../src/components/Layout";
import PageContainer from "../../src/components/PageContainer";
import QCard from "../../src/components/QuestionAnswer/QCard";

function QuestionAnswer() {
    return (
        <PageContainer style={{ minHeight: "100vh" }} title="Tanya Jawab">
            <HJoinCreate />
            <QCard />
        </PageContainer>
    );
}

QuestionAnswer.Auth = {
    roles: ["USER", "FASILITATOR", "ADMIN"],
    groups: ["PTTPK", "MASTER"]
};

QuestionAnswer.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

export default QuestionAnswer;
