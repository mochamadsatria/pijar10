-- CreateTable
CREATE TABLE "Produk" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nama_produk" TEXT NOT NULL,
    "keterangan" TEXT,
    "harga" INTEGER NOT NULL,
    "jumlah" INTEGER DEFAULT 0
);
