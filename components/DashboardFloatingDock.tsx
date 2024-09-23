import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconBrandGithub,
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

export function DashboardFloatingDock() {
  const { events, addEvent, removeEvent, loading, newEventData } = useSchedule();
  const { CreateEvent, setChangingDate, editMode, setEditMode  } = useDashboard();

  console.log("Edit Mode: ", editMode);
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
        <IconCalendar className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: () => { setChangingDate(true) }
    },
    {
      title: "Changelog",
      icon: (
        <IconExchange className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },

    {
      title: "Twitter",
      icon: (
        <IconBrandX className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "GitHub",
      icon: (
        <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
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
