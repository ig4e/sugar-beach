import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  protectedAdminProcedure,
} from "~/server/api/trpc";

import { utapi } from "uploadthing/server";

export const mediaRouter = createTRPCRouter({
  deleteMany: protectedAdminProcedure
    .input(z.object({ fileKeys: z.string().array() }))
    .mutation(async ({ input }) => {
      try {
        const { success: isDeleted } = await utapi.deleteFiles(input.fileKeys);
        if (!isDeleted) {
          try {
            const urls = await utapi.getFileUrls(input.fileKeys);
            console.log(urls);
            if (urls.length > 0) {
              return { success: false };
            }
          } catch (error) {
            console.log(error);
            return { success: true };
          }
        }
        return { success: isDeleted };
      } catch {
        return {
          success: true,
        };
      }
    }),
 // findMany: protectedAdminProcedure.query(async ({ input }) => {}),
});
