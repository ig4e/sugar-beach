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
      utapi.deleteFiles(input.fileKeys);
    }),
});
