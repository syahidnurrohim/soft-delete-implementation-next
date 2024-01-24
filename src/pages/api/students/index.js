import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Process a POST request
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
