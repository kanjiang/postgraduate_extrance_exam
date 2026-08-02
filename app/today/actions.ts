"use server";

import { revalidatePath } from "next/cache";
import type { CheckinFlags } from "@/lib/checkin";
import { upsertCheckinFlag } from "@/lib/data/schedule";
import { createClient } from "@/lib/supabase/server";

export async function toggleCheckinAction(
  dayDate: string,
  field: keyof CheckinFlags,
  value: boolean,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("未登录");

  await upsertCheckinFlag(user.id, dayDate, field, value);
  revalidatePath("/today");
  revalidatePath("/schedule");
  revalidatePath("/");
}
