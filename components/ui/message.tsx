import { cn } from "@/lib/utils";

export function BotCard({
  children,
  showAvatar = true,
}: {
  children: React.ReactNode;
  showAvatar?: boolean;
}) {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div
        className={cn(
          "flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm",
          !showAvatar && "invisible"
        )}
      >
        ASSISTANT:
      </div>
      <div className="ml-4 flex-1 pl-2">{children}</div>
    </div>
  );
}

export const CardSkeleton = () => {
  return (
    <div className="mb-4 flex flex-row gap-2 overflow-y-scroll pb-4 text-sm sm:flex-row">
      <div className="flex h-[60px] w-full cursor-pointer flex-row gap-2 rounded-lg bg-zinc-800 p-2 text-left hover:bg-zinc-800 sm:w-[208px]"></div>
      <div className="flex h-[60px] w-full cursor-pointer flex-row gap-2 rounded-lg bg-zinc-800 p-2 text-left hover:bg-zinc-800 sm:w-[208px]"></div>
      <div className="flex h-[60px] w-full cursor-pointer flex-row gap-2 rounded-lg bg-zinc-800 p-2 text-left hover:bg-zinc-800 sm:w-[208px]"></div>
    </div>
  );
};
