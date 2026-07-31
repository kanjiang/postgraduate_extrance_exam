import Link from "next/link";
import type { Subject } from "@/lib/types";

export function SubjectCard({ subject }: { subject: Subject }) {
  return (
    <Link href={`/subjects/${subject.slug}`} className="subject-card">
      <span className="subject-card-name">{subject.name}</span>
      <span className="subject-card-go">进入 →</span>
    </Link>
  );
}
