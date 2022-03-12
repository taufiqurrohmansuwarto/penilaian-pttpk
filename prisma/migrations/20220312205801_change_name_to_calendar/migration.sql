/*
  Warnings:

  - You are about to drop the column `tgl_mulai_pekerjaan` on the `kinerja_bulanan` table. All the data in the column will be lost.
  - You are about to drop the column `tgl_selesai_pekerjaan` on the `kinerja_bulanan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "kinerja_bulanan" DROP COLUMN "tgl_mulai_pekerjaan",
DROP COLUMN "tgl_selesai_pekerjaan",
ADD COLUMN     "end" TIMESTAMP(6),
ADD COLUMN     "start" TIMESTAMP(6);
