import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconBrandGithub,
  IconBrandX,
  IconExchange,
  IconHome,
  IconNewSection,
  IconPlus,
  IconTerminal2,
} from "@tabler/icons-react";
import Image from "next/image";
import { useSchedule } from "@/context/ScheduleContext";

export function DashboardFloatingDock() {
  const { events, addEvent, removeEvent, loading, createEvent, newEventData } = useSchedule();

  const links = [
    {
      title: "New Event",
      icon: (
        <IconNewSection className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: () => { createEvent() }
    },

    {
      title: "Products",
      icon: (
        <IconTerminal2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Components",
      icon: (
        <IconNewSection className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
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
    <div className="sticky bottom-0">
  <div className="flex items-center justify-center h-12 py-16 w-full">
    <FloatingDock
      mobileClassName="translate-y-20" // only for demo, remove for production
      items={links}
    />
  </div>
</div>
  );
}
