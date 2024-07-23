import { unstable_noStore as noStore } from "next/cache";
import { kv } from "@vercel/kv";

export async function getPreferences(userId: string) {
  noStore();
  const preferences = await kv.get(`preferences:${userId}`);
  return preferences;
}
