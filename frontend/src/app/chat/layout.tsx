import { ChatProvider } from '@/app/providers';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ChatProvider>
      {children}
    </ChatProvider>
  );
} 