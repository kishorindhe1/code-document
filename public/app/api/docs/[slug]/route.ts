import { getDocBySlug } from "@/lib/markdown";
import { NextRequest } from "next/server";

export async function GET(_req: NextRequest, context: any) {
  const params = await context.params; // Await if params is a Promise
  const { slug } = params || {};
  if (!slug) {
    return Response.json({ error: "Slug not provided" }, { status: 400 });
  }
  const doc = await getDocBySlug(slug);
  return Response.json(doc);
}
