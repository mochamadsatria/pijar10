import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const produkId = req.query.id;

  if (req.method === "DELETE") {
    handleDELETE(produkId as string, res);
  } else if (req.method === "PUT") {
    handlePUT(produkId as string, req.body, res);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}

// DELETE /api/produk/:id
async function handleDELETE(produkId: string, res: NextApiResponse<any>) {
  const produk = await prisma.produk.delete({
    where: { id: Number(produkId) },
  });
  res.json(produk);
}

// PUT /api/produk/:id
async function handlePUT(
  produkId: string,
  data: any,
  res: NextApiResponse<any>
) {
  let parsedData = JSON.parse(data);

  parsedData.harga = Number(parsedData.harga);
  parsedData.jumlah = Number(parsedData.jumlah);

  const produk = await prisma.produk.update({
    where: { id: Number(produkId) },
    data: { ...parsedData },
  });
  res.json(produk);
}
