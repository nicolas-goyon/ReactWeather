import { WiDaySunny } from "react-icons/wi";
import SearchBar from "./SearchBar";

export default function Header({ onSearch }) {
    return (
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
                <div className="flex items-center gap-1.5">
                    <WiDaySunny className="text-3xl text-amber-500" aria-hidden="true" />
                    <span className="text-xl font-semibold tracking-tight">Météo</span>
                </div>
                <SearchBar onSearch={onSearch} />
            </div>
        </header>
    );
}
