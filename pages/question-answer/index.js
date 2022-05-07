import React from "react";
import Layout from "../../src/components/Layout";
import PageContainer from "../../src/components/PageContainer";

function QuestionAnswer() {
    return <PageContainer title="Tanya Jawab"></PageContainer>;
}

QuestionAnswer.Auth = {
    roles: ["USER", "FASILITATOR"],
    groups: ["PTTPK", "MASTER"]
};

QuestionAnswer.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

export default QuestionAnswer;
