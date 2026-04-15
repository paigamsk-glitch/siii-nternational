import { ReactNode } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import { MessageCircle } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground font-sans">
      <Header />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />

      <a
        href="https://wa.me/917777027454"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-xl px-4 py-3 transition-all duration-200 hover:scale-105 group"
      >
        <MessageCircle className="w-5 h-5 shrink-0" />
        <span className="text-sm font-semibold max-w-0 overflow-hidden group-hover:max-w-[120px] transition-all duration-300 whitespace-nowrap">
          Chat with us
        </span>
      </a>
    </div>
  );
}
