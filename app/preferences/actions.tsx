import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { kv } from "@vercel/kv";

export async function getPreferences(userId: string) {
  noStore();
  const preferences = await kv.get(`preferences:${userId}`);
  return preferences;
}

export async function updatePreferences(prevState: any, formData: FormData) {
  const userId = formData.get("userId") as string;
  const preferences = formData.get("preferences") as string;
  await kv.set(`preferences:${userId}`, preferences);
  console.log("Preferences updated");

  return { message: 'Saved!' };
}
