import { sumBy } from "lodash";

const lebarKolomPenilaian = 35;
const warnaHijau = "#78AB46";
const warnaHijauMuda = "#bbe3ac";
const warnaAbuAbu = "#dbd7c5";
const orange = "#e3d8ac";
const warnaBiru = "#1919ff";

const renderCatatanAtasanLangsung = (currentUser) => {
    const { nama, nip, golongan, pangkat, jabatan_penilai } =
        currentUser?.penilai;
    const { catatan_atasan_langsung } = currentUser;

    return {
        style: "informasi",
        table: {
            widths: ["*", 200],
            body: [
                [
                    {
                        text: "Catatan Atasan Langsung",
                        colSpan: 2,
                        style: {
                            alignment: "center",
                            font: "OpenSans",
                            fontSize: 8
                        }
                    },
                    {}
                ],
                [
                    catatan_atasan_langsung,
                    {
                        stack: [
                            {
                                text: `${jabatan_penilai}`,
                                style: "headerTtd"
                            },
                            {
                                text: `${nama}`,
                                style: "namaTerang"
                            },
                            {
                                text: `${golongan}-${pangkat}`,
                                style: "namaAtasan"
                            },
                            {
                                text: `NIP. ${nip}`,
                                style: "namaAtasan"
                            }
                        ],
                        alignment: "center"
                    }
                ]
            ]
        }
    };
};

const renderPerilakuKerja = (perilakuKerja, total) => {
    const perilaku = perilakuKerja?.map((a, b) => [
        `${b + 1}.`,
        a?.name,
        a?.nilaiSekarang,
        a?.bobot,
        a?.nilai
    ]);

    return {
        style: "informasi",
        table: {
            widths: [
                20,
                "*",
                lebarKolomPenilaian,
                lebarKolomPenilaian,
                lebarKolomPenilaian
            ],
            body: [
                [
                    { text: "No", fillColor: warnaHijau },
                    { text: "PERILAKU KERJA", fillColor: warnaHijau },
                    { text: "SKOR PENILAIAN", fillColor: warnaHijau },
                    { text: "BOBOT PENILAIAN", fillColor: warnaHijau },
                    { text: "NILAI AKHIR", fillColor: warnaHijau }
                ],
                [
                    {
                        text: "ASPEK TEKNIS PEKERJAAN",
                        colSpan: 5,
                        fillColor: warnaHijauMuda
                    },
                    {},
                    {},
                    {},
                    {}
                ],
                ...perilaku,
                [
                    {
                        text: "TOTAL NILAI ASPEK TEKNIS PEKERJAAN",
                        colSpan: 3,
                        style: "totalNilai"
                    },
                    {},
                    {},
                    { text: 100, style: "totalNilai" },
                    { text: total, style: "totalNilai" }
                ]
            ]
        }
    };
};

