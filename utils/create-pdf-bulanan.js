const lebarKolomPenilaian = 20;
const warnaHijau = "#78AB46";
const warnaHijauMuda = "#bbe3ac";
const warnaAbuAbu = "#dbd7c5";
const orange = "#e3d8ac";
const warnaBiru = "#1919ff";

import { meanBy } from "lodash";

const renderHeader = (bulan, tahun) => {
    return {
        table: {
            widths: ["*", 200],
            body: [
                [
                    {
                        rowSpan: 2,
                        stack: [
                            {
                                text: `FORMULIR EVALUASI KINERJA TAHUN ${tahun}`
                            },
                            { text: `BULAN ${bulan}` }
                        ],
                        style: "header"
                    },
                    { text: "PTT-PK", style: "headerSatu" }
                ],
                [
                    "",
                    {
                        text: "PEGAWAI TIDAK TETAP DENGAN PERJANJIAN KERJA",
                        style: "headerDua"
                    }
                ]
            ]
        }
    };
};

const renderInformasi = (currentUser) => {
    return {
        columns: [
            {
                style: "informasi",
                table: {
                    widths: [60, 2, "*"],
                    body: [
                        [
                            { text: "UNIT KERJA" },
                            { text: ":" },
                            { text: `${currentUser?.skpd}` }
                        ],
                        [
                            { text: "NAMA" },
                            { text: ":" },
                            { text: `${currentUser?.nama}` }
                        ],
                        [
                            { text: "NI PTT-PK" },
                            { text: ":" },
                            { text: `${currentUser?.niptt}` }
                        ],
                        [
                            { text: "JABATAN" },
                            { text: ":" },
                            { text: `${currentUser?.jabatan}` }
                        ],
                        [
                            { text: "MASA KERJA" },
                            { text: ":" },
                            { text: `${currentUser?.pengalaman}` }
                        ],
                        [
                            { text: "PERIODE" },
                            { text: ":" },
                            { text: `${currentUser?.tahun}` }
                        ]
                        // [{ text: "STATUS" }, { text: ":" }, { text: `DRAFT` }],
                    ]
                },
                width: "85%"
            },
            {
                image: `data:image/jpeg;base64,${currentUser?.foto}`,
                fit: [80, 80]
            }
        ],
        columnGap: 5
    };
};

const renderTugasTambahan = (pekerjaanTambahan, total) => {
    let listPekerjaanTambahan;

    if (pekerjaanTambahan.length > 0) {
        // jika panjangnya ganjil tambahkan 1 tapi kosong
        const pekerjaanTambahanCustom =
            pekerjaanTambahan.length % 2 === 0
                ? pekerjaanTambahan
                : [...pekerjaanTambahan, { deskripsi: "" }];

        listPekerjaanTambahan = pekerjaanTambahanCustom.map((x, index) => {
            return (index + 1) % 2 === 0
                ? [{ text: `${index + 1}.` }, { text: x.deskripsi }, {}]
                : [
                      { text: `${index + 1}.` },
                      { text: x.deskripsi },
                      { text: "1%", rowSpan: 2 }
                  ];
        });
    } else {
        listPekerjaanTambahan = [];
    }

    return {
        style: "informasi",
        table: {
            widths: [20, "*", lebarKolomPenilaian],
            body: [
                [
                    { text: "No" },
                    { text: "TUGAS TAMBAHAN", style: { alignment: "center" } },
                    { text: "Bobot" }
                ],
                ...listPekerjaanTambahan,
                [
                    { colSpan: 2, text: "TOTAL NILAI CAPAIAN KINERJA" },
                    {},
                    { text: `${total}%` }
                ]
            ]
        }
    };
};

const renderRincianPekerjaan = (listKerja, cuti) => {
    let listKerjaTahunan;

    if (listKerja.length > 0) {
        listKerjaTahunan = listKerja?.map((x, index) => {
            const satuanKuantitas =
                x?.target_penilaian?.ref_satuan_kinerja?.nama;
            const kuantitas = x?.target_penilaian?.kuantitas;
            const capaian = x?.kuantitas;
            const nilai = x?.kualitas;
            const rincianPekerjaan = x?.title;
            const indukKegiatan = x?.target_penilaian?.pekerjaan;

            return [
                `${index + 1}.`,
                rincianPekerjaan,
                indukKegiatan,
                { text: kuantitas, fillColor: orange },
                { text: satuanKuantitas, fillColor: orange },
                { text: capaian, fillColor: warnaHijauMuda },
                { text: satuanKuantitas, fillColor: warnaHijauMuda },
                { text: nilai, fillColor: warnaAbuAbu }
            ];
        });
    } else {
        listKerjaTahunan = [];
    }

    return {
        style: "informasi",
        table: {
            widths: [15, 175, 175, 30, 30, 30, 30, lebarKolomPenilaian],
            body: [
                [
                    { rowSpan: 2, text: "No" },
                    { rowSpan: 2, text: "RINCIAN PEKERJAAN" },
                    { rowSpan: 2, text: "INDUK KEGIATAN" },
                    {
                        text: "TARGET",
                        colSpan: 2,
                        style: { alignment: "center", fillColor: orange }
                    },
                    {},
                    {
                        text: "CAPAIAN",
                        colSpan: 2,
                        style: {
                            alignment: "center",
                            fillColor: warnaHijauMuda
                        }
                    },
                    {},
                    {
                        text: "NILAI",
                        rowSpan: 2,
                        style: { fillColor: warnaAbuAbu }
                    }
                ],
                [
                    {},
                    {},
                    {},
                    {
                        text: "Kuantitas",
                        fillColor: orange,
                        style: { fontSize: 6 }
                    },
                    {
                        text: "Satuan",
                        fillColor: orange,

                        style: { fontSize: 6 }
                    },
                    {
                        text: "Kuantitas",
                        fillColor: warnaHijauMuda,

                        style: { fontSize: 6 }
                    },
                    {
                        text: "Satuan",
                        fillColor: warnaHijauMuda,
                        style: { fontSize: 6 }
                    },
                    ""
                ],
                // berisikan nomer, detail kegiatan, target kuantitas, capaian kuantitas dan penilaian
                ...listKerjaTahunan,
                [
                    { colSpan: 7, text: "Rerata" },
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    { text: cuti ? "CUTI" : meanBy(listKerja, "kualitas") }
                ]
            ]
        }
    };
};

