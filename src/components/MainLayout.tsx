import { Outlet } from 'react-router';
import { SidebarProvider, SidebarTrigger } from './ui/sidebar';
import { AppSidebar } from './app-sidebar';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/enums';

export function MainLayout() {
  const { userData } = useAuth();
  const isDeveloper = () => {
    if (!userData) return false

    if (userData.role === UserRole.DEVELOPER || userData.role === UserRole.MODERATOR) return true

    return false
  }

  return (
    <SidebarProvider defaultOpen={false}>
      {isDeveloper() && <AppSidebar />}
      <main className="w-full min-h-screen flex justify-center items-center relative">
        <div className='absolute left-2 top-2'>
          {isDeveloper() && (
            <>
              {/* <ModeToggle /> */}
              <SidebarTrigger />
            </>
          )}
        </div>
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