const renderHeader = ({ tahun }) => {
    return {
        table: {
            widths: ["*", 200],
            body: [
                [
                    {
                        rowSpan: 2,
                        text: `FORMULIR EVALUASI KINERJA TAHUN ${tahun}`,
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

const renderRincianPekerjaan = (listKerja) => {
    let listKerjaTahunan;
    let total = 0;

    const totalCapaian = function (capaianKerjaBulanan) {
        if (capaianKerjaBulanan?.length === 0) {
            return 0;
        } else {
            return sumBy(capaianKerjaBulanan, "kuantitas");
        }
    };

    if (listKerja?.length > 0) {
        listKerjaTahunan = listKerja?.map((x, index) => {
            const satuanKuantitas = x?.ref_satuan_kinerja?.nama;
            const kuantitas = x?.kuantitas;
            const capaian = totalCapaian(x?.kinerja_bulanan);
            const presentaseCapaian = (capaian / kuantitas) * 100;
            const newPresentase =
                presentaseCapaian <= 0
                    ? presentaseCapaian?.toFixed(0)
                    : presentaseCapaian?.toFixed(2);

            const presentase = newPresentase > 100 ? 100 : newPresentase;
            total = total + presentase;

            return [
                `${index + 1}.`,
                x.pekerjaan,
                { text: kuantitas, fillColor: orange },
                { text: satuanKuantitas, fillColor: orange },
                { text: capaian, fillColor: warnaHijauMuda },
                { text: satuanKuantitas, fillColor: warnaHijauMuda },
                { text: `${presentase}%`, fillColor: warnaAbuAbu }
            ];
        });
    } else {
        listKerjaTahunan = [];
    }

    const currentTotal =
        listKerja?.length === 0 ? 0 : total / listKerja?.length;

    return {
        style: "informasi",
        table: {
            widths: [20, "*", 50, 50, 50, 50, lebarKolomPenilaian],
            body: [
                [
                    { rowSpan: 2, text: "No" },
                    { rowSpan: 2, text: "RINCIAN PEKERJAAN" },
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
                        text: "PENILAIAN",
                        rowSpan: 2,
                        style: { fillColor: warnaAbuAbu }
                    }
                ],
                [
                    {},
                    {},
                    { text: "Kuantitas", fillColor: orange },
                    { text: "Satuan", fillColor: orange },
                    { text: "Kuantitas", fillColor: warnaHijauMuda },
                    { text: "Satuan", fillColor: warnaHijauMuda },
                    ""
                ],
                // berisikan nomer, detail kegiatan, target kuantitas, capaian kuantitas dan penilaian
                ...listKerjaTahunan,
                // ['1.', 'Melakukan kegiatan', '100', 'Barang', '100', 'bara', '100'],
                // ['2.', 'Melakukan kegiatan', '100', 'Barang', '100', 'bara', '100'],
                // total penilaian
                [
                    { colSpan: 6, text: "Nilai Rincian Pekerjaan" },
                    {},
                    {},
                    {},
                    {},
                    {},
                    {
                        // text: `${total}%`,
                        text: `${currentTotal}`,
                        style: { fillColor: warnaAbuAbu }
                    }
                ]
            ]
        }
    };
};

const renderTugasTambahan = (pekerjaanTambahan, total) => {
    let listPekerjaanTambahan;

    if (pekerjaanTambahan?.length > 0) {
        // jika panjangnya ganjil tambahkan 1 tapi kosong
        const pekerjaanTambahanCustom =
            pekerjaanTambahan?.length % 2 === 0
                ? pekerjaanTambahan
                : [...pekerjaanTambahan, { title: "" }];

        listPekerjaanTambahan = pekerjaanTambahanCustom?.map((x, index) => {
            return (index + 1) % 2 === 0
                ? [{ text: `${index + 1}.` }, { text: x?.title }, {}]
                : [
                      { text: `${index + 1}.` },
                      { text: x?.title },
                      { text: "1", rowSpan: 2 }
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
                    {
                        colSpan: 2,
                        text: "TOTAL NILAI CAPAIAN KINERJA",
                        style: "totalNilai"
                    },
                    {},
                    // { text: `${total}%`, style: "totalNilai" }
                    { text: `${total} %`, style: "totalNilai" }
                ]
            ]
        }
    };
};

export const generateKinerjaTahunanFull = (currentUser) => {
    const docDefinition = {
        pageSize: "FOLIO",
        footer: {
            columns: [
                {
                    text: "*) Laporan digenerate otomatis oleh Aplikasi PTT PK",
                    style: {
                        font: "OpenSans",
                        fontSize: 8,
                        margin: [6, 0, 0, 0]
                    }
                }
            ]
        },

        // current styles
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
            namaTerang: {
                fontSize: 8,
                font: "OpenSans",
                decoration: "underline"
            },
            header: {
                margin: [0, 18, 0, 0],
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
            },
            totalNilai: {
                fillColor: "#ffff00"
            }
        },
        info: {
            author: "BKD Jatim",
            subject: "Penilaian Kinerja PTTPK"
        },
        pageMargins: [15, 15, 15, 15],
        content: [
            // header bangsat
            renderHeader({ tahun: currentUser.tahun }),
            renderInformasi(currentUser),

            // tugas
            renderRincianPekerjaan(
                currentUser.listKegiatanTahunan,
                currentUser.nilaiRincianPekerjaan
            ),

            renderTugasTambahan(
                currentUser.listPekerjaanTambahan,
                currentUser.totalNilaiCapaianKinerja
            ),

            renderPerilakuKerja(
                currentUser.currentPerilaku,
                currentUser.totalPerilaku
            ),

            // // tetek bengek
            renderCatatanAtasanLangsung(currentUser),
            // // render tambahan nilai
            // renderNilai(
            //     currentUser?.nilaiRincianPekerjaan,
            //     currentUser?.totalPerilaku
            // ),
            renderHasil(currentUser.rekom),
            renderKeterangan(),
            renderPerjanjian(currentUser)
            //   this._renderBarcode(currentUser),
        ]
    };

    return docDefinition;
};

const renderNilai = (totalCapaianKinerja, totalAspekTeknisPekerjaan) => {
    return [
        {
            text: `Total Nilai Capaian Kinerja = ${totalCapaianKinerja} dan Total Perilaku = ${totalAspekTeknisPekerjaan}`,
            style: "rekom"
        }
    ];
};

const renderHasil = (rekom) => {
    return {
        style: "rekom",
        table: {
            width: ["40%", "20%"],
            body: [
                [
                    { text: "REKOMENDASI" },
                    { text: rekom ? "DILANJUTKAN" : "TIDAK DILANJUTKAN" }
                ]
            ]
        }
    };
};

const renderKeterangan = () => {
    return [
        {
            text: "*) Keterangan Penilaian: Jika total nilai capaian kinerja < 70% dan nilai aspek teknis pekerjaan < 70 rekomendasi : TIDAK dilanjutkan",
            style: "informasi"
        }
    ];
};

const renderPerjanjian = (currentUser) => {
    const { tempat_waktu, penandatangan, nama, niptt } = currentUser;

    return {
        style: "perjanjian",
        table: {
            widths: ["50%", "50%"],
            body: [
                [
                    {},
                    {
                        text: `${tempat_waktu?.tempat} ${tempat_waktu?.waktu}`,
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
                            penandatangan?.is_having_atasnama
                                ? "Atas Nama"
                                : null,
                            {
                                text: `${penandatangan?.jabatan_penandatangan}`,
                                style: "headerTtd"
                            }
                        ],
                        alignment: "center"
                    }
                ],
                [
                    {
                        stack: [
                            { text: `${nama}`, style: "namaTerang" },
                            { text: `NIPTT-PK : ${niptt}`, style: "namaAtasan" }
                        ],
                        alignment: "center"
                    },
                    {
                        stack: [
                            {
                                text: `${penandatangan?.nama_penandatangan}`,
                                style: "namaTerang"
                            },
                            {
                                text: `${penandatangan?.golongan_penandatangan}-${penandatangan?.pangkat_penandatangan}`,
                                style: "namaAtasan"
                            },
                            {
                                text: `NIP. ${penandatangan?.nip_penandatangan}`,
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
