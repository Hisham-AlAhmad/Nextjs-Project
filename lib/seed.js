import prisma from './prisma.js'
import bcrypt from 'bcryptjs'

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)

  const user = await prisma.user.upsert({
    where: { email: 'admin@arcline.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@arcline.com',
      password: hashedPassword,
      role: 'ADMIN',
      permissions: []
    }
  })

  console.log('Seed complete:', user)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())