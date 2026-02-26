import * as bcrypt from "bcrypt";
import { prisma } from "../lib/db";
import { LmsType } from "@/generated/prisma/client";

const schools: { name: string; lmsType: LmsType }[] = [
  {
    name: "New Vision School",
    lmsType: "LERNOVIA",
  },
];

async function createSchools() {
  const password = "sila@123";

  const hashedPassword = await bcrypt.hash(password, 10);

  for (const school of schools) {
    const existing = await prisma.school.findFirst({
      where: { name: school.name },
    });

    if (!existing) {
      await prisma.school.create({
        data: {
          name: school.name,
          password: hashedPassword,
          lmsType: school.lmsType,
        },
      });
      console.log(`✅ Created school: ${school.name}`);
    } else {
      console.log(`⏭️  School already exists: ${school.name}`);
    }
  }
}

async function createAdmin() {
  const adminEmail = "mohsen@sila.com";
  const password = "sila@123";

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    },
  });
  console.log({ admin });
}

createAdmin()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
