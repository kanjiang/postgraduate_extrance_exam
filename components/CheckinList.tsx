"use client";

import { useTransition } from "react";
import { toggleCheckinAction } from "@/app/today/actions";
import type { CheckinFlags } from "@/lib/checkin";

type Item = {
  field: keyof CheckinFlags;
  title: string;
  detail: string;
};

export function CheckinList({
  dayDate,
  flags,
  items,
}: {
  dayDate: string;
  flags: CheckinFlags;
  items: Item[];
}) {
  const [pending, start] = useTransition();

  return (
    <ul className="checkin-list">
      {items.map((item) => {
        const checked = flags[item.field];
        return (
          <li key={item.field} className={checked ? "checkin-item done" : "checkin-item"}>
            <label>
              <input
                type="checkbox"
                checked={checked}
                disabled={pending}
                onChange={(e) =>
                  start(() =>
                    toggleCheckinAction(dayDate, item.field, e.target.checked),
                  )
                }
              />
              <span>
                <strong>{item.title}</strong>
                <em>{item.detail}</em>
              </span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}
