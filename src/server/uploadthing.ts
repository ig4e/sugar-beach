/** server/uploadthing.ts */
import type { NextApiRequest, NextApiResponse } from "next";
import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";
import { getServerAuthSession } from "./auth";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  productMedia: f({
    image: { maxFileSize: "16MB", maxFileCount: 5 },
    video: { maxFileSize: "256MB", maxFileCount: 5 },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async (req, res) => {
      // This code runs on your server before upload
      const session = await getServerAuthSession({ req, res });
      const user = session?.user;

      // If you throw, the user will not be able to upload
      if (!user) throw new Error("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
