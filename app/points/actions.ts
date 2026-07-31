"use server";

import { revalidatePath } from "next/cache";
import { nextMastery } from "@/lib/points";
import {
  createUserPoint,
  deleteUserPoint,
  getPointRaw,
  getResolvedPoint,
  updateUserPoint,
  upsertPointState,
} from "@/lib/data/points";
import { createClient } from "@/lib/supabase/server";
import type { Mastery } from "@/lib/types";

async function requireUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("未登录");
  return user.id;
}

export async function cycleMasteryAction(pointId: string) {
  const userId = await requireUserId();
  const point = await getResolvedPoint(pointId, userId);
  if (!point) throw new Error("知识点不存在");
  const mastery: Mastery = nextMastery(point.mastery);
  await upsertPointState(userId, pointId, { mastery });
  revalidatePath(`/points/${pointId}`);
  revalidatePath("/");
}

export async function toggleStarAction(pointId: string) {
  const userId = await requireUserId();
  const point = await getResolvedPoint(pointId, userId);
  if (!point) throw new Error("知识点不存在");
  await upsertPointState(userId, pointId, { starred: !point.starred });
  revalidatePath(`/points/${pointId}`);
  revalidatePath("/");
}

export async function savePointAction(formData: FormData) {
  const userId = await requireUserId();
  const pointId = String(formData.get("pointId") ?? "");
  const chapterId = String(formData.get("chapterId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const body_md = String(formData.get("body_md") ?? "");
  if (!title) throw new Error("标题不能为空");

  if (pointId) {
    await updateUserPoint({ userId, pointId, title, body_md });
    revalidatePath(`/points/${pointId}`);
    return pointId;
  }

  if (!chapterId) throw new Error("缺少章节");
  const id = await createUserPoint({ userId, chapterId, title, body_md });
  revalidatePath(`/points/${id}`);
  return id;
}

export async function deletePointAction(pointId: string) {
  const userId = await requireUserId();
  const raw = await getPointRaw(pointId);
  if (!raw || raw.user_id !== userId) throw new Error("只能删除自己创建的知识点");
  await deleteUserPoint(userId, pointId);
  revalidatePath("/");
}
