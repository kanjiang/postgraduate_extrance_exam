import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { CheckinList } from "@/components/CheckinList";
import {
  PHASE_LABEL,
  SUBJECT_LABEL,
  isCheckinComplete,
  todayDateString,
  type CheckinFlags,
} from "@/lib/checkin";
import {
  getCheckin,
  getFocusCourseDay,
  getStreakAndWeekStats,
} from "@/lib/data/schedule";
import { createClient } from "@/lib/supabase/server";

export default async function TodayPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const today = todayDateString();
  const course = await getFocusCourseDay(today);

  if (!course) {
    return (
      <>
        <AppHeader />
        <main className="page narrow">
          <h1>今日打卡</h1>
          <div className="empty-subjects">
            <p>还没有课表数据。请在 Supabase SQL Editor 依次执行：</p>
            <ol>
              <li>
                <code>supabase/migrations/005_schedule_checkin.sql</code>
              </li>
              <li>
                <code>supabase/migrations/005_schedule_seed.sql</code>
              </li>
            </ol>
          </div>
        </main>
      </>
    );
  }

  const checkin = await getCheckin(user.id, course.day_date);
  const flags: CheckinFlags = {
    words: checkin?.words ?? false,
    lesson: checkin?.lesson ?? false,
    practice: checkin?.practice ?? false,
    micro: checkin?.micro ?? false,
  };
  const stats = await getStreakAndWeekStats(user.id, today);
  const complete = isCheckinComplete(flags);
  const isToday = course.day_date === today;

  return (
    <>
      <AppHeader />
      <main className="page narrow">
        <p className="breadcrumb">
          <Link href="/">首页</Link> / 今日打卡
        </p>
        <h1>{isToday ? "今日打卡" : "打卡（最近课表日）"}</h1>
        <p className="muted">
          {course.day_date} · {PHASE_LABEL[course.phase]} · 连续 {stats.streak}{" "}
          天 · 本周 {stats.weekDone}/{stats.weekTotal}
        </p>

        <section className="today-card">
          <div className="today-main">
            <span className="chip">{SUBJECT_LABEL[course.main_subject]}</span>
            <h2>{course.main_lesson}</h2>
            {course.time_hint ? (
              <p className="muted">{course.time_hint}</p>
            ) : null}
            {course.subject_slug ? (
              <p>
                <Link href={`/subjects/${course.subject_slug}`}>
                  打开对应知识点 →
                </Link>
              </p>
            ) : null}
          </div>

          <CheckinList
            dayDate={course.day_date}
            flags={flags}
            items={[
              {
                field: "words",
                title: "单词",
                detail: course.words_task,
              },
              {
                field: "lesson",
                title: "今日主课",
                detail: `${SUBJECT_LABEL[course.main_subject]} · ${course.main_lesson}`,
              },
              {
                field: "practice",
                title: "配套练习",
                detail: "听完课完成对应练习题",
              },
              {
                field: "micro",
                title: "微任务",
                detail: course.micro_task,
              },
            ]}
          />

          <p className={complete ? "checkin-status ok" : "checkin-status"}>
            {complete
              ? "今天五项都完成了，打卡成功。"
              : "完成上面四项后，即算今日打卡成功。"}
          </p>
        </section>

        <p>
          <Link href="/schedule">查看完整课表 →</Link>
        </p>
      </main>
    </>
  );
}
