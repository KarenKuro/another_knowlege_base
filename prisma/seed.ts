// import { PrismaClient } from '@prisma/client';
// import * as bcrypt from 'bcrypt';

// const prisma = new PrismaClient();

// const saltRounds = 10;
// const hashedPassword = bcrypt.hash('admin123', saltRounds);

// const adminUser = prisma.user.upsert({
//   where: { email: 'admin@example.com' },
//   update: {},
//   create: {
//     email: 'admin@example.com',
//     name: 'Admin',
//     password: hashedPassword,
//     isAdmin: true,
//   },
// });

// main()
//   .catch(e => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   }); 
