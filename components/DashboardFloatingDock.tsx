import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandX,
  IconCalendar,
  IconExchange,
  IconHome,
  IconNewSection,
  IconPlus,
  IconTerminal2,
} from "@tabler/icons-react";
import Image from "next/image";
import { useSchedule } from "@/context/ScheduleContext";
import { useDashboard } from "@/app/dashboard/page";
import { Calendar, CalendarSearch } from "lucide-react";
import { on } from "events";

export function DashboardFloatingDock() {
  const { events, addEvent, removeEvent, loading, newEventData } = useSchedule();
  const { CreateEvent, setChangingDate, editMode, setEditMode, setChangingCalendar, setFetchingGoogleEvents  } = useDashboard();

  const links = [
    {
      title: "New Event",
      icon: (
        <IconNewSection className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: () => { CreateEvent() }
    },

    {
      title: "Edit mode",
      icon: (
        <IconTerminal2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      color: editMode ? "bg-emerald-500 dark:bg-emerald-600" : undefined,
      onClick: () => { setEditMode(!editMode) }
    },
    {
      title: "Go to Date",
      icon: (
        <CalendarSearch className="h-full w-full text-neutral-500 dark:text-neutral-300"  />
      ),
      onClick: () => { setChangingDate(true) }
    },
    {
      title: "Change calendar",
      icon: (
        <Calendar className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: () => { setChangingCalendar(true) }
    },

    {
      title: "Import from Google",
      icon: (
        <IconBrandGoogle className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: () => { setFetchingGoogleEvents(true) },
    },
  ];
  return (
    <div className="sticky bottom-0 pointer-events-none">
      <div className="flex items-center justify-center h-12 py-16 w-auto pointer-events-none">
        <FloatingDock
          desktopClassName="pointer-events-auto"
          mobileClassName="translate-y-20"
          items={links}
        />
      </div>
    </div>
  );
}
