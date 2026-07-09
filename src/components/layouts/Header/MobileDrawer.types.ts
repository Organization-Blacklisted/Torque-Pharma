import type { NavCategories } from "@/data/nav.config";

export interface MobileDrawerProps {
  menuOpen: boolean;
  closeMenu: () => void;
  pathname: string;
  navCategories: NavCategories;
}
