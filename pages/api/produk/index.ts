import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    handlePOST(req.body, res);
  } else if (req.method === "GET") {
    handleGET(res);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}

// POST /api/produk
// Required fields in body: nama_produk, harga
// Optional fields in body: keterangan, jumlah
async function handlePOST(data: any, res: NextApiResponse<any>) {
  let parsedData = JSON.parse(data);

  parsedData.harga = Number(parsedData.harga);
  parsedData.jumlah = Number(parsedData.jumlah);

  const result = await prisma.produk.create({
    data: {
      ...parsedData,
    },
  });
  res.json(result);
}

// GET /api/produk
async function handleGET(res: NextApiResponse<any>) {
  const produk = await prisma.produk.findMany({});
  res.json(produk);
}
