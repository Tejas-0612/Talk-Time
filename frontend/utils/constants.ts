import { archive, group, inbox } from "./Icons";

export const navButtons = [
  {
    id: 0,
    name: "All Chats",
    icon: inbox,
    slug: "all-chats",
  },
  {
    id: 1,
    name: "Archived",
    icon: archive,
    slug: "archived",
  },
  {
    id: 2,
    name: "Requests",
    icon: group,
    slug: "requests",
    notification: true,
  },
];
