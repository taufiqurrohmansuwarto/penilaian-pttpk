const lebarKolomPenilaian = 20;
const warnaHijau = "#78AB46";
const warnaHijauMuda = "#bbe3ac";
const warnaAbuAbu = "#dbd7c5";
const orange = "#e3d8ac";
const warnaBiru = "#1919ff";

import { meanBy, round } from "lodash";

const renderHeader = (bulan, tahun, type = "standard") => {
    let currentText;

    if (type === "standard") {
        currentText = `FORMULIR EVALUASI KINERJA TAHUN ${tahun}`;
    } else if (type === "asn") {
        currentText = `Nilai Dasar Aparatur Sipil Negara BerAKHLAK ${tahun}`;
    }

    return {
        table: {
            widths: ["*", 200],
            body: [
                [
                    {
                        rowSpan: 2,
                        stack: [
                            {
                                text: `${currentText}`
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

const renderCoreValues = (data, headerTitle, userInfo) => {
    const hasil = (key) => {
        return data?.find((d) => d?.key === key)?.value;
    };

    return {
        pageBreak: "before",
        columns: [
            {
                stack: [
                    headerTitle,
                    userInfo,
                    {
                        style: "informasi2",
                        table: {
                            widths: [15, 100, "*", 100],
                            body: [
                                [
                                    { text: "No." },
                                    { text: "Nilai Dasar" },
                                    { text: "Deskripsi" },
                                    { text: "Nilai" }
                                ],
                                [
                                    { text: "1" },
                                    { text: "Berorientasi Pelayanan" },
                                    {
                                        text: "Memahami dan memenuhi kebutuhan masyarakat. Ramah, cekatan, solutif, dan dapat diandalkan, serta melakukan perbaikan tiada henti"
                                    },
                                    {
                                        text: hasil("berorientasi_pelayanan")
                                    }
                                ],
                                [
                                    { text: "2" },
                                    { text: "Akuntabel" },
                                    {
                                        text: "Melaksanakan tugas dengan jujur, bertanggung jawab, cermat, serta disiplin dan berintegritas tinggi. Menggunakan kekayaan dan barang milik negara secara bertanggung jawab, efektif dan efisien, dan tidak menyalahgunakan kewenangan jabatan."
                                    },
                                    {
                                        text: hasil("akuntabel")
                                    }
                                ],
                                [
                                    { text: "3" },
                                    { text: "Kompeten" },
                                    {
                                        text: "Meningkatkan kompetensi diri untuk menjawab tantangan yang selalu berubah. Membantu orang lain belajar, dan melaksanakan tugas dengan kualitas terbaik."
                                    },
                                    {
                                        text: hasil("kompeten")
                                    }
                                ],
                                [
                                    { text: "4" },
                                    { text: "Harmonis" },
                                    {
                                        text: "Menghargai setiap orang apapun latar belakangnya. Suka menolong orang lain, dan membangun lingkungan kerja yang kondusif."
                                    },
                                    {
                                        text: hasil("harmonis")
                                    }
                                ],
                                [
                                    { text: "5" },
                                    { text: "Loyal" },
                                    {
                                        text: "Memegang teguh ideologi Pancasila dan Undang-Undang Dasar Negara Republik Indonesia Tahun 1945, setia kepada NKRI serta pemerintahan yang sah, menjaga nama baik sesama ASN, pimpinan, instansi dan negara, serta menjaga rahasia jabatan dan negara."
                                    },
                                    {
                                        text: hasil("loyal")
                                    }
                                ],
                                [
                                    { text: "6" },
                                    { text: "Adaptif" },
                                    {
                                        text: "Cepat menyesuaikan diri menghadapi perubahan. Terus berinovasi dan mengembangkan kreativitas, dan bertindak proaktif."
                                    },
                                    {
                                        text: hasil("adaptif")
                                    }
                                ],
                                [
                                    { text: "7" },
                                    { text: "Kolaboratif" },
                                    {
                                        text: "Memberi kesempatan kepada berbagai pihak untuk berkontribusi, terbuka dalam bekerja sama untuk menghasilkan nilai tambah, dan menggerakkan pemanfaatan berbagai sumber daya untuk tujuan bersama."
                                    },
                                    {
                                        text: hasil("kolaboratif")
                                    }
                                ]
                            ]
                        }
                    }
                ]
            }
        ]
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
                    { colSpan: 7, text: "Rerata", style: { fontSize: 6 } },
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {
                        text: cuti
                            ? "CUTI"
                            : round(meanBy(listKerja, "kualitas"), 1),
                        style: { fontSize: 6 }
                    }
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
            informasi2: {
                margin: [0, 3, 0, 1],
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
            renderPerjanjian(currentUser),
            renderCoreValues(
                currentUser?.core_values_asn,
                renderHeader(currentUser.bulan, currentUser.tahun, "asn"),
                renderInformasi(currentUser)
            )
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
