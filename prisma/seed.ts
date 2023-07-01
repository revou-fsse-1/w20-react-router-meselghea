import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const name = "Rachel";
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma.note.create({
    data: {
      title: "My first note",
      body: "Hello, world!",
      userId: user.id,
      imageUrl: 'https://img.freepik.com/free-photo/yoga-group-classes-inside-gym_1303-14788.jpg?w=1800&t=st=1688157455~exp=1688158055~hmac=f08fce9b503b386154792454137d76ffb7e4e18b12e43df3ab6ad9688c30f8c0',
    },
  });

  await prisma.note.create({
    data: {
      title: "My second note",
      body: "Hello, world!",
      userId: user.id,
      imageUrl: 'https://img.freepik.com/free-photo/happy-asian-woman-stretching-exercise-yoga-workout-morning-home-outdoor_640221-470.jpg?w=1800&t=st=1688157507~exp=1688158107~hmac=96c1359bd27bb3bf088fa60f485c87aa71d55ec131cdbfa19a71971998611df9',
    },
  });
  
  const posts = [
    {
      slug: "my-first-post",
      title: "My First Post",
      markdown: `
  # This is my first post
  
  Isn't it great?
      `.trim(),
    },
    {
      slug: "90s-mixtape",
      title: "A Mixtape I Made Just For You",
      markdown: `
  # 90s Mixtape
  
  - I wish (Skee-Lo)
  - This Is How We Do It (Montell Jordan)
  - Everlong (Foo Fighters)
  - Ms. Jackson (Outkast)
  - Interstate Love Song (Stone Temple Pilots)
  - Killing Me Softly With His Song (Fugees, Ms. Lauryn Hill)
  - Just a Friend (Biz Markie)
  - The Man Who Sold The World (Nirvana)
  - Semi-Charmed Life (Third Eye Blind)
  - ...Baby One More Time (Britney Spears)
  - Better Man (Pearl Jam)
  - It's All Coming Back to Me Now (Céline Dion)
  - This Kiss (Faith Hill)
  - Fly Away (Lenny Kravits)
  - Scar Tissue (Red Hot Chili Peppers)
  - Santa Monica (Everclear)
  - C'mon N' Ride it (Quad City DJ's)
      `.trim(),
    },
  ];
  
  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }

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
