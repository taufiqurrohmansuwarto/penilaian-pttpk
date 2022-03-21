-- AlterTable
ALTER TABLE "kinerja_bulanan" ADD COLUMN     "id_target_penilaian" INTEGER;

-- AddForeignKey
ALTER TABLE "kinerja_bulanan" ADD CONSTRAINT "kinerja_bulanan_id_target_penilaian_fkey" FOREIGN KEY ("id_target_penilaian") REFERENCES "target_penilaian"("id") ON DELETE CASCADE ON UPDATE CASCADE;
