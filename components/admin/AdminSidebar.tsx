"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Wallet,
  List,
  MapPin,
  Car,
  Users,
  BarChart2,
  Settings,
  ChevronDown,
  X,
  Building2,
  Camera,
  LogOut,
  Wifi,
  Tag,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

interface NavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: { label: string; href: string; icon: React.ReactNode }[];
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  {
    label: "Invoice",
    icon: <FileText size={18} />,
    children: [
      { label: "Create Invoice", href: "/admin/invoice/create", icon: <PlusCircle size={16} /> },
      { label: "Expense", href: "/admin/invoice/expense", icon: <Wallet size={16} /> },
      { label: "Invoice List", href: "/admin/invoice/list", icon: <List size={16} /> },
    ],
  },
  { label: "Paket Tour", href: "/admin/packages", icon: <MapPin size={18} /> },
  { label: "Voucher Bundling", href: "/admin/bundles", icon: <Tag size={18} /> },
  { label: "Akomodasi", href: "/admin/accommodations", icon: <Building2 size={18} /> },
  { label: "Kendaraan", href: "/admin/vehicles", icon: <Car size={18} /> },
  { label: "Wifi", href: "/admin/wifi", icon: <Wifi size={18} /> },
  { label: "MICE", href: "/admin/mice", icon: <Users size={18} /> },
  { label: "Galeri", href: "/admin/gallery", icon: <Camera size={18} /> },
  { label: "Report", href: "/admin/reports", icon: <BarChart2 size={18} /> },
  { label: "Settings", href: "/admin/settings", icon: <Settings size={18} /> },
];

export default function AdminSidebar({ isOpen, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(["Invoice"]);

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const isActive = (href: string) => pathname === href;
  const isParentActive = (children?: { href: string }[]) =>
    children?.some((c) => pathname.startsWith(c.href)) ?? false;

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-slate-200 z-40 flex flex-col transition-all duration-300
          ${isOpen ? "w-64" : "w-16"}
          hidden lg:flex`}
      >
        <SidebarContent
          pathname={pathname}
          expandedItems={expandedItems}
          toggleExpand={toggleExpand}
          isActive={isActive}
          isParentActive={isParentActive}
          collapsed={!isOpen}
        />
      </aside>

      {/* Mobile sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-40 flex flex-col transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          flex lg:hidden`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <span className="text-[15px] font-semibold text-slate-800">InfinityGo Admin</span>
          <button
            onClick={onMobileClose}
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500"
          >
            <X size={18} />
          </button>
        </div>
        <SidebarContent
          pathname={pathname}
          expandedItems={expandedItems}
          toggleExpand={toggleExpand}
          isActive={isActive}
          isParentActive={isParentActive}
          hideLogo
          collapsed={false}
        />
      </aside>
    </>
  );
}

function SidebarContent({
  pathname,
  expandedItems,
  toggleExpand,
  isActive,
  isParentActive,
  hideLogo,
  collapsed,
}: {
  pathname: string;
  expandedItems: string[];
  toggleExpand: (label: string) => void;
  isActive: (href: string) => boolean;
  isParentActive: (children?: { href: string }[]) => boolean;
  hideLogo?: boolean;
  collapsed?: boolean;
}) {
  return (
    <>
      {!hideLogo && (
        <div className="px-5 py-5 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
              <MapPin size={16} className="text-white" />
            </div>
            {!collapsed && (
              <div>
                <p className="text-[14px] font-bold text-slate-800 leading-tight">InfinityGo</p>
                <p className="text-[11px] text-slate-400 leading-tight">Admin Panel</p>
              </div>
            )}
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {!collapsed && (
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-3 mb-2">
            Menu
          </p>
        )}
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const expanded = expandedItems.includes(item.label);
            const parentActive = isParentActive(item.children);

            if (item.children) {
              return (
                <li key={item.label}>
                  <button
                    onClick={() => toggleExpand(item.label)}
                    className={`w-full flex items-center px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors
                      ${collapsed ? "justify-center" : "justify-between"}
                      ${parentActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={parentActive ? "text-blue-600" : "text-slate-400"}>
                        {item.icon}
                      </span>
                      {!collapsed && item.label}
                    </div>
                    {!collapsed && (
                      <span className={`transition-transform duration-200 ${expanded ? "rotate-0" : "-rotate-90"} ${parentActive ? "text-blue-500" : "text-slate-400"}`}>
                        <ChevronDown size={14} />
                      </span>
                    )}
                  </button>

                  {expanded && !collapsed && (
                    <ul className="mt-0.5 ml-4 pl-4 border-l border-slate-200 space-y-0.5">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors
                              ${isActive(child.href)
                                ? "bg-blue-50 text-blue-700 font-medium"
                                : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                              }`}
                          >
                            <span className={isActive(child.href) ? "text-blue-500" : "text-slate-400"}>
                              {child.icon}
                            </span>
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            }

            return (
              <li key={item.href}>
                <Link
                  href={item.href!}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors
                    ${collapsed ? "justify-center" : ""}
                    ${isActive(item.href!)
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                    }`}
                >
                  <span className={isActive(item.href!) ? "text-blue-600" : "text-slate-400"}>
                    {item.icon}
                  </span>
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-200">
        <button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          className={`w-full flex items-center gap-3 py-2 rounded-lg text-[13px] font-medium text-rose-600 hover:bg-rose-50 transition-colors ${collapsed ? "justify-center px-0" : "px-3"}`}
        >
          <LogOut size={16} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </>
  );
}
