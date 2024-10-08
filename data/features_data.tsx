import { Award, Calendar, Clock, ConciergeBell } from "lucide-react";

const iconSize = 30;

export const features = [
    {
      icon: <ConciergeBell size={iconSize} />,
      title: 'Dynamic Day Planner',
      description: 'Your schedule, reimagined daily. Set your wake-up time, and we’ll adapt your entire day automatically—no more scrambling to catch up.',
    },
    {
      icon: <Clock size={iconSize} />,
      title: 'Smart Event Shifting',
      description: 'Running late? No problem. Events move seamlessly to fit the rest of your day, so you never miss a beat.',
    },
    {
      icon: <Calendar size={iconSize} />,
      title: 'Time Block Flexibility',
      description: 'Life happens—your schedule should understand that. Flexible time blocks let you handle unexpected events with ease.',
    },
    {
    icon: <Award size={iconSize} />,
    title: 'Priority Manager',
    description: 'Stay focused on what matters most. Set your event priorities, and let us handle the rest—rearranging less important tasks to make room for top goals.',
    },
];