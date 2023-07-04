import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
  
  await prisma.post.create({
    data: {
      slug: "running-di-gbk",
      title: "running bareng di GBK",
      userId: user.id,
      imageUrl: 'https://img.freepik.com/free-photo/yoga-group-classes-inside-gym_1303-14788.jpg?w=1800&t=st=1688157455~exp=1688158055~hmac=f08fce9b503b386154792454137d76ffb7e4e18b12e43df3ab6ad9688c30f8c0',
      body: "yuk running di GBK setiap sabtu jam 9 am titik poin di depan halte"    
    },
});
  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });