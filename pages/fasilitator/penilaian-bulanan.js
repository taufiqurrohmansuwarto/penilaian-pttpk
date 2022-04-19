import React from "react";

function PenilaianBulanan({ data }) {
    return <div>penilaian-bulanan</div>;
}

export const getServerSideProps = async (ctx) => {
    return {
        props: {
            data: null
        }
    };
};

export default PenilaianBulanan;
