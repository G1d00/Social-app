import { faker } from "@faker-js/faker";
import prisma from "./db";

async function main() {
    
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const users = [];
  for (let i=0; i < 20; i++) {
    const user = await prisma.user.create({
        data: {
            username: faker.internet.username() + i,
            displayName: faker.person.fullName(),
            avatarUrl: faker.image.avatar()
        },
    });
    users.push(user);
  }
  
  for (let i=0; i < 500; i++) {
    const randomUser = faker.helpers.arrayElement(users);
    await prisma.post.create({
        data:{
            content: faker.lorem.sentence(),
            authorId: randomUser.id,
        }
    })
  }
}

main()
  .then(() => console.log("seeded ✅"))
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
