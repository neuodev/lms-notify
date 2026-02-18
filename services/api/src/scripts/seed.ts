import * as bcrypt from "bcrypt";
import { prisma } from "../lib/db";

async function main() {
  const adminEmail = "mostafakamar.dev@gmail.com";
  const adminPassword = "24689110134";

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

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

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