const renderPerjanjian = (currentUser) => {
    const { nama, niptt } = currentUser;
    const ttd = currentUser?.ttd;
    const {
        tempat,
        tanggal,
        is_having_atasnama,
        pejabat,
        jabatan_penandatangan
    } = ttd;

    return {
        style: "perjanjian",
        table: {
            widths: ["50%", "40%"],
            body: [
                [
                    {},
                    {
                        text: `${tempat}, ${tanggal}`,
                        alignment: "center"
                    }
                ],
                [
                    {
                        stack: [
                            {
                                text: "PTT-PK yang bersangkutan",
                                style: "headerTtd"
                            }
                        ],
                        alignment: "center"
                    },
                    {
                        stack: [
                            // { text: `a.n Pimpinan` },
                            is_having_atasnama ? { text: "Atas Nama" } : null,
                            {
                                text: `${jabatan_penandatangan}`,
                                style: "headerTtd"
                            }
                        ],
                        alignment: "center"
                    }
                ],
                [
                    {
                        stack: [
                            { text: `${nama}`, style: "namaAtasanBaru" },
                            { text: `NIPTT-PK : ${niptt}`, style: "namaAtasan" }
                        ],
                        alignment: "center"
                    },
                    {
                        stack: [
                            {
                                text: `${pejabat?.nama}`,
                                style: "namaAtasanBaru"
                            },
                            {
                                text: `${pejabat?.golongan} ${pejabat?.pangkat}`,
                                style: "namaAtasan"
                            },
                            {
                                text: `NIP. ${pejabat?.nip}`,
                                style: "namaAtasan"
                            }
                        ],
                        alignment: "center"
                    }
                ]
            ]
        },
        layout: "noBorders"
    };
};

export const generatePdf = (currentUser) => {
    const { penilai, tanggal_dinilai } = currentUser;

    const docDefinition = {
        pageSize: "FOLIO",
        footer: {
            columns: [
                {
                    text: `*) Laporan digenerate oleh Aplikasi PTT PK dinilai oleh ${penilai} pada tanggal ${tanggal_dinilai}`,
                    style: {
                        font: "OpenSans",
                        fontSize: 8,
                        margin: [6, 0, 0, 0]
                    }
                }
            ]
        },

        styles: {
            informasi: {
                margin: [0, 1, 0, 1],
                fontSize: 8,
                font: "OpenSans"
            },

            rekom: {
                margin: [0, 1, 0, 1],
                fontSize: 10,
                font: "OpenSans"
            },
            perjanjian: {
                margin: [0, 30, 0, 0],
                fontSize: 8,
                font: "OpenSans"
            },
            headerTtd: {
                fontSize: 8,
                margin: [0, 0, 0, 40],
                font: "OpenSans"
            },
            namaAtasan: {
                fontSize: 8,
                font: "OpenSans"
            },
            namaAtasanBaru: {
                fontSize: 8,
                font: "OpenSans",
                bold: true,
                decoration: "underline"
            },
            namaTerang: {
                fontSize: 8,
                font: "OpenSans",
                decoration: "underline"
            },
            header: {
                margin: [0, 7, 0, 0],
                alignment: "center",
                fillColor: warnaHijau,
                font: "OpenSans"
            },
            headerSatu: {
                alignment: "center",
                font: "OpenSans",
                fillColor: warnaBiru
            },
            headerDua: {
                alignment: "center",
                font: "OpenSans",
                fontSize: 9,
                fillColor: "#ffff00"
            }
        },
        info: {
            author: "BKD Jatim",
            subject: "Penilaian Kinerja PTTPK"
        },
        pageMargins: [15, 15, 15, 15],
        content: [
            renderHeader(currentUser.bulan, currentUser.tahun),
            renderInformasi(currentUser),
            renderRincianPekerjaan(
                currentUser?.listKegiatanBulanan,
                currentUser?.cuti
            ),
            renderCatatanAtasan(currentUser?.catatan),
            renderPerjanjian(currentUser)
        ]
    };

    return docDefinition;
};

const renderCatatanAtasan = (catatan) => {
    return {
        style: "informasi",
        table: {
            widths: ["*"],
            body: [
                [
                    {
                        text: "Catatan Atasan Langsung",
                        style: {
                            alignment: "center",
                            font: "OpenSans",
                            fontSize: 8
                        }
                    }
                ],
                [
                    {
                        stack: [
                            { text: catatan },
                            { text: " " },
                            { text: " " },
                            { text: " " },
                            { text: " " },
                            { text: " " },
                            { text: " " },
                            { text: " " },
                            { text: " " },
                            { text: " " },
                            { text: " " }
                        ]
                    }
                ]
            ]
        }
    };
};
