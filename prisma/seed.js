const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
// Generate a random number of students for each university
function generateStudents() {
  const numStudents = 50;
  const students = [];

  for (let i = 1; i <= numStudents; i++) {
    const student = {
      student_id: `S${i}`,
      name: "Student " + i,
      address: "Address Student " + i,
    };

    students.push(student);
  }

  return students;
}

// Generate 100 sets of seed data
const seedData = [];

for (let i = 1; i <= 10; i++) {
  const university = {
    name: `University ${i}`,
    address: "Address University " + i,
    students: generateStudents(),
  };

  seedData.push(university);
}

async function main() {
  console.log(`Start seeding ...`);
  for (const universityData of seedData) {
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
