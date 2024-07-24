import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/button-back";
import { kv } from "@vercel/kv";
import { revalidatePath } from "next/cache";
import { getPreferences } from "./actions";

export default async function Page() {
  const user = { id: "dummy" };
  if (!user) {
    return null;
  }
  const userPreferences = await getPreferences(user.id);
  async function updateuserPreferences(formData: FormData) {
    "use server";
    const preferences = formData.get("preferences"); // Retrieve the 'preferences' value
    console.log("preferences: ", preferences);
    // Update user preferences in kv
    await kv.set(`preferences:${user.id}`, preferences);
    console.log("Preferences updated!");
    // Confirm the preferences was updated: reload the page
    revalidatePath("/preferences");
  }
  return (
    <div>
      <BackButton />
      <div className="flex flex-col border-zinc-500  max-w-[1200px] m-auto justify-start p-5 gap-5">
        <div>
          <h1 className="text-lg mb-10">Account</h1>
          <p className="font-bold mb-3">Edit your watching preferences.</p>
          {/* @ts-ignore */}
          <form action={updateuserPreferences}>
            <div className="flex flex-col gap-5 items-center justify-between">
              <textarea
                name="preferences"
                className="w-full h-40 border border-zinc-500 p-2 rounded-lg"
                placeholder="Watching preferences"
                defaultValue={(userPreferences as string) || ""}
              ></textarea>
              <Button>Save</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
