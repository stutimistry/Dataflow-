import Link from "next/link";
import { Activity, LayoutGrid, Layers, Search, Github } from "lucide-react";

const NAV = [
  { href: "/", icon: LayoutGrid, label: "Dashboard" },
  { href: "/posts", icon: Activity, label: "Paginated" },
  { href: "/infinite", icon: Layers, label: "Infinite" },
  { href: "/search", icon: Search, label: "Search" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-56 shrink-0 flex-col fixed top-0 left-0 h-screen border-r border-[#1e2430] bg-[#0a0d14] z-20">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-[#1e2430]">
          <div className="w-7 h-7 rounded-lg bg-[#3b82f6] flex items-center justify-center">
            <Activity size={14} className="text-white" />
          </div>
          <span className="font-bold text-white text-sm tracking-tight">DataFlow</span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 p-3 flex-1">
          <p className="text-[10px] font-mono text-[#334155] uppercase tracking-widest px-2 mb-1 mt-2">Views</p>
          {NAV.map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#64748b] hover:text-white hover:bg-[#0f1117] transition-all group">
              <Icon size={15} className="group-hover:text-[#3b82f6] transition-colors" />
              {label}
            </Link>
          ))}

          {/* Tech badges */}
          <div className="mt-auto pt-4 border-t border-[#1e2430] flex flex-col gap-1.5">
            {["Next.js 14", "TanStack Query v5", "TypeScript"].map((tech) => (
              <span key={tech} className="text-[10px] font-mono text-[#334155] px-2">{tech}</span>
            ))}
          </div>
        </nav>
      </aside>

      {/* Mobile top nav */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#0a0d14]/95 backdrop-blur border-b border-[#1e2430] z-20 flex items-center px-4 justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#3b82f6] flex items-center justify-center">
            <Activity size={12} className="text-white" />
          </div>
          <span className="font-bold text-white text-sm">DataFlow</span>
        </div>
        <nav className="flex items-center gap-1">
          {NAV.map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href}
              className="p-2 rounded-lg text-[#64748b] hover:text-white hover:bg-[#0f1117] transition-all"
              title={label}>
              <Icon size={16} />
            </Link>
          ))}
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1 lg:ml-56 pt-14 lg:pt-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
