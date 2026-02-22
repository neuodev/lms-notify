import * as bcrypt from "bcrypt";
import { prisma } from "../lib/db";
import { LmsType } from "@/generated/prisma/client";

const schools: { name: string; lmsType: LmsType }[] = [
  // Lernovia schools
  {
    name: "مدرسة النور Lernovia",
    lmsType: "LERNOVIA",
  },
  {
    name: "مدرسة الأندلس Lernovia",
    lmsType: "LERNOVIA",
  },
  // Classera schools
  {
    name: "مدرسة الفيصل Classera",
    lmsType: "CLASSERA",
  },
  {
    name: "مدرسة النهضة Classera",
    lmsType: "CLASSERA",
  },
  // Microsoft Teams schools
  {
    name: "مدرسة الأقصى Teams",
    lmsType: "TEAMS",
  },
  {
    name: "مدرسة السلام Teams",
    lmsType: "TEAMS",
  },
  // Coligo schools
  {
    name: "مدرسة الهدى Coligo",
    lmsType: "COLIGO",
  },
  {
    name: "مدرسة الإيمان Coligo",
    lmsType: "COLIGO",
  },
];

async function main() {
  const adminEmail = "mostafakamar.dev@gmail.com";
  const password = "24689110134";

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

  for (const school of schools) {
    const existing = await prisma.school.findFirst({
      where: { name: school.name },
    });

    if (!existing) {
      await prisma.school.create({
        data: {
          name: school.name,
          password: hashedPassword, // same password for all – change in production
          lmsType: school.lmsType,
        },
      });
      console.log(`✅ Created school: ${school.name}`);
    } else {
      console.log(`⏭️  School already exists: ${school.name}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
