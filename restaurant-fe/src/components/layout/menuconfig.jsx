import { icon } from "@fortawesome/fontawesome-svg-core";
import {
  faHouse,
  faBagShopping,
  faChartColumn,
  faClock,
  faTableCellsLarge,
  faUser,
  faUtensils,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";

export const menuconfig = {
  staff: [
    {
      label: "Dashboard",
      path: "",
      icon: faHouse,
      end: true,
    },
    {
      label: "Reservations",
      path: "reservations",
      icon: faBagShopping,
    },
    {
      label: "Orders",
      path: "orders",
      icon: faBagShopping,
    },
    {
      label: "Histories",
      path: "histories",
      icon: faClock,
    },
    {
      label: "Menu",
      path: "menu",
      icon: faUtensils,
    },
  ],

  admin: [
    {
      label: "Dashboard",
      path: "",
      icon: faHouse,
      end: true,
    },
    {
      label: "Reservations",
      path: "reservations",
      icon: faBagShopping,
    },
    {
      label: "Orders",
      path: "orders",
      icon: faBagShopping,
    },
    {
      label: "Histories",
      path: "histories",
      icon: faClock,
    },
    {
      label: "Staffs",
      path: "staffs",
      icon: faUser,
    },
    {
      label: "Menu",
      path: "menu",
      icon: faUtensils,
    },
    {
      label: "Tables",
      path: "tables",
      icon: faTableCellsLarge,
    },
    {
      label: "Reports",
      path: "reports",
      icon: faChartColumn,
    },
  ],
};