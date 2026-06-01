import BottomNav from "@/components/BottomNav";
import NotificationScheduler from "@/components/NotificationScheduler";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <NotificationScheduler />
      <div className="flex-1 flex flex-col min-h-0 pb-2">{children}</div>
      <BottomNav />
    </div>
  );
}
