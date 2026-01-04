import React, { useEffect, useMemo, useState } from "react";
import { Search, ArrowRightCircle, ChevronDown } from "lucide-react";
import { AppColor } from "@/styles/colors";
import { ActionButton } from "@/components/ui/action-button";
import { listsService } from "@/services/lists.service";

// Tipi (coerenti con le altre pagine)
export interface SchoolSummary { id: number; name: string; }
export interface FileSummary { id: number; name: string; url?: string; size?: number; }
export interface ListDetail {
    id: number;
    name: string;
    description: string;
    school: SchoolSummary | null;
    slogan: string;
    colorPrimary: string;
    colorSecondary: string;
    file?: FileSummary | null;
    createdAt: Date;
}

interface Props {
    onEnter?: (list: ListDetail) => void;
    enterHref?: string;
    selectionOnly?: boolean; // se true mostra solo la lista e il bottone Entra (default true)
}

const StatCard: React.FC<{ value: string | number; label: string; bg?: string; textCol?: string }> = ({ value, label, bg = "bg-white", textCol = "#374151" }) => (
    <div className={`p-6 rounded-[20px] shadow-lg flex justify-between items-center ${bg}`}>
        <div className="flex flex-col">
            <span className="text-sm font-extrabold mb-2" style={{ color: bg === "bg-white" ? "#4b5563" : textCol }}>{label}</span>
            <span className="text-3xl font-bold leading-none tracking-tighter" style={{ color: textCol }}>{value}</span>
        </div>
        <div className={`p-3 rounded-full ${bg === 'bg-white' ? 'bg-gray-100' : 'bg-white/20'}`}>
            {/* icon placeholder to keep visual balance */}
            <div style={{ width: 28, height: 28, borderRadius: 999, background: textCol }} />
        </div>
    </div>
);

