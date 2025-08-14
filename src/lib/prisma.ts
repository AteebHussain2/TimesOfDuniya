import { withAccelerate } from '@prisma/extension-accelerate'
import { PrismaClient } from '@prisma/client/edge'

const prisma = new PrismaClient().$extends(withAccelerate())
// const prisma = new PrismaClient();

export default prisma;