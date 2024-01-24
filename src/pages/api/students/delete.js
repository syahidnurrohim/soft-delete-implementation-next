import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const idToBeDelete = req.body.id;
    const recepient = await prisma.$transaction(async (tx) => {
      const student = await tx.student.findUnique({
        where: {
          uuid: idToBeDelete,
        },
      });
      if (!student) {
        return res.json({
          status: "error",
          message: "Student not found",
        });
      }
      const bin = await tx.bin.create({
        data: {
          table_name: "Student",
          row: student,
        },
      });

      return await tx.student.delete({
        where: {
          uuid: idToBeDelete,
        },
      });
    });

    return res.json({
      status: "success",
      message: "Data berhasil dihapus",
    });
    // Process a POST request
  }
}
