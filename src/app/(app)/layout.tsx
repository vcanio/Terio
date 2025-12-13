import AppLayout from '@/components/layout/AppLayout';

export default function AppInternalLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout>
      {children}
    </AppLayout>
  );
}