import ApprovalLayout from "../../src/components/ApprovalLayout";

function PenilaianTahunan() {
    return (
        <ApprovalLayout title="Daftar Pengajuan Penilaian Tahunan/Akhir">
            penilaian-tahunan
        </ApprovalLayout>
    );
}

PenilaianTahunan.Auth = {
    roles: ["USER"],
    groups: ["MASTER"]
};

export default PenilaianTahunan;
