import ChatView from "@/components/ChatView";
import Header from "@/components/Header";
import History from "@/components/History";
import Resources from "@/components/Resources";

export default function Chat() {
  return (
    <main className="flex flex-col min-h-screen bg-background dark:bg-background-dark transition-all duration-100">
      <Header />
      <div className="flex p-2 justify-center h-full gap-4">
        <History />
        <ChatView />
        <Resources />
      </div>
    </main>
  );
}
