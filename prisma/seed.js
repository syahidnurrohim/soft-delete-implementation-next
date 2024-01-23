const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const universities = [
  {
    name: "University 1",
    address: "123 University St",
    students: [
      { student_id: "S1", name: "Student 1", address: "123 Student St" },
      { student_id: "S2", name: "Student 2", address: "456 Student St" },
    ],
  },
  {
    name: "University 2",
    address: "456 University St",
    students: [
      { student_id: "S3", name: "Student 3", address: "789 Student St" },
      { student_id: "S4", name: "Student 4", address: "101 Student St" },
    ],
  },
  // Add more universities and students as needed
];

async function main() {
  console.log(`Start seeding ...`);
  for (const universityData of universities) {
    const { students, ...university } = universityData;

    const createdUniversity = await prisma.university.create({
      data: {
        ...university,
        students: {
          create: students,
        },
      },
    });
    console.log(`University seeded: ${createdUniversity.name}`);
  }

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
