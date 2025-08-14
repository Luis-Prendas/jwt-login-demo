import { Outlet } from 'react-router';
import { SidebarProvider, SidebarTrigger } from './ui/sidebar';
import { AppSidebar } from './app-sidebar';

export function MainLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <main className="w-full min-h-screen flex justify-center items-center relative">
        <SidebarTrigger className='absolute top-2 left-2' />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
