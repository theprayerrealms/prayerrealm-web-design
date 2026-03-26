import { useState, useEffect } from "react";
import SectionWrapper from "@/components/SectionWrapper";
import { 
  Users, 
  Calendar, 
  Heart, 
  MessageSquare, 
  TrendingUp, 
  Globe, 
  Plus, 
  MoreVertical, 
  Search, 
  Filter, 
  ArrowUpRight, 
  Download,
  Upload,
  CheckCircle2,
  Clock,
  LayoutDashboard,
  ShieldAlert,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/components/ui/use-toast";

const Admin = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'registrations' | 'events' | 'prayers' | 'testimonies'>('overview');
    const [isLoading, setIsLoading] = useState(true);
    const [regFilters, setRegFilters] = useState({
        city: '',
        volunteerStatus: '',
        transportation: '',
        accommodation: '',
        wrestleVersion: '',
        date: ''
    });
    const [stats, setStats] = useState({
        totalRegistrations: 0,
        totalPrayers: 0,
        totalTestimonies: 0,
        activeEvents: 0,
        pendingPrayers: 0,
        pendingTestimonies: 0
    });
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [eventsList, setEventsList] = useState<any[]>([]);
    const [prayersList, setPrayersList] = useState<any[]>([]);
    const [testimoniesList, setTestimoniesList] = useState<any[]>([]);

    const [isCreatingEvent, setIsCreatingEvent] = useState(false);
    const [editingEventId, setEditingEventId] = useState<string | null>(null);
    const [newEventData, setNewEventData] = useState({
        title: '',
        date: '',
        time: '',
        location: '',
        mapSearchQuery: '',
        description: '',
        image: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=2000&auto=format&fit=crop',
        wrestleVersion: '2.0',
        formConfig: { askVolunteer: true, askTransport: true, askAccommodation: true, customQuestions: [] as string[] }
    });

    const fetchData = async () => {
        setIsLoading(true);
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        
        try {
            const fetchConfig = {
                headers: { 'Accept': 'application/json' }
            };

            const [statsRes, regRes, eventsRes, testRes, prayerRes] = await Promise.all([
                fetch(`${API_BASE}/api/admin/stats`, fetchConfig),
                fetch(`${API_BASE}/api/admin/registrations`, fetchConfig),
                fetch(`${API_BASE}/api/events`, fetchConfig),
                fetch(`${API_BASE}/api/admin/testimonies`, fetchConfig),
                fetch(`${API_BASE}/api/admin/prayers`, fetchConfig)
            ]);

            setStats(await statsRes.json());
            setRegistrations(await regRes.json());
            setEventsList(await eventsRes.json());
            setTestimoniesList(await testRes.json());
            setPrayersList(await prayerRes.json());
        } catch (error: any) {
            console.error("Vault Connection Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredRegs = registrations.filter(reg => {
        return (regFilters.city === '' || reg.city?.toLowerCase().includes(regFilters.city.toLowerCase())) &&
               (regFilters.volunteerStatus === '' || reg.volunteerStatus === regFilters.volunteerStatus) &&
               (regFilters.transportation === '' || reg.transportation === regFilters.transportation) &&
               (regFilters.accommodation === '' || reg.accommodation === regFilters.accommodation) &&
               (regFilters.wrestleVersion === '' || reg.wrestleVersion === regFilters.wrestleVersion) &&
               (regFilters.date === '' || reg.createdAt?.includes(regFilters.date));
    });

    const downloadCSV = () => {
        const headers = ["Name", "Email", "Phone", "City", "Volunteer", "Department", "Transport", "Accommodation", "Version", "Status", "Date"];
        const rows = filteredRegs.map(reg => [
            `"${reg.name}"`, `"${reg.email}"`, `"${reg.phone}"`, `"${reg.city}"`, `"${reg.volunteerStatus}"`, `"${reg.department || 'N/A'}"`, `"${reg.transportation}"`, `"${reg.accommodation}"`, `"${reg.wrestleVersion}"`, `"${reg.status}"`, `"${reg.createdAt}"`
        ]);
        const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `registrations_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const sidebarItems = [
        { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'registrations', label: 'Registrations', icon: Users },
        { id: 'events', label: 'Manage Events', icon: Calendar },
        { id: 'prayers', label: 'Prayers', icon: Heart },
        { id: 'testimonies', label: 'Testimonies', icon: MessageSquare },
    ];

    const updateStatus = async (type: 'prayers' | 'testimonies', id: string, status: string) => {
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        try {
            const res = await fetch(`${API_BASE}/api/admin/${type}/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                toast({ title: "Status Updated", description: `${type} marked as ${status}` });
                fetchData(); // Refresh
            }
        } catch (error) {}
    };

    const deleteItem = async (type: string, id: string) => {
        if (!window.confirm("Are you sure you want to remove this item from the sanctuary records?")) return;
        
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        try {
            const res = await fetch(`${API_BASE}/api/admin/${type}/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                toast({ title: "Item Removed", description: "Successfully deleted from database." });
                fetchData();
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete item.", variant: "destructive" });
        }
    };

    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        try {
            const url = editingEventId ? `${API_BASE}/api/events/${editingEventId}` : `${API_BASE}/api/events`;
            const method = editingEventId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEventData)
            });
            if (res.ok) {
                toast({ 
                    title: editingEventId ? "Event Updated" : "Event Created", 
                    description: editingEventId ? "The asset modifications have been saved." : "The new asset has been successfully launched." 
                });
                setIsCreatingEvent(false);
                setEditingEventId(null);
                setNewEventData({ title: '', date: '', time: '', location: '', mapSearchQuery: '', description: '', image: '', wrestleVersion: '2.0', formConfig: { askVolunteer: true, askTransport: true, askAccommodation: true, customQuestions: [] } });
                fetchData();
            } else {
                toast({ title: "Error", description: "Failed to save event.", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "Connection error.", variant: "destructive" });
        }
    };

    const handleEditClick = (event: any) => {
        setNewEventData({
            title: event.title || '',
            date: event.date || '',
            time: event.time || '',
            location: event.location || '',
            mapSearchQuery: event.mapSearchQuery || '',
            description: event.description || '',
            image: event.image || '',
            wrestleVersion: event.wrestleVersion || '2.0',
            formConfig: event.formConfig || { askVolunteer: true, askTransport: true, askAccommodation: true, customQuestions: [] }
        });
        setEditingEventId(event.id);
        setIsCreatingEvent(true);
    };

    return (
        <div className="min-h-screen bg-[#070708] flex mt-16 md:mt-20">
            {/* 1. Sidebar */}
            <div className="w-20 lg:w-72 bg-[#0a0a0c] border-r border-white/5 flex flex-col p-4 lg:p-6 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto">
                <div className="hidden lg:flex items-center gap-3 mb-12 px-4">
                    <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-2xl shadow-red-600/30">
                        <ShieldAlert size={20} className="text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-white text-lg leading-tight uppercase font-heading italic">Command <span className="gold-text">Desk</span></h2>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Admin Control</p>
                    </div>
                </div>

                <div className="space-y-2 flex-1">
                    {sidebarItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as any)}
                            className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group ${
                                activeTab === item.id 
                                ? 'bg-red-600/10 text-red-500 border border-red-600/20' 
                                : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <item.icon size={22} className={activeTab === item.id ? 'animate-pulse' : ''} />
                            <span className="hidden lg:block font-bold text-sm uppercase tracking-widest italic">{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* 2. Main Content */}
            <div className="flex-1 p-6 md:p-12 overflow-x-hidden">
                <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">
                            {activeTab} <span className="gold-text">Console</span>
                        </h1>
                        <p className="text-muted-foreground text-sm font-medium uppercase tracking-[0.2em] ml-1">Database-Synced Assets</p>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        {activeTab === 'overview' && (
                            <div className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                                    <StatsCard label="Registrations" value={stats.totalRegistrations} delta="+12%" icon={Users} color="red" />
                                    <StatsCard label="Prayers" value={stats.totalPrayers} delta="+5%" icon={Heart} color="amber" />
                                    <StatsCard label="Testimonies" value={stats.totalTestimonies} delta="+21%" icon={MessageSquare} color="amber" />
                                    <StatsCard label="Events" value={stats.activeEvents} delta="Live" icon={Globe} color="red" />
                                </div>

                                <div className="grid lg:grid-cols-3 gap-10">
                                    <div className="lg:col-span-2 glass-card p-10 rounded-[3rem] border-white/5">
                                        <h3 className="text-2xl font-bold text-white italic mb-10">Live <span className="gold-text">Database Feed</span></h3>
                                        <div className="space-y-4">
                                            {registrations.slice(0, 5).map(reg => (
                                                <div key={reg.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-red-600/10 rounded-full flex items-center justify-center text-red-500 font-bold">{reg.name[0]}</div>
                                                        <div>
                                                            <p className="text-white font-bold italic text-sm">{reg.name}</p>
                                                            <p className="text-[10px] text-muted-foreground uppercase">{reg.email}</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase text-red-500">{reg.date || 'New'}</span>
                                                </div>
                                            ))}
                                            {registrations.length === 0 && <p className="text-center py-10 text-white/20 italic">No registrations found in database.</p>}
                                        </div>
                                    </div>

                                    <div className="glass-card p-10 rounded-[3rem] border-white/5">
                                        <h3 className="text-xl font-bold text-white italic mb-8">Queue <span className="gold-text">Summary</span></h3>
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5">
                                                <span className="text-xs font-bold uppercase italic text-white/60">Pending Prayers</span>
                                                <span className="text-red-500 font-black text-xl">{stats.pendingPrayers}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5">
                                                <span className="text-xs font-bold uppercase italic text-white/60">Pending Testimonies</span>
                                                <span className="text-amber-500 font-black text-xl">{stats.pendingTestimonies}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'registrations' && (
                            <div className="space-y-6">
                                {/* Filter Bar */}
                                <div className="glass-card p-6 rounded-[2rem] border-white/5 flex flex-wrap items-end gap-6 shadow-2xl">
                                    <div className="flex-1 min-w-[200px] space-y-2">
                                        <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Search City</label>
                                        <input 
                                            type="text" placeholder="Lagos, London..." 
                                            value={regFilters.city}
                                            onChange={(e) => setRegFilters({...regFilters, city: e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-red-600"
                                        />
                                    </div>
                                    <div className="w-[140px] space-y-2">
                                        <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Reg. Date</label>
                                        <input 
                                            type="date"
                                            value={regFilters.date}
                                            onChange={(e) => setRegFilters({...regFilters, date: e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-red-600 [color-scheme:dark]"
                                        />
                                    </div>
                                    <div className="w-[120px] space-y-2">
                                        <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Volunteer</label>
                                        <select 
                                            value={regFilters.volunteerStatus}
                                            onChange={(e) => setRegFilters({...regFilters, volunteerStatus: e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                                        >
                                            <option value="" className="bg-black">All</option>
                                            <option value="YES" className="bg-black">Yes</option>
                                            <option value="NO" className="bg-black">No</option>
                                        </select>
                                    </div>
                                    <div className="w-[120px] space-y-2">
                                        <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Transport</label>
                                        <select 
                                            value={regFilters.transportation}
                                            onChange={(e) => setRegFilters({...regFilters, transportation: e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                                        >
                                            <option value="" className="bg-black">All</option>
                                            <option value="YES" className="bg-black">Needed</option>
                                            <option value="NO" className="bg-black">No Need</option>
                                        </select>
                                    </div>
                                    <div className="w-[120px] space-y-2">
                                        <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Accommod.</label>
                                        <select 
                                            value={regFilters.accommodation}
                                            onChange={(e) => setRegFilters({...regFilters, accommodation: e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                                        >
                                            <option value="" className="bg-black">All</option>
                                            <option value="YES" className="bg-black">Yes</option>
                                            <option value="NO" className="bg-black">No</option>
                                        </select>
                                    </div>
                                    <div className="w-[100px] space-y-2">
                                        <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Version</label>
                                        <input
                                            type="text" placeholder="e.g. 5.0"
                                            value={regFilters.wrestleVersion}
                                            onChange={(e) => setRegFilters({...regFilters, wrestleVersion: e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-red-600"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => setRegFilters({ city: '', volunteerStatus: '', transportation: '', accommodation: '', wrestleVersion: '', date: '' })}
                                            className="bg-white/5 hover:bg-white/10 text-white/40 hover:text-white px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
                                        >
                                            Reset
                                        </button>
                                        <button 
                                            onClick={downloadCSV}
                                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold text-xs uppercase tracking-widest transition-all"
                                        >
                                            <Download size={14} /> Export CSV
                                        </button>
                                    </div>
                                </div>

                                <div className="glass-card p-10 rounded-[3rem] border-white/5 min-h-[500px] overflow-x-auto">
                                    <table className="w-full text-left min-w-[1000px]">
                                        <thead>
                                            <tr className="border-b border-white/5">
                                                <th className="pb-6 text-[10px] font-black uppercase text-white/30">Attendee Info</th>
                                                <th className="pb-6 text-[10px] font-black uppercase text-white/30">Location</th>
                                                <th className="pb-6 text-[10px] font-black uppercase text-white/30 text-center">Version</th>
                                                <th className="pb-6 text-[10px] font-black uppercase text-white/30 text-center">Volunteer</th>
                                                <th className="pb-6 text-[10px] font-black uppercase text-white/30 text-center">Transport</th>
                                                <th className="pb-6 text-[10px] font-black uppercase text-white/30">Altar Status</th>
                                                <th className="pb-6"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {filteredRegs.map((reg) => (
                                                <tr key={reg.id} className="group hover:bg-white/[0.02] transition-all">
                                                    <td className="py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 bg-red-600/10 rounded-full flex items-center justify-center text-red-600 border border-red-600/20 font-black italic">{reg.name[0]}</div>
                                                            <div>
                                                                <p className="text-white font-bold italic text-sm">{reg.name}</p>
                                                                <p className="text-[10px] text-muted-foreground uppercase">{reg.phone} | {reg.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-6 text-sm text-white/70 italic font-medium">{reg.city || 'N/A'}</td>
                                                    <td className="py-6 text-center">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black ${reg.wrestleVersion === '3.0' ? 'bg-amber-600/10 text-amber-500 border-amber-600/20' : 'bg-blue-600/10 text-blue-500 border-blue-600/20'} border uppercase`}>
                                                            Wrestle {reg.wrestleVersion || '2.0'}
                                                        </span>
                                                    </td>
                                                    <td className="py-6 text-center">
                                                        <div className="flex flex-col items-center gap-1">
                                                            <span className={`text-[10px] font-black ${reg.volunteerStatus === 'YES' ? 'text-green-500' : 'text-white/20'}`}>{reg.volunteerStatus}</span>
                                                            {reg.department && <span className="text-[8px] text-muted-foreground uppercase font-bold">{reg.department}</span>}
                                                        </div>
                                                    </td>
                                                    <td className="py-6 text-center">
                                                        <span className={`text-[10px] font-black ${reg.transportation === 'YES' ? 'text-red-500' : 'text-white/20'}`}>{reg.transportation}</span>
                                                    </td>
                                                    <td className="py-6">
                                                        <span className="px-3 py-1 rounded-full bg-white/5 text-white/40 text-[10px] font-black uppercase border border-white/10">Authorized</span>
                                                    </td>
                                                     <td className="py-6 text-right">
                                                         <div className="flex items-center justify-end gap-2 pr-4 opacity-0 group-hover:opacity-100 transition-all">
                                                             <button onClick={() => deleteItem('registrations', reg.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={16} /></button>
                                                             <MoreVertical size={16} className="text-white/20" />
                                                         </div>
                                                     </td>
                                                 </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {filteredRegs.length === 0 && (
                                        <div className="text-center py-20">
                                            <p className="text-white/20 italic font-black uppercase tracking-widest">No scrolls match these filters.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'events' && (
                            <div className="space-y-6">
                                <div className="flex justify-end">
                                    <button 
                                        onClick={() => {
                                            if (isCreatingEvent) {
                                                setNewEventData({ title: '', date: '', time: '', location: '', mapSearchQuery: '', description: '', image: '', wrestleVersion: '2.0', formConfig: { askVolunteer: true, askTransport: true, askAccommodation: true, customQuestions: [] } });
                                                setEditingEventId(null);
                                            }
                                            setIsCreatingEvent(!isCreatingEvent);
                                        }}
                                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold text-xs uppercase tracking-widest transition-all"
                                    >
                                        {isCreatingEvent ? "Cancel Editor" : <><Plus size={16} /> Create Asset</>}
                                    </button>
                                </div>

                                {isCreatingEvent ? (
                                    <form onSubmit={handleCreateEvent} className="glass-card p-10 rounded-[3rem] border-white/5 space-y-6 max-w-3xl mx-auto">
                                        <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-6">Asset <span className="gold-text">{editingEventId ? 'Modification' : 'Configuration'}</span></h3>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2 col-span-2">
                                                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Event Title</label>
                                                <input required type="text" value={newEventData.title} onChange={e => setNewEventData({...newEventData, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-red-600 text-white" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Encounter Version</label>
                                                <input required type="text" placeholder="e.g. 5.0" value={newEventData.wrestleVersion} onChange={e => setNewEventData({...newEventData, wrestleVersion: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-red-600 text-white" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Event Date</label>
                                                <input required type="text" placeholder="e.g. 15th August 2026" value={newEventData.date} onChange={e => setNewEventData({...newEventData, date: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-red-600 text-white" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Event Time</label>
                                                <input required type="text" placeholder="e.g. 10:00 PM" value={newEventData.time} onChange={e => setNewEventData({...newEventData, time: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-red-600 text-white" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Displayed Location</label>
                                                <input required type="text" placeholder="e.g. Lagos, Nigeria" value={newEventData.location} onChange={e => setNewEventData({...newEventData, location: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-red-600 text-white" />
                                            </div>
                                            <div className="space-y-2 col-span-2">
                                                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Precise Map Query (Optional)</label>
                                                <input type="text" placeholder="e.g. The exact Google Maps location link or precise venue coordinates" value={newEventData.mapSearchQuery} onChange={e => setNewEventData({...newEventData, mapSearchQuery: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-red-600 text-white" />
                                            </div>
                                            <div className="space-y-2 col-span-2">
                                                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Event Featured Image</label>
                                                <div className="relative w-full h-40 bg-white/5 border border-white/10 hover:border-red-600 transition-all rounded-2xl flex items-center justify-center overflow-hidden border-dashed cursor-pointer shadow-inner">
                                                    {newEventData.image && newEventData.image.length > 0 ? (
                                                        <img src={newEventData.image} alt="Event Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                                                    ) : null}
                                                    <input 
                                                        type="file" 
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                const reader = new FileReader();
                                                                reader.onloadend = () => {
                                                                    setNewEventData({...newEventData, image: reader.result as string});
                                                                };
                                                                reader.readAsDataURL(file);
                                                            }
                                                        }}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                                    />
                                                    <div className="z-10 text-center flex flex-col items-center pointer-events-none drop-shadow-lg">
                                                        <Upload className="mb-2 text-red-500 animate-pulse" size={24} />
                                                        <p className="text-white font-black italic text-sm">UPLOAD IMAGE</p>
                                                        <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1 font-bold">PNG, JPG to Base64</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2 col-span-2">
                                                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Description</label>
                                                <textarea required rows={4} value={newEventData.description} onChange={e => setNewEventData({...newEventData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-red-600 text-white resize-none" />
                                            </div>

                                            {/* Form Configuration Sandbox */}
                                            <div className="col-span-2 p-6 rounded-[2rem] bg-white/[0.02] border border-white/10 mt-4">
                                                <div className="flex items-center justify-between mb-6">
                                                    <h4 className="text-xs font-bold text-red-500 uppercase tracking-widest">Dynamic Form Builder</h4>
                                                    <div className="flex gap-2">
                                                        {!newEventData.formConfig.askVolunteer && (
                                                            <button type="button" onClick={() => setNewEventData({...newEventData, formConfig: {...newEventData.formConfig, askVolunteer: true}})} className="text-[10px] bg-green-500/10 text-green-500 border border-green-500/20 px-3 py-1.5 rounded-full uppercase font-bold hover:bg-green-500/30 transition-all">+ Add Volunteer Q.</button>
                                                        )}
                                                        {!newEventData.formConfig.askTransport && (
                                                            <button type="button" onClick={() => setNewEventData({...newEventData, formConfig: {...newEventData.formConfig, askTransport: true}})} className="text-[10px] bg-green-500/10 text-green-500 border border-green-500/20 px-3 py-1.5 rounded-full uppercase font-bold hover:bg-green-500/30 transition-all">+ Add Transport Q.</button>
                                                        )}
                                                        {!newEventData.formConfig.askAccommodation && (
                                                            <button type="button" onClick={() => setNewEventData({...newEventData, formConfig: {...newEventData.formConfig, askAccommodation: true}})} className="text-[10px] bg-green-500/10 text-green-500 border border-green-500/20 px-3 py-1.5 rounded-full uppercase font-bold hover:bg-green-500/30 transition-all">+ Add Accommod. Q.</button>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <h5 className="text-[10px] font-bold text-white/30 uppercase">Active Questions Map</h5>
                                                        <button 
                                                            type="button" 
                                                            onClick={() => setNewEventData({...newEventData, formConfig: {...newEventData.formConfig, customQuestions: [...newEventData.formConfig.customQuestions, '']}})}
                                                            className="text-xs font-bold text-red-500 hover:text-white uppercase tracking-widest font-heading italic transition-all"
                                                        >
                                                            + Add Custom Question
                                                        </button>
                                                    </div>

                                                    {newEventData.formConfig.askVolunteer && (
                                                        <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3 group hover:border-white/20 transition-all">
                                                            <span className="text-xs font-bold text-white uppercase flex items-center gap-3"><CheckCircle2 size={14} className="text-green-500" /> Will you Volunteer? (Yes/No)</span>
                                                            <button type="button" onClick={() => setNewEventData({...newEventData, formConfig: {...newEventData.formConfig, askVolunteer: false}})} className="p-2 text-white/30 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                                                        </div>
                                                    )}
                                                    {newEventData.formConfig.askTransport && (
                                                        <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3 group hover:border-white/20 transition-all">
                                                            <span className="text-xs font-bold text-white uppercase flex items-center gap-3"><CheckCircle2 size={14} className="text-green-500" /> Transportation Needed? (Dropdown)</span>
                                                            <button type="button" onClick={() => setNewEventData({...newEventData, formConfig: {...newEventData.formConfig, askTransport: false}})} className="p-2 text-white/30 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                                                        </div>
                                                    )}
                                                    {newEventData.formConfig.askAccommodation && (
                                                        <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3 group hover:border-white/20 transition-all">
                                                            <span className="text-xs font-bold text-white uppercase flex items-center gap-3"><CheckCircle2 size={14} className="text-green-500" /> Accommodation Required? (Dropdown)</span>
                                                            <button type="button" onClick={() => setNewEventData({...newEventData, formConfig: {...newEventData.formConfig, askAccommodation: false}})} className="p-2 text-white/30 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                                                        </div>
                                                    )}

                                                    {newEventData.formConfig.customQuestions.map((q, idx) => (
                                                        <div key={idx} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl pl-4 pr-1 py-1 focus-within:border-red-600 transition-all group">
                                                            <input 
                                                                type="text" 
                                                                placeholder="e.g. What specific department would you like to volunteer in?"
                                                                value={q}
                                                                onChange={(e) => {
                                                                    const nv = [...newEventData.formConfig.customQuestions];
                                                                    nv[idx] = e.target.value;
                                                                    setNewEventData({...newEventData, formConfig: {...newEventData.formConfig, customQuestions: nv}});
                                                                }}
                                                                className="flex-1 bg-transparent text-xs text-white uppercase font-bold focus:outline-none"
                                                            />
                                                            <button 
                                                                type="button"
                                                                onClick={() => {
                                                                    const nv = [...newEventData.formConfig.customQuestions];
                                                                    nv.splice(idx, 1);
                                                                    setNewEventData({...newEventData, formConfig: {...newEventData.formConfig, customQuestions: nv}});
                                                                }}
                                                                className="p-3 text-white/30 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    
                                                    {!newEventData.formConfig.askVolunteer && !newEventData.formConfig.askTransport && !newEventData.formConfig.askAccommodation && newEventData.formConfig.customQuestions.length === 0 && (
                                                        <div className="py-6 text-center border border-white/5 border-dashed rounded-xl">
                                                            <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">This form accepts direct passage (No Questions)</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-bold italic transition-all uppercase tracking-widest mt-6">Publish Event Update</button>
                                    </form>
                                ) : (
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {eventsList.map(event => (
                                            <div key={event.id} className="glass-card p-6 rounded-[2.5rem] border-white/5 relative">
                                                <div className="absolute top-8 left-8 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-black uppercase text-amber-500 z-10">
                                                    V {event.wrestleVersion || '2.0'}
                                                </div>
                                                <div className="aspect-video rounded-3xl overflow-hidden mb-4 relative z-0">
                                                    <img src={event.image} className="w-full h-full object-cover" />
                                                </div>
                                                <h4 className="text-lg font-bold text-white mb-2 italic">{event.title}</h4>
                                                <p className="text-[10px] text-muted-foreground uppercase mb-4">{event.date} | {event.location}</p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-black text-red-500 uppercase">{event.attendeeCount || 0} RSVPs</span>
                                                    <div className="flex gap-4">
                                                        <button onClick={() => deleteItem('events', event.id)} className="text-red-500 hover:text-red-400"><Trash2 size={14} /></button>
                                                        <button onClick={() => handleEditClick(event)} className="text-xs font-bold text-white/40 hover:text-white uppercase">Modify</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'prayers' && (
                            <div className="space-y-4 h-[600px] overflow-y-auto pr-4">
                                {prayersList.map(prayer => (
                                    <div key={prayer.id} className="glass-card p-8 rounded-[2rem] border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-red-600/20 transition-all">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-4">
                                                <p className="text-white font-black italic uppercase text-xs">{prayer.name || "Intercessor"}</p>
                                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${prayer.status === 'PENDING' ? 'bg-amber-500/20 text-amber-500' : 'bg-green-500/20 text-green-500'}`}>{prayer.status}</span>
                                            </div>
                                            <p className="text-white/60 text-lg italic leading-relaxed font-medium">"{prayer.message}"</p>
                                        </div>
                                         <div className="flex gap-3">
                                             {prayer.status === 'PENDING' && (
                                                 <button onClick={() => updateStatus('prayers', prayer.id, 'APPROVED')} className="p-4 bg-green-600/10 text-green-500 rounded-full border border-green-500/20 hover:bg-green-600/20 transition-all"><CheckCircle2 size={24} /></button>
                                             )}
                                             <button onClick={() => deleteItem('prayers', prayer.id)} className="p-4 bg-red-600/10 text-red-500 rounded-full border border-red-500/20 hover:bg-red-600/20 transition-all"><Trash2 size={24} /></button>
                                             <button className="p-4 bg-white/5 text-white/20 rounded-full border border-white/10 hover:text-white transition-all"><MoreVertical size={24} /></button>
                                         </div>
                                    </div>
                                ))}
                                {prayersList.length === 0 && <p className="text-center py-20 text-white/20 italic font-black uppercase tracking-widest">The altar queue is empty.</p>}
                            </div>
                        )}

                        {activeTab === 'testimonies' && (
                            <div className="space-y-4">
                                {testimoniesList.map(test => (
                                    <div key={test.id} className="glass-card p-6 rounded-3xl border-white/5">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <p className="text-white font-bold italic uppercase">{test.name}</p>
                                                <span className="text-[10px] text-red-500 font-bold uppercase italic">{test.status}</span>
                                            </div>
                                             <div className="flex gap-2">
                                                 {test.status === 'PENDING' && (
                                                     <button onClick={() => updateStatus('testimonies', test.id, 'APPROVED')} className="p-3 bg-green-600/10 text-green-500 rounded-full border border-green-500/20"><CheckCircle2 size={18} /></button>
                                                 )}
                                                 <button onClick={() => deleteItem('testimonies', test.id)} className="p-3 bg-red-600/10 text-red-500 rounded-full border border-red-600/20"><Trash2 size={18} /></button>
                                             </div>
                                        </div>
                                        <p className="text-sm text-white/70 italic leading-relaxed">{test.message || test.content}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

const StatsCard = ({ label, value, delta, icon: Icon, color }: any) => (
    <div className="glass-card p-8 rounded-[2.5rem] border-white/5">
        <div className="flex items-center justify-between mb-6">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${color === 'red' ? 'text-red-600 bg-red-600/10 border-red-600/20' : 'text-amber-500 bg-amber-500/10 border-amber-500/20'}`}><Icon size={22} /></div>
            <span className="text-[10px] font-black uppercase text-green-500">{delta}</span>
        </div>
        <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">{label}</p>
        <h4 className="text-3xl font-black text-white italic">{value.toLocaleString()}</h4>
    </div>
);

const ProgressBar = ({ label, percent, color }: any) => (
    <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-bold uppercase italic">
            <span className="text-white/40">{label}</span>
            <span className={color === 'red' ? 'text-red-500' : 'text-amber-500'}>{percent}%</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div className={`h-full ${color === 'red' ? 'bg-red-600 shadow-[0_0_10px_red]' : 'bg-amber-600 shadow-[0_0_10px_amber]'}`} style={{ width: `${percent}%` }} />
        </div>
    </div>
);

export default Admin;
