import { Outlet } from 'react-router';
import { SidebarProvider, SidebarTrigger } from './ui/sidebar';
import { AppSidebar } from './app-sidebar';
import { ModeToggle } from './mode-toggle';

export function MainLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <main className="w-full min-h-screen flex justify-center items-center relative">
        <div className='absolute left-2 top-2'>
          <ModeToggle />
          <SidebarTrigger />
        </div>
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
