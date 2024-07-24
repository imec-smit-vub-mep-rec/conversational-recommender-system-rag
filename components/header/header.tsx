import * as React from "react";
import Link from "next/link";
import {
  IconDatabase,
  IconHome,
  IconMinimize,
  IconPlus,
  IconUser,
} from "@tabler/icons-react";

import { Button, buttonVariants } from "@/components/ui/button";
/*
import { UserMenu } from "@/components/user-menu";
import { SidebarMobile } from "./sidebar-mobile";
import { SidebarToggle } from "./sidebar-toggle";
import { ChatHistory } from "./chat-history";
*/

function UserOrLogin() {
  const session: any = { user: null };

  return (
    <>
      {session?.user ? (
        <>USER</>
      ) : (
        <Link href="/new" rel="nofollow">
          <IconPlus className="hidden size-6 mr-2 dark:block" />
        </Link>
      )}
      <div className="flex items-center">
        <IconHome className="size-6 text-muted-foreground/50" />
        <Button variant="link" asChild className="-ml-2">
          <Link href="/">Recommender</Link>
        </Button>
      </div>
      <div className="flex items-center">
        <IconUser className="size-6 text-muted-foreground/50" />
        {session?.user ? (
          <span>Usermenu</span>
        ) : (
          <Button variant="link" asChild className="-ml-2">
            <Link href="/preferences">Edit preferences</Link>
          </Button>
        )}
      </div>
      <div className="flex items-center">
        <IconDatabase className="size-6 text-muted-foreground/50" />
        <Button variant="link" asChild className="-ml-2">
          <Link href="/init">Add embeddings</Link>
        </Button>
      </div>
    </>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex items-center">
        <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
          <UserOrLogin />
        </React.Suspense>
      </div>
      <div className="flex items-center justify-end space-x-2"></div>
    </header>
  );
}
