import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const bulkIdToDelete = req.body.id;
    if (!bulkIdToDelete.length) {
      return res.json({
        status: "error",
        message: "Tidak ada data yang akan dihapus",
      });
    }
    const recepient = await prisma.$transaction(async (tx) => {
      const deleted = [];
      for (const idToBeDelete of bulkIdToDelete) {
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

        deleted.push(
          await tx.student.delete({
            where: {
              uuid: idToBeDelete,
            },
          }),
        );
      }

      return deleted;
    });

    return res.json({
      status: "success",
      message: "Data berhasil dihapus",
      data: {
        recepient,
      },
    });
    // Process a POST request
  }
}
