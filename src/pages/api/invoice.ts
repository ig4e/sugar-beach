import type { NextRequest } from "next/server";

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  const data = await req.json();

  console.log(data, query);
}
