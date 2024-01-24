import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const filter = ["student_id", "name", "university_id", "address"];
    const filtered = filter.filter((prop) => {
      return (
        !Object.keys(req.body.data).includes(prop) || req.body.data[prop] == ""
      );
    });
    if (filtered.length > 0) {
      return res.json({
        status: "error",
        message: filtered[0] + " wajib di isi",
      });
    }
    await prisma.student.create({
      data: req.body.data,
    });

    return res.json({ status: "success", message: "Data berhasil disimpan" });
  } else if (req.method === "PUT") {
    const fillable = ["student_id", "name", "university_id", "address"];
    const idToUpdate = req.body.uuid;
    const dataToUpdate = Object.keys(req.body.data)
      .filter((prop) => {
        return fillable.includes(prop);
      })
      .reduce((a, b) => ({ ...a, [b]: req.body.data[b] }), {});
    const student = await prisma.student.findUnique({
      where: {
        uuid: idToUpdate,
      },
    });
    if (!student) {
      return res.json({ status: "error", message: "Data tidak ditemukan" });
    }

    await prisma.student.update({
      where: {
        uuid: idToUpdate,
      },
      data: dataToUpdate,
    });
    return res.json({ status: "success", message: "Data berhasil diupdate" });
  } else {
    const students = await prisma.student.findMany({
      orderBy: [
        {
          student_id: "asc",
        },
      ],
      include: {
        university: true,
      },
    });
    return res.json({
      data: students,
    });
  }
}
