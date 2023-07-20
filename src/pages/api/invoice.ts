import type { NextRequest } from "next/server";

export default function handler(req: NextRequest) {
  console.log(req.url);
  const { searchParams } = new URL("http://localhost:3000" + req.url);
  const query = searchParams.get("q");

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call

  console.log(query?.toString());
}
