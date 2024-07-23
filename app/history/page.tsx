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

  const userHistory = await getPreferences(user.id);

  async function updateUserHistory(formData: FormData) {
    "use server";
    const history = formData.get("history"); // Retrieve the 'history' value
    console.log("preferences: ", history);

    // Update user history in kv
    await kv.set(`preferences:${user.id}`, history);
    console.log("Preferences updated");

    // Confirm the history was updated: reload the page
    revalidatePath("/account");
  }

  return (
    <div>
      <BackButton />
      <div className="flex flex-col border-zinc-500  max-w-[1200px] m-auto justify-start p-5 gap-5">
        <div>
          <h1 className="text-lg mb-10">Account</h1>
          <p className="font-bold mb-3">Edit your watching history.</p>
          {/* @ts-ignore */}
          <form action={updateUserHistory}>
            <div className="flex flex-col gap-5 items-center justify-between">
              <textarea
                name="history"
                className="w-full h-40 border border-zinc-500 p-2 rounded-lg"
                placeholder="Watching history"
                defaultValue={(userHistory as string) || ""}
              ></textarea>
              <Button>Save</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
