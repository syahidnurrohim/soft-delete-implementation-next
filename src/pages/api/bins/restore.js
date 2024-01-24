import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const idToRestore = req.body.id;
  if (req.method === "POST") {
    const receipt = await prisma.$transaction(async (tx) => {
      const bin = await tx.bin.findUnique({
        where: {
          uuid: idToRestore,
        },
      });
      if (!bin) {
        return res.json({
          status: "error",
          message: "Data tidak ditemukan",
        });
      }
      await tx[bin.table_name.toLowerCase()].create({
        data: bin.row,
      });

      return await tx.bin.delete({
        where: {
          uuid: idToRestore,
        },
      });
    });

    return res.json({
      status: "success",
      message: "Data berhasil di restore",
      data: {
        receipt,
      },
    });
  }
}
