import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import {
  PHASE_LABEL,
  SUBJECT_LABEL,
  isCheckinComplete,
  todayDateString,
} from "@/lib/checkin";
import { getStreakAndWeekStats, listCheckinsInRange, listCourseDays } from "@/lib/data/schedule";
import { createClient } from "@/lib/supabase/server";

export default async function SchedulePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const days = await listCourseDays();
  const today = todayDateString();
  const from = days[0]?.day_date ?? today;
  const to = days[days.length - 1]?.day_date ?? today;
  const checkins = await listCheckinsInRange(user.id, from, to);
  const checkinMap = new Map(checkins.map((c) => [c.day_date, c]));
  const stats = await getStreakAndWeekStats(user.id, today);

  return (
    <>
      <AppHeader />
      <main className="page">
        <p className="breadcrumb">
          <Link href="/">首页</Link> / 课表
        </p>
        <h1>学习课表</h1>
        <p className="muted">
          按姜康丽管联规划节奏预置（可后续改）。连续打卡 {stats.streak} 天 ·
          本周完成 {stats.weekDone}/{stats.weekTotal}
        </p>

        {days.length === 0 ? (
          <div className="empty-subjects">
            <p>课表为空。请执行：</p>
            <ol>
              <li>
                <code>supabase/migrations/005_schedule_checkin.sql</code>
              </li>
              <li>
                <code>supabase/migrations/005_schedule_seed.sql</code>
              </li>
            </ol>
          </div>
        ) : (
          <ul className="schedule-list">
            {days.map((d) => {
              const c = checkinMap.get(d.day_date);
              const done = isCheckinComplete(c);
              const isToday = d.day_date === today;
              return (
                <li
                  key={d.id}
                  className={[
                    "schedule-row",
                    done ? "done" : "",
                    isToday ? "today" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <div className="schedule-date">
                    <strong>{d.day_date.slice(5)}</strong>
                    <span>{PHASE_LABEL[d.phase]}</span>
                  </div>
                  <div className="schedule-body">
                    <div className="schedule-title">
                      <span className="chip">
                        {SUBJECT_LABEL[d.main_subject]}
                      </span>
                      {d.main_lesson}
                    </div>
                    <div className="muted schedule-meta">
                      {d.words_task} · {d.micro_task}
                      {d.time_hint ? ` · ${d.time_hint}` : ""}
                    </div>
                  </div>
                  <div className="schedule-flag">{done ? "已打卡" : "未完成"}</div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </>
  );
}
