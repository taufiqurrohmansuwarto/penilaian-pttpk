import dayjs from "dayjs";
import "dayjs/locale/id";
import { round } from "lodash";

export const formatTime = (time) => {
    return dayjs(time).locale("id").format("DD MMM, YYYY HH:mm");
};

export const documentStatus = ({
    workflow,
    status,
    signatory_status,
    role,
    is_approve
}) => {
    let kata;
    let color;

    if (
        workflow === "selfSign" &&
        role === "signer" &&
        signatory_status === "in progress"
    ) {
        kata = status;
    } else {
        if (status === "completed") {
            kata = "completed";
            color = "green";
        }

        if (status === "rejected" && role === null) {
            kata = "rejected";
            color = "red";
        }

        if (
            status === "rejected" &&
            role === "signer" &&
            !is_approve &&
            signatory_status === "in progress"
        ) {
            kata = "unsigned (rejected)";
            color = "red";
        }

        if (
            status === "rejected" &&
            role === "reviewer" &&
            !is_approve &&
            signatory_status === "in progress"
        ) {
            kata = "unreviewed (rejected)";
            color = "red";
        }

        if (role === "reviewer" && signatory_status === "completed") {
            kata = "reviewed";
            color = "red";
        }

        if (
            role === "reviewer" &&
            signatory_status === "rejected" &&
            status === "rejected"
        ) {
            kata = "reviewed (rejected)";
            color = "red";
        }

        if (
            role === "signer" &&
            signatory_status === "rejected" &&
            status === "rejected"
        ) {
            kata = "signed (rejected)";
            color = "red";
        }

        if (role === "signer" && signatory_status === "completed") {
            kata = "signed";
            color = "green";
        }

        if (status === "draft") {
            kata = "draft";
            color = "grey";
        }

        if (status === "on progress") {
            if (role === null && signatory_status === null) {
                kata = "on progress";
                color = "yellow";
            }
            if (role === "signer" && signatory_status === "in progress") {
                kata = "waiting for sign";
                color = "yellow";
            }
            if (role === "signer" && signatory_status === "completed") {
                kata = "signed";
                color = "yellow";
            }
            if (role === "reviewer" && signatory_status === "in progress") {
                kata = "waiting for review";
                color = "yellow";
            }
        }
    }
    return {
        kata,
        color
    };
};

export const recipientStatus = (recipient) => {
    let kata;
    let color;
    const { role, signatory_status, status, is_approve } = recipient;

    if (role === "signer" && signatory_status === "completed") {
        kata = "signed";
        color = "green";
    }
    if (role === "reviewer" && signatory_status === "completed") {
        kata = "reviewed";
        color = "green";
    }
    if (role === "signer" && signatory_status === "in progress") {
        kata = "waiting for sign";
        color = "yellow";
    }
    if (role === "reviewer" && signatory_status === "in progress") {
        kata = "waiting for review";
        color = "yellow";
    }

    if (
        (role === "reviewer" &&
            signatory_status === "rejected" &&
            status === "rejected" &&
            is_approve) ||
        (role === "signer" &&
            signatory_status === "rejected" &&
            status === "rejected" &&
            is_approve)
    ) {
        kata = "rejected";
        color = "red";
    }

    if (
        role === "reviewer" &&
        signatory_status === "in progress" &&
        status === "rejected" &&
        !is_approve
    ) {
        kata = "unreviewed (rejected)";
        color = "red";
    }

    if (
        role === "signer" &&
        signatory_status === "rejected" &&
        status === "rejected" &&
        !is_approve
    ) {
        kata = "unsigned (rejected)";
        color = "red";
    }

    return {
        kata: kata?.toUpperCase(),
        color
    };
};

export const colorOfItem = (action) => {
    let color;
    if (action === "opened") {
        color = "black";
    } else if (action === "rejected") {
        color = "red";
    } else if (action === "signed" || action === "reviewed") {
        color = "green";
    } else {
        color = "blue";
    }

    return color;
};

// data:application/pdf;base64,
export const convertBase64 = (dataURI) => {
    var byteString = atob(dataURI.split(",")[1]);

    // separate out the mime component
    var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    var ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], { type: mimeString });
    return blob;
};

export const isNoRecipientsForRequestFromOthers = (data) => {
    const owner = data?.recipients?.find(
        (recipient) =>
            recipient?.is_owner === true &&
            recipient?.role === null &&
            recipient?.status === "draft"
    );

    if (owner) {
        return true;
    } else {
        return false;
    }
};

export const totalNilaiAspekPekerjaan = (data) => {
    // integritas
    // kedisiplinan
    // orientasi_pelayanan
    // kerjasama_koordinasi
    // pemanfaatan_alat_media_kerj

    const integritas = round(data?.integritas, 2) * 0.25;
    const kedisiplinan = round(data?.kedisiplinan, 2) * 0.25;
    const orientasiPelayanan = round(data?.orientasi_pelayanan, 2) * 0.2;
    const kerjasamaKoordinasi = round(data?.kerjasama_koordinasi, 2) * 0.2;
    const pemanfaatanAlatMediaKerja =
        round(data?.pemanfaatan_alat_dan_media_kerja, 2) * 0.1;

    const total =
        integritas +
        kedisiplinan +
        orientasiPelayanan +
        kerjasamaKoordinasi +
        pemanfaatanAlatMediaKerja;

    return total;
};

export const listCoreValues = [
    {
        key: "berorientasi_pelayanan",
        title: "Berorientasi Pelayanan",
        description:
            "Memahami dan memenuhi kebutuhan masyarakat. Ramah, cekatan, solutif, dan dapat diandalkan, serta melakukan perbaikan tiada henti"
    },
    {
        key: "akuntabel",
        title: "Akuntabel",
        description:
            "Melaksanakan tugas dengan jujur, bertanggung jawab, cermat, serta disiplin dan berintegritas tinggi. Menggunakan kekayaan dan barang milik negara secara bertanggung jawab, efektif dan efisien, dan tidak menyalahgunakan kewenangan jabatan."
    },
    {
        key: "kompeten",
        title: "Kompeten",
        description:
            "Meningkatkan kompetensi diri untuk menjawab tantangan yang selalu berubah. Membantu orang lain belajar, dan melaksanakan tugas dengan kualitas terbaik."
    },
    {
        key: "harmonis",
        title: "Harmonis",
        description:
            "Menghargai setiap orang apapun latar belakangnya. Suka menolong orang lain, dan membangun lingkungan kerja yang kondusif."
    },
    {
        key: "loyal",
        title: "Loyal",
        description:
            "Memegang teguh ideologi Pancasila dan Undang-Undang Dasar Negara Republik Indonesia Tahun 1945, setia kepada NKRI serta pemerintahan yang sah, menjaga nama baik sesama ASN, pimpinan, instansi dan negara, serta menjaga rahasia jabatan dan negara."
    },
    {
        key: "adaptif",
        title: "Adaptif",
        description:
            "Cepat menyesuaikan diri menghadapi perubahan. Terus berinovasi dan mengembangkan kreativitas, dan bertindak proaktif."
    },
    {
        key: "kolobaratif",
        title: "Kolaboratif",
        description:
            "Memberi kesempatan kepada berbagai pihak untuk berkontribusi, terbuka dalam bekerja sama untuk menghasilkan nilai tambah, dan menggerakkan pemanfaatan berbagai sumber daya untuk tujuan bersama."
    }
];

export const nilaiCoreValues = [
    "DIBAWAH EKSPETASI",
    "SESUAI EKSPETASI",
    "DIATAS EKSPETASI"
];
