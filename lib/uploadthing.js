import { createUploadthing } from 'uploadthing/next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const f = createUploadthing()

export const ourFileRouter = {
  // For project images — allow up to 8 images at once
  projectImages: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 8
    }
  })
    .middleware(async () => {
      // Only logged in dashboard users can upload
      const session = await getServerSession(authOptions)
      if (!session) throw new Error('Unauthorized')
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This runs on the server after upload finishes
      // file.url is the URL we save in the database
      console.log('Upload complete by user:', metadata.userId)
      console.log('File URL:', file.url)
      return { url: file.url }
    }),

  // For single images like blog cover photos
  blogCover: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1
    }
  })
    .middleware(async () => {
      const session = await getServerSession(authOptions)
      if (!session) throw new Error('Unauthorized')
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url }
    })
}