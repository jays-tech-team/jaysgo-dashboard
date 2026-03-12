import {
  Building2,
  ChevronDown,
  Ellipsis,
  FileChartPie,
  LayoutDashboard,
  LineChart,
  Package,
  Settings,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

// Assume these icons are imported from an icon library
import { useSidebar } from "../context/SidebarContext";

import { publicPath } from "../lib/utils";
import { PERMISSIONS, USER_ROLES } from "../unities/permissions";

type NavItem = {
  name: string;
  icon?: React.ReactNode;
  path?: string;
  new?: boolean;
  notificationCount?: number;
  subItems?: NavItem[];
  permission: PERMISSIONS[];
  /**
   * No mater the permission, this item will be hidden if true
   */
  hidden?: boolean;
};

const othersItems: NavItem[] = [
  {
    icon: <Settings />,
    name: "Settings",
    permission: [],
    path: "/admin/settings",
  },
];

const AppSidebar: React.FC = () => {
  const { hasPermission, hasRole, userInfo: currentUser } = useAuth();
  const navItems: NavItem[] = useMemo(() => [
    {
      icon: <LayoutDashboard />,
      name: "Dashboard",
      path: "/admin/dashboard",
      permission: [PERMISSIONS.DASHBOARD_READ],
    },
    {
      icon: <Package />,
      name: "Deliveries",
      path: "/admin/orders",
      permission: [PERMISSIONS.ORDER_READ],
    },
    {
      icon: <Users />,
      name: "Assignments",
      path: "/admin/assignments",
      permission: [PERMISSIONS.ORDER_READ],
    },
    {
      icon: <Users />,
      name: "Agents",
      path: "/admin/agents",
      permission: [PERMISSIONS.USER_READ],
    },
    {
      icon: <Building2 />,
      name: "Companies",
      path: "/admin/companies",
      permission: [PERMISSIONS.SHIPPING_READ],
    },
    {
      icon: <LineChart />,
      name: "Analytics",
      path: "/admin/analytics",
      permission: [PERMISSIONS.DASHBOARD_READ],
    },
    {
      icon: <FileChartPie />,
      name: "Reports",
      path: "/admin/reports",
      permission: [PERMISSIONS.REPORT_READ],
    },
  ], []);

  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {},
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) =>
      location.pathname.replace(/\/$/, "") === path.replace(/\/$/, "") ||
      location.pathname.replace(/\/$/, "/") + location.search ==
      path.replace(/\/$/, ""),
    [location.pathname, location.search],
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path ?? "`3")) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive, navItems]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };
  function isMenuItemAllowed(nav: NavItem) {
    return (
      (nav.permission &&
        (hasPermission(nav.permission) ||
          nav.permission.includes(PERMISSIONS.PUBLIC))) ||
      hasRole([USER_ROLES.ADMIN])
    );
  }

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => {
        if (nav.hidden) return null;
        if (isMenuItemAllowed(nav)) {
          return (
            <li key={nav.name}>
              {nav.subItems ? (
                <button
                  onClick={() => handleSubmenuToggle(index, menuType)}
                  className={`menu-item group ${openSubmenu?.type === menuType &&
                      openSubmenu?.index === index
                      ? "menu-item-active"
                      : "menu-item-inactive"
                    } cursor-pointer ${!isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "lg:justify-start"
                    }`}
                >
                  <span
                    className={`menu-item-icon-size  ${openSubmenu?.type === menuType &&
                        openSubmenu?.index === index
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                      }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <ChevronDown
                      className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType &&
                          openSubmenu?.index === index
                          ? "rotate-180 text-brand-500"
                          : ""
                        }`}
                    />
                  )}
                </button>
              ) : (
                nav.path && (
                  <Link
                    to={nav.path}
                    className={`menu-item group ${isActive(nav.path)
                        ? "menu-item-active"
                        : "menu-item-inactive"
                      }`}
                  >
                    <span
                      className={`menu-item-icon-size ${isActive(nav.path)
                          ? "menu-item-icon-active"
                          : "menu-item-icon-inactive"
                        }`}
                    >
                      {nav.icon}
                    </span>
                    {(isExpanded || isHovered || isMobileOpen) && (
                      <span className="menu-item-text">{nav.name}</span>
                    )}
                  </Link>
                )
              )}
              {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
                <div
                  ref={(el) => {
                    subMenuRefs.current[`${menuType}-${index}`] = el;
                  }}
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    height:
                      openSubmenu?.type === menuType &&
                        openSubmenu?.index === index
                        ? `${subMenuHeight[`${menuType}-${index}`]}px`
                        : "0px",
                  }}
                >
                  <ul className="mt-2 space-y-1 ml-9">
                    {nav.subItems.map((subItem) => {
                      if (subItem.hidden) return null;
                      if (!isMenuItemAllowed(subItem)) {
                        return null;
                      }
                      return (
                        <li key={subItem.name}>
                          <Link
                            to={subItem.path ?? "#"}
                            className={`menu-dropdown-item ${isActive(subItem.path ?? "")
                                ? "menu-dropdown-item-active"
                                : "menu-dropdown-item-inactive"
                              }`}
                          >
                            {subItem.name}
                            <span className="flex items-center gap-1 ml-auto">
                              {subItem.new && (
                                <span
                                  className={`ml-auto ${isActive(subItem.path ?? "")
                                      ? "menu-dropdown-badge-active"
                                      : "menu-dropdown-badge-inactive"
                                    } menu-dropdown-badge`}
                                >
                                  new
                                </span>
                              )}
                              {subItem.notificationCount &&
                                subItem.notificationCount !== 0 && (
                                  <span
                                    className={`ml-auto ${isActive(subItem.path ?? "")
                                        ? "menu-dropdown-badge-active"
                                        : "menu-dropdown-badge-inactive"
                                      } menu-dropdown-badge`}
                                  >
                                    {subItem.notificationCount}
                                  </span>
                                )}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </li>
          );
        }
        return null;
      })}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <Link to={currentUser?.home_page || "/"}>
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden w-24"
                src={publicPath("/images/logo/jays-logo-full.png")}
                alt="Logo"
                width={150}
                height={40}
              />
              <img
                className="hidden dark:block dark:invert w-16"
                src={publicPath("/images/logo/logo.png")}
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <img
              src={publicPath("/favicon.png")}
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <Ellipsis className="size-6 opacity-65" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            <div className="hide-h2-if-ul-is-empty">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <Ellipsis className="size-6 opacity-65" />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
