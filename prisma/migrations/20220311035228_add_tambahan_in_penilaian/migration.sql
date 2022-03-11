-- CreateTable
CREATE TABLE "acc_kinerja_bulanan" (
    "id" SERIAL NOT NULL,
    "id_penilaian" INTEGER,
    "bulan" SMALLINT,
    "tahun" SMALLINT,
    "sudah_verif" BOOLEAN DEFAULT false,
    "diverif_oleh" INTEGER,
    "id_ptt" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "acc_kinerja_bulanan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kinerja_bulanan" (
    "id" SERIAL NOT NULL,
    "id_penilaian" INTEGER,
    "deskripsi_pekerjaan" TEXT,
    "bulan" SMALLINT,
    "tahun" SMALLINT,
    "id_ptt" INTEGER,
    "kuantitas" INTEGER,
    "kualitas" INTEGER,
    "tgl_mulai_pekerjaan" TIMESTAMP(6),
    "tgl_selesai_pekerjaan" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "kinerja_bulanan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "penilaian" (
    "id" SERIAL NOT NULL,
    "id_ptt" INTEGER,
    "tahun" SMALLINT,
    "id_skpd" VARCHAR(200),
    "id_jabatan" VARCHAR(200),
    "aktif" BOOLEAN DEFAULT false,
    "sudah_verif" BOOLEAN DEFAULT false,
    "diverif_oleh" VARCHAR(200),
    "nip_atasan_langsung" VARCHAR(200),
    "nip_atasan_banding" VARCHAR(200),
    "nip_eselon_ii" VARCHAR(200),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "pekerjaan_tambahan" TEXT[],

    CONSTRAINT "penilaian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_satuan_kinerja" (
    "id" SERIAL NOT NULL,
    "nama" VARCHAR(200),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "ref_satuan_kinerja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "target_penilaian" (
    "id" SERIAL NOT NULL,
    "pekerjaan" TEXT,
    "ref_satuan_kinerja_id" INTEGER,
    "kuantitas" INTEGER,
    "id_penilaian" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "target_penilaian_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "acc_kinerja_bulanan" ADD CONSTRAINT "acc_kinerja_bulanan_id_penilaian_fkey" FOREIGN KEY ("id_penilaian") REFERENCES "penilaian"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kinerja_bulanan" ADD CONSTRAINT "kinerja_bulanan_id_penilaian_fkey" FOREIGN KEY ("id_penilaian") REFERENCES "penilaian"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "target_penilaian" ADD CONSTRAINT "target_penilaian_id_penilaian_fkey" FOREIGN KEY ("id_penilaian") REFERENCES "penilaian"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "target_penilaian" ADD CONSTRAINT "target_penilaian_ref_satuan_kinerja_id_fkey" FOREIGN KEY ("ref_satuan_kinerja_id") REFERENCES "ref_satuan_kinerja"("id") ON DELETE CASCADE ON UPDATE CASCADE;
