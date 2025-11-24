import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

const Dashboard = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-gradient-to-br from-background via-lilo-beige/10 to-background flex w-full">
        <AdminSidebar />
        <SidebarInset className="flex-1">
          {/* Mobile Header with Trigger */}
          <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:hidden sticky top-0 z-10">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-lg font-bold text-lilo-primary">Lilo Express</h1>
              <p className="text-xs text-muted-foreground">Admin Dashboard</p>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-3 sm:p-4 lg:p-6 xl:p-8">
            <div className="w-full max-w-none">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
