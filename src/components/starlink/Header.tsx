import { Home, User } from "lucide-react";

export default function Header() {
    return (
        <header className="border-b border-slate-800 bg-slate-950 sticky top-0 z-50">
            <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                <button className="text-white hover:text-cyan-400 transition-colors">
                    <Home size={28} />
                </button>

                <div className="flex items-center gap-3 bg-slate-900/80 rounded-full px-4 py-2 border border-slate-700">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-cyan-400">
                        <User size={16} />
                    </div>
                    <span className="text-sm text-slate-300 font-medium pr-2">Kevin Briones</span>
                </div>
            </div>
        </header>
    );
}