const ListSelector: React.FC<Props> = ({ onEnter, enterHref }) => {
    const [lists, setLists] = useState<ListDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            setLoading(true);
            try {
                const ls = await listsService.getAll();
                if (!cancelled) setLists(ls);
            } catch (e) {
                console.error("Errore caricamento liste", e);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => { cancelled = true; };
    }, []);

    const filtered = useMemo(() => {
        if (!search) return lists;
        const q = search.toLowerCase();
        return lists.filter(l =>
            l.name.toLowerCase().includes(q) ||
            l.description.toLowerCase().includes(q) ||
            (l.school?.name || "").toLowerCase().includes(q)
        );
    }, [lists, search]);

    const selected = selectedIndex !== null ? lists[selectedIndex] : null;

    const handleEnter = () => {
        if (!selected) return;
        if (onEnter) {
            onEnter(selected);
            return;
        }
        if (enterHref) {
            const sep = enterHref.includes("?") ? "&" : "?";
            window.location.href = `${enterHref}${sep}listId=${selected.id}`;
            return;
        }
        // fallback: log
        console.log("Entra lista:", selected);
    };

    return (
        <div className="flex h-screen w-full bg-[#EFEFEF] overflow-hidden font-sans">
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-[1400px] mx-auto">

                        {/* Top area: stats + search */}
                        <div className="grid grid-cols-3 gap-5 mb-6">
                            <StatCard value={lists.length} label="Liste totali" />
                            <StatCard value={selected ? selected.name : "-"} label="Lista selezionata" />
                            <div className="p-6 rounded-[20px] shadow-lg flex items-center bg-white">
                                <div className="flex-1">
                                    <div className="text-sm font-extrabold mb-2 text-gray-500">Seleziona e entra</div>
                                    <div className="text-lg font-semibold text-gray-800">{selected ? selected.name : "Nessuna lista selezionata"}</div>
                                </div>
                                <ActionButton icon={ArrowRightCircle} onClick={handleEnter} disabled={!selected}>Entra</ActionButton>
                            </div>
                        </div>

                        {/* Search bar (stile coerente) */}
                        <div className="p-5 bg-white rounded-[20px] shadow-sm flex gap-4 items-center mb-6">
                            <div className="flex-1 h-[45px] bg-[#F8F9FA] rounded-[10px] flex items-center px-4">
                                <Search size={18} className="text-gray-500 mr-2" />
                                <input
                                    type="text"
                                    placeholder="Cerca liste..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="bg-transparent border-none outline-none text-sm w-full text-gray-700"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2 px-3 py-2 bg-[#F8F9FA] rounded text-sm text-gray-700 cursor-pointer">
                                    Filtri
                                    <ChevronDown size={16} />
                                </div>
                            </div>
                        </div>

                        {/* Main split: selectable list (left) + preview (right) */}
                        <div className="flex flex-row items-start gap-6">
                            {/* LEFT: selectable list */}
                            <div className="flex-[1.2]">
                                <div className="bg-white rounded-[20px] shadow-sm pb-4 min-h-[420px]">
                                    <div className="p-6 pb-2 flex justify-between items-center">
                                        <h3 className="text-xl font-semibold text-gray-800">Seleziona lista</h3>
                                        <div className="text-sm text-gray-500">Totale: {lists.length}</div>
                                    </div>

                                    {loading ? (
                                        <div className="p-10 text-center text-gray-500">Caricamento...</div>
                                    ) : filtered.length === 0 ? (
                                        <div className="p-10 text-center text-gray-500">Nessuna lista trovata</div>
                                    ) : (
                                        <div className="flex flex-col">
                                            {filtered.map((l) => {
                                                // preserva indice relativo a lists (non a filtered)
                                                const fullIdx = lists.findIndex(x => x.id === l.id);
                                                const isSelected = selectedIndex === fullIdx;
                                                return (
                                                    <div
                                                        key={l.id}
                                                        onClick={() => setSelectedIndex(fullIdx)}
                                                        className={`
                              px-6 py-4 border-b border-gray-100 flex items-center cursor-pointer transition-colors hover:bg-gray-50
                              ${isSelected ? 'bg-blue-50/50' : ''}
                            `}
                                                    >
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: l.colorPrimary }}>
                                                                    <span className="text-white font-semibold text-sm">{l.name.slice(0,2).toUpperCase()}</span>
                                                                </div>
                                                                <div>
                                                                    <div className="font-semibold text-gray-900">{l.name}</div>
                                                                    <div className="text-xs text-gray-500">{l.school ? l.school.name : "Nessuna scuola"}</div>
                                                                </div>
                                                            </div>
                                                            <div className="mt-2 text-sm text-gray-600">{l.slogan || l.description}</div>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                className="p-2 rounded text-sm bg-[#eef2ff] flex items-center gap-2"
                                                                title="Entra"
                                                                onClick={(e) => { e.stopPropagation(); setSelectedIndex(fullIdx); handleEnter(); }}
                                                            >
                                                                <ArrowRightCircle size={16} /> Entra
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* RIGHT: preview panel */}
                            <div className="flex-[1.8]">
                                <div className="p-7 bg-white rounded-[20px] shadow-sm min-h-[420px] flex flex-col items-center">
                                    {selected ? (
                                        <>
                                            <div className="w-[120px] h-[120px] rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: AppColor.secondary }}>
                                                <span className="text-[36px] font-semibold text-[#336900]">{selected.name.slice(0,2).toUpperCase()}</span>
                                            </div>

                                            <h2 className="text-2xl font-semibold text-gray-900 text-center">{selected.name}</h2>
                                            <p className="text-[15px] text-gray-500 mt-2 text-center">{selected.slogan || selected.description}</p>

                                            <div className="w-full h-px bg-gray-200 my-6"></div>

                                            <div className="w-full mb-4">
                                                <p className="text-[13px] text-gray-500 font-medium mb-1.5">Descrizione</p>
                                                <p className="text-sm text-gray-900">{selected.description}</p>
                                            </div>

                                            <div className="w-full h-px bg-gray-200 mb-4"></div>

                                            <div className="w-full mb-6">
                                                <p className="text-[13px] text-gray-500 font-medium mb-1.5">Scuola</p>
                                                <p className="text-sm text-gray-900">{selected.school ? selected.school.name : "Nessuna"}</p>
                                            </div>

                                            <div className="w-full flex gap-3">
                                                <ActionButton icon={ArrowRightCircle} onClick={handleEnter}>Entra</ActionButton>
                                                <button className="flex-1 py-3.5 border border-[#1e3a8a] text-[#1e3a8a] rounded-[10px] font-medium hover:bg-blue-50 transition-colors" onClick={() => { setSelectedIndex(null); }}>
                                                    Deseleziona
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-gray-400 py-10">Seleziona una lista a sinistra per visualizzare l'anteprima e entrare.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ListSelector;