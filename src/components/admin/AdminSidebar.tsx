import { BarChart3, FileText, Clock, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter,
    useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const menuItems = [
    { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
    { title: "Bookings", url: "/admin/bookings", icon: FileText },
    { title: "Schedule", url: "/admin/schedule", icon: Clock },
];

export function AdminSidebar() {
    const { state, setOpenMobile } = useSidebar();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            toast.error("Failed to sign out");
            return;
        }
        toast.success("Logged out successfully");
        navigate("/");
    };

    const handleNavigation = (url: string) => {
        navigate(url);
        // Close mobile sidebar after navigation
        setOpenMobile(false);
    };

    const isCollapsed = state === "collapsed";

    return (
        <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
            <SidebarHeader className="border-b border-border/50 p-4 bg-card">
                {!isCollapsed && (
                    <div className="space-y-1">
                        <h2 className="text-lg font-semibold bg-gradient-to-r from-lilo-primary to-lilo-gradient bg-clip-text text-transparent">
                            Lilo Express
                        </h2>
                        <p className="text-xs text-muted-foreground">Admin Dashboard</p>
                    </div>
                )}
                {isCollapsed && (
                    <div className="flex justify-center">
                        <div className="w-8 h-8 bg-lilo-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">LE</span>
                        </div>
                    </div>
                )}
            </SidebarHeader>

            <SidebarContent className="bg-card">
                <SidebarGroup>
                    <SidebarGroupLabel className={cn(
                        isCollapsed ? "sr-only" : "text-lilo-dark/80 font-medium"
                    )}>
                        Navigation
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => {
                                const isActive =
                                    location.pathname === item.url ||
                                    (location.pathname === "/admin" && item.url === "/admin/analytics");

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            onClick={() => handleNavigation(item.url)}
                                            className={cn(
                                                "hover:bg-lilo-primary/20 hover:text-lilo-primary transition-all duration-200 cursor-pointer font-medium",
                                                isActive && "bg-lilo-primary/10 text-lilo-primary hover:bg-lilo-primary/20"
                                            )}
                                            tooltip={isCollapsed ? item.title : undefined}
                                            isActive={isActive}
                                        >
                                            <item.icon className={cn(
                                                isCollapsed ? "h-5 w-5" : "h-4 w-4",
                                                "text-lilo-primary/80"
                                            )} />
                                            {!isCollapsed && <span className="text-lilo-dark">{item.title}</span>}
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-border/50 p-4 bg-card mt-auto">
                <Button
                    variant="ghost"
                    onClick={handleSignOut}
                    className={cn(
                        "w-full hover:bg-destructive/20 hover:text-destructive transition-all duration-200 font-medium",
                        isCollapsed ? "justify-center px-2" : "justify-start"
                    )}
                >
                    <LogOut className={cn(
                        isCollapsed ? "h-5 w-5" : "h-4 w-4",
                        !isCollapsed && "mr-2",
                        "text-destructive/80"
                    )} />
                    {!isCollapsed && <span className="text-lilo-dark">Logout</span>}
                </Button>
            </SidebarFooter>
        </Sidebar>
    );
}
