import { Button } from "@/components/ui/button.tsx";
import { LayoutDashboard, PlusCircle, BarChart3, User } from "lucide-react";
import { cn } from "@/lib/utils.ts";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CONTENT_CREATE_ROUTE,
  DASHBOARD_ROUTE,
  ANALYTICS_ROUTE,
  PROFILE_ROUTE,
} from "@/utils/CONSTANTS.ts";
import { LogoAndBrandComponent } from "@/components/utils_for_components/logo_brand_component.tsx";

const navigation = [
  {
    name: "Главная",
    href: DASHBOARD_ROUTE,
    icon: LayoutDashboard,
  },
  {
    name: "Создание контента",
    href: CONTENT_CREATE_ROUTE,
    icon: PlusCircle,
  },
  {
    name: "Аналитика",
    href: ANALYTICS_ROUTE,
    icon: BarChart3,
  },
  {
    name: "Профиль",
    href: PROFILE_ROUTE,
    icon: User,
  },
];

export function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // тут мы по нажатию обновляем страницу
  const handleNavigation = (href: string) => {
    navigate(href);
  };

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border w-64">
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <LogoAndBrandComponent />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Button
              key={item.name}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start space-x-3 h-12 transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
              )}
              onClick={() => handleNavigation(item.href)}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Button>
          );
        })}
      </nav>
    </div>
  );
}
