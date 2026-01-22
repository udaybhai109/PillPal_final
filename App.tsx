import React, { useState, useEffect } from 'react';
import { Medication, ViewState, UserProfile } from './types';
import Scanner from './components/Scanner';
import { parsePrescription, checkInteractions } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('splash');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isWarningMinimized, setIsWarningMinimized] = useState(false);
  const [user, setUser] = useState<UserProfile>({
    name: '', email: '', dob: '', gender: '', goals: [], kinName: '', kinPhone: '', 
    doctorName: '', doctorPhone: '', snoozeTime: 10, alertTone: 'Midnight Mint Pulse'
  });
  const [medications, setMedications] = useState<Medication[]>([]);
  const [pendingMeds, setPendingMeds] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [interactionWarning, setInteractionWarning] = useState<string | null>(null);

  const THEME_BG = "bg-[#040d0d]";
  const ACCENT_GRADIENT = "from-teal-400 to-emerald-600";

  useEffect(() => {
    const savedMeds = localStorage.getItem('pillpal_meds');
    const savedUser = localStorage.getItem('pillpal_user');
    if (savedMeds) setMedications(JSON.parse(savedMeds));
    if (savedUser) {
        setUser(JSON.parse(savedUser));
        setView('dashboard');
    } else {
        setTimeout(() => setView('login'), 2000);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pillpal_meds', JSON.stringify(medications));
    localStorage.setItem('pillpal_user', JSON.stringify(user));
  }, [medications, user]);

  const handleScan = async (base64: string) => {
    setIsLoading(true);
    try {
      const result = await parsePrescription(base64);
      const mapped = result.medications.map(m => ({
        ...m,
        id: Math.random().toString(36).substr(2, 9),
        status: 'active' as const,
        dateAdded: Date.now(),
        adherenceLog: {},
        total_pills: m.total_pills || 30,
        pills_remaining: m.total_pills || 30
      }));
      setPendingMeds(mapped);
      const names = [...medications, ...mapped].map(m => m.medication);
      const warning = await checkInteractions(names);
      setInteractionWarning(warning);
      setView('verify');
    } catch {
      setView('dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAdherence = (medId: string, time: string) => {
    const today = new Date().toISOString().split('T')[0];
    const key = `${today}_${time}`;
    setMedications(prev => prev.map(m => {
      if (m.id === medId) {
        const newLog = { ...m.adherenceLog, [key]: !m.adherenceLog[key] };
        return { 
          ...m, 
          adherenceLog: newLog,
          pills_remaining: !m.adherenceLog[key] ? m.pills_remaining - 1 : m.pills_remaining + 1
        };
      }
      return m;
    }));
  };

  const logout = () => {
    localStorage.removeItem('pillpal_user');
    window.location.reload();
  };

  const SidebarItem = ({ icon, label, onClick, color = "text-slate-300" }: { icon: string, label: string, onClick: () => void, color?: string }) => (
    <button onClick={() => { onClick(); setIsSidebarOpen(false); }} className={`flex items-center gap-4 w-full p-4 hover:bg-teal-500/10 transition-all rounded-2xl ${color} group`}>
        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-teal-950/20 group-hover:bg-teal-400/20 border border-teal-500/10">
          <i className={`fa-solid ${icon} text-sm group-hover:text-teal-400`}></i>
        </div>
        <span className="font-semibold text-sm tracking-wide">{label}</span>
    </button>
  );

  const BackButton = () => (
    <button onClick={() => setView('dashboard')} className="flex items-center gap-2 text-teal-400 font-black brand-font mb-8 hover:-translate-x-1 transition-transform">
        <i className="fa-solid fa-arrow-left"></i> BACK
    </button>
  );

  if (view === 'splash') {
    return (
      <div className={`min-h-screen ${THEME_BG} flex flex-col items-center justify-center text-white`}>
        <div className={`w-32 h-32 bg-gradient-to-br ${ACCENT_GRADIENT} rounded-[2.5rem] flex items-center justify-center mb-8 shadow-[0_0_80px_rgba(45,212,191,0.2)] animate-pulse`}>
          <i className="fa-solid fa-vial-circle-check text-5xl"></i>
        </div>
        <h1 className="text-6xl font-black brand-font tracking-tighter text-teal-400">PillPal</h1>
        <p className="text-teal-900 font-bold mt-4 tracking-[0.5em] text-[10px] uppercase">Autonomous Care AI</p>
      </div>
    );
  }

  if (view === 'login') {
    return (
      <div className={`min-h-screen ${THEME_BG} p-10 flex flex-col justify-between text-white`}>
        <div className="mt-20 text-center">
            <div className={`w-24 h-24 bg-teal-950/30 border border-teal-500/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner`}>
                <i className="fa-solid fa-pills text-teal-400 text-4xl"></i>
            </div>
            <h2 className="text-5xl font-black brand-font mb-4 text-white">PillPal</h2>
            <p className="text-teal-800 font-bold uppercase tracking-[0.2em] text-[9px]">Intelligent Adherence Gateway</p>
        </div>
        <div className="space-y-6">
            <input 
                placeholder="Medical Portal Email" 
                className="w-full bg-[#081b1b] border border-teal-900/50 p-6 rounded-[1.5rem] focus:ring-2 focus:ring-teal-500 outline-none transition-all placeholder:text-teal-900 text-teal-100"
                value={user.email}
                onChange={e => setUser({...user, email: e.target.value})}
            />
            <button 
                onClick={() => setView('onboarding')}
                className={`w-full bg-gradient-to-r ${ACCENT_GRADIENT} p-6 rounded-[1.5rem] font-black brand-font text-white hover:brightness-110 transition-all shadow-xl shadow-teal-950/50 uppercase tracking-widest`}
            >
                Start AI Portal
            </button>
        </div>
      </div>
    );
  }

  if (view === 'onboarding') {
    return (
      <div className={`min-h-screen ${THEME_BG} p-10 text-white flex flex-col`}>
        <header className="flex items-center gap-6 mb-12">
            <button onClick={() => setView('login')} className="w-12 h-12 rounded-2xl bg-[#081b1b] border border-teal-900/30 flex items-center justify-center"><i className="fa-solid fa-arrow-left text-teal-400"></i></button>
            <div className="h-2 bg-[#081b1b] flex-1 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${ACCENT_GRADIENT} w-1/3`}></div>
            </div>
        </header>
        <div className="flex-1 space-y-10 overflow-y-auto pr-2 custom-scrollbar">
            <div>
              <h2 className="text-4xl font-black brand-font text-white">Registry</h2>
              <p className="text-teal-900 font-black uppercase tracking-widest text-[9px] mt-2">Personalizing your medical logic</p>
            </div>
            
            <div className="space-y-6">
                <input placeholder="Legal Full Name" className="w-full bg-[#081b1b] border border-teal-900/30 p-5 rounded-2xl focus:border-teal-400 outline-none" onChange={e => setUser({...user, name: e.target.value})} />
                
                <div className="grid grid-cols-2 gap-4">
                    {['Male', 'Female'].map(g => (
                        <button key={g} onClick={() => setUser({...user, gender: g})} className={`p-5 rounded-2xl border-2 font-black tracking-widest text-[10px] transition-all uppercase ${user.gender === g ? 'bg-teal-500/20 border-teal-400 text-teal-400' : 'bg-[#081b1b] border-teal-900/30 text-teal-900'}`}>{g}</button>
                    ))}
                </div>

                <div className="bg-[#081b1b]/50 p-8 rounded-[3rem] border border-teal-500/10 space-y-6">
                    <p className="text-[10px] font-black text-teal-400 uppercase tracking-[0.25em]">Kin Emergency Node</p>
                    <input placeholder="Kin Name" className="w-full bg-[#040d0d] p-4 rounded-2xl border border-teal-900/30" value={user.kinName} onChange={e => setUser({...user, kinName: e.target.value})} />
                    <input placeholder="Kin Phone" className="w-full bg-[#040d0d] p-4 rounded-2xl border border-teal-900/30" value={user.kinPhone} onChange={e => setUser({...user, kinPhone: e.target.value})} />
                    <p className="text-[10px] text-teal-700 font-bold italic text-center">Auto-alerts enabled for missed doses.</p>
                </div>
            </div>
        </div>
        <button onClick={() => setView('dashboard')} className={`w-full bg-gradient-to-r ${ACCENT_GRADIENT} p-6 rounded-[2rem] font-black brand-font mt-10 shadow-2xl uppercase tracking-widest`}>Sync Biometrics</button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${THEME_BG} flex flex-col max-w-md mx-auto relative overflow-hidden shadow-2xl text-slate-100`}>
      {/* Sidebar Menu */}
      <aside className={`fixed top-0 left-0 bottom-0 w-[85%] bg-[#040d0d] z-[120] transition-transform duration-500 ease-in-out border-r border-teal-900/30 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-[40px_0_100px_rgba(0,0,0,0.8)]`}>
        <div className="p-10 flex-1 overflow-y-auto">
            <div className="flex items-center gap-5 mb-12">
                <div className={`w-16 h-16 bg-gradient-to-br ${ACCENT_GRADIENT} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <i className="fa-solid fa-user-shield text-2xl text-white"></i>
                </div>
                <div className="overflow-hidden">
                    <h3 className="font-black text-xl brand-font truncate text-teal-400">{user.name || 'PillPal User'}</h3>
                    <p className="text-[9px] font-black text-teal-900 uppercase tracking-widest mt-1 truncate">{user.email}</p>
                </div>
            </div>
            
            <div className="space-y-2">
                <div className="text-[9px] font-black text-teal-950 uppercase tracking-[0.3em] mb-4 ml-4 font-bold">Health Monitor</div>
                <SidebarItem icon="fa-chart-area" label="Adherence Feed" onClick={() => setView('report')} />
                <SidebarItem icon="fa-folder-medical" label="Archives" onClick={() => setView('history')} />
                <SidebarItem icon="fa-heart-pulse" label="Health Contacts" onClick={() => setView('settings')} />
                <SidebarItem icon="fa-bolt" label="PillPal Pro" onClick={() => setView('premium')} color="text-teal-300" />
                
                <div className="text-[9px] font-black text-teal-950 uppercase tracking-[0.3em] mt-10 mb-4 ml-4 font-bold">Preferences</div>
                <SidebarItem icon="fa-gear" label="System Config" onClick={() => setView('settings')} />
                <SidebarItem icon="fa-language" label="Localization" onClick={() => {}} />
                <SidebarItem icon="fa-headset" label="Safety Center" onClick={() => setView('help')} />
                
                <div className="pt-12 space-y-2">
                  <SidebarItem icon="fa-power-off" label="Disconnect" onClick={logout} color="text-teal-900" />
                  <button className="w-full text-left p-4 text-[10px] text-red-950/40 hover:text-red-600 transition-colors uppercase tracking-[0.4em] font-black">Wipe Account Data</button>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className={`flex flex-col h-full transition-all duration-500 ${isSidebarOpen ? 'scale-[0.92] translate-x-[80%] opacity-40 blur-[2px]' : ''}`} onClick={() => isSidebarOpen && setIsSidebarOpen(false)}>
        <header className="px-8 pt-16 pb-6 flex justify-between items-center sticky top-0 bg-[#040d0d]/90 backdrop-blur-3xl z-40 border-b border-teal-950/20">
          <button onClick={() => setIsSidebarOpen(true)} className="w-12 h-12 rounded-2xl bg-[#081b1b] border border-teal-900/30 flex items-center justify-center hover:bg-teal-900/40 transition-all">
            <i className="fa-solid fa-bars-staggered text-teal-400"></i>
          </button>
          <h1 className="text-3xl font-black brand-font tracking-tighter text-teal-400">PillPal</h1>
          <button onClick={() => setView('report')} className="w-12 h-12 rounded-2xl bg-teal-500/5 border border-teal-500/10 flex items-center justify-center text-teal-500">
            <i className="fa-solid fa-dna"></i>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto px-8 py-4 pb-44">
          {view === 'dashboard' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className={`bg-gradient-to-br ${ACCENT_GRADIENT} rounded-[3rem] p-8 shadow-[0_40px_80px_rgba(20,184,166,0.15)] relative overflow-hidden group`}>
                  <div className="flex justify-between items-start mb-8">
                      <div>
                          <p className="text-teal-50 text-[10px] font-black uppercase tracking-[0.4em]">Monthly Compliance</p>
                          <h2 className="text-6xl font-black brand-font tracking-tighter text-white">94%</h2>
                      </div>
                      <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/20">
                          <i className="fa-solid fa-shield-virus text-white text-2xl"></i>
                      </div>
                  </div>
                  <p className="text-teal-50/70 text-[10px] font-bold uppercase tracking-widest">Active Link: {user.kinName || 'Primary KIN'}</p>
              </div>

              {interactionWarning && (
                  <div className={`p-6 bg-amber-950/20 border border-amber-500/20 text-amber-500 rounded-[2.5rem] text-[11px] flex items-center gap-6 transition-all duration-700 ${isWarningMinimized ? 'h-16' : ''}`}>
                      <i className="fa-solid fa-biohazard text-xl"></i>
                      {!isWarningMinimized ? (
                        <div className="flex-1">
                            <p className="font-black uppercase tracking-[0.2em] text-[10px] mb-1">Drug Interaction</p>
                            <p className="leading-relaxed font-medium opacity-80">{interactionWarning}</p>
                        </div>
                      ) : <p className="flex-1 font-black brand-font tracking-widest uppercase">Minimized Risk Alert</p>}
                      <button onClick={() => setIsWarningMinimized(!isWarningMinimized)} className="p-3 bg-black/40 rounded-xl">
                        <i className={`fa-solid ${isWarningMinimized ? 'fa-expand' : 'fa-compress'}`}></i>
                      </button>
                  </div>
              )}

              <div className="space-y-8">
                  <div className="flex justify-between items-center border-b border-teal-900/20 pb-4">
                    <h3 className="text-[10px] font-black text-teal-900 uppercase tracking-[0.5em]">Active Cycles</h3>
                    <span className="text-[10px] text-teal-800 font-black brand-font uppercase">{new Date().toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}</span>
                  </div>

                  {medications.length === 0 ? (
                      <div className="bg-[#081b1b] border-2 border-dashed border-teal-900/30 rounded-[3rem] p-20 text-center group cursor-pointer" onClick={() => setView('scanner')}>
                          <div className="w-24 h-24 bg-[#040d0d] border border-teal-900/30 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                            <i className="fa-solid fa-plus text-teal-900 text-4xl group-hover:text-teal-400 transition-colors"></i>
                          </div>
                          <p className="text-teal-900 font-black brand-font uppercase tracking-widest text-[11px]">Sync Prescription Node</p>
                      </div>
                  ) : (
                      <div className="grid grid-cols-1 gap-6">
                          {medications.map(med => (
                              <div key={med.id} className="bg-[#081b1b] rounded-[2.5rem] p-8 border border-teal-900/30 group relative">
                                  <div className="flex justify-between items-start mb-8">
                                      <div className="flex items-center gap-5">
                                          <div className={`w-16 h-16 bg-[#040d0d] border border-teal-900/50 rounded-3xl flex items-center justify-center text-teal-400`}>
                                              <i className={`fa-solid ${med.form === 'Pill' ? 'fa-capsules' : 'fa-prescription-bottle'} text-2xl`}></i>
                                          </div>
                                          <div>
                                              <h4 className="font-black text-2xl brand-font text-white">{med.medication}</h4>
                                              <p className="text-[9px] font-black text-teal-900 uppercase tracking-[0.3em] mt-1">{med.dosage} • {med.pills_remaining} units</p>
                                          </div>
                                      </div>
                                      <button onClick={() => setMedications(m => m.filter(x => x.id !== med.id))} className="text-teal-900 hover:text-red-500 transition-colors"><i className="fa-solid fa-trash-can text-sm"></i></button>
                                  </div>
                                  <div className="grid grid-cols-3 gap-4">
                                      {med.times.map(time => {
                                          const taken = med.adherenceLog[`${new Date().toISOString().split('T')[0]}_${time}`];
                                          return (
                                              <button key={time} onClick={() => toggleAdherence(med.id, time)}
                                                  className={`py-4 rounded-2xl text-[10px] font-black tracking-[0.2em] border transition-all ${taken ? 'bg-teal-500 border-teal-400 text-white shadow-lg' : 'bg-[#040d0d] border-teal-900/50 text-teal-950'}`}>
                                                  {time}
                                              </button>
                                          );
                                      })}
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
              </div>
            </div>
          )}

          {view === 'settings' && (
              <div className="animate-in fade-in duration-500">
                  <BackButton />
                  <h2 className="text-4xl font-black brand-font mb-4 text-white">System Config</h2>
                  <p className="text-teal-900 font-bold uppercase tracking-widest text-[9px] mb-12">Global Threshold Parameters</p>
                  <div className="space-y-10">
                      <section className="space-y-6">
                          <h4 className="text-[10px] font-black text-teal-400 uppercase tracking-[0.5em] ml-4">Biometric Escallation</h4>
                          <div className="bg-[#081b1b] p-8 rounded-[3.5rem] border border-teal-900/30 space-y-6">
                            <div className="space-y-3">
                              <label className="text-[9px] font-black text-teal-950 uppercase tracking-[0.3em] ml-1">Kin Target (SMS)</label>
                              <div className="grid grid-cols-1 gap-4">
                                <input placeholder="Kin Name" className="w-full bg-[#040d0d] p-5 rounded-2xl border border-teal-900/50 text-sm font-bold text-teal-100" value={user.kinName} onChange={e => setUser({...user, kinName: e.target.value})} />
                                <input placeholder="Kin Phone" className="w-full bg-[#040d0d] p-5 rounded-2xl border border-teal-900/50 text-sm font-bold text-teal-100" value={user.kinPhone} onChange={e => setUser({...user, kinPhone: e.target.value})} />
                              </div>
                            </div>
                            <div className="space-y-3">
                              <label className="text-[9px] font-black text-teal-950 uppercase tracking-[0.3em] ml-1">Physician Node</label>
                              <div className="grid grid-cols-1 gap-4">
                                <input placeholder="Doctor Name" className="w-full bg-[#040d0d] p-5 rounded-2xl border border-teal-900/50 text-sm font-bold text-teal-100" value={user.doctorName} onChange={e => setUser({...user, doctorName: e.target.value})} />
                                <input placeholder="Doctor Phone" className="w-full bg-[#040d0d] p-5 rounded-2xl border border-teal-900/50 text-sm font-bold text-teal-100" value={user.doctorPhone} onChange={e => setUser({...user, doctorPhone: e.target.value})} />
                              </div>
                            </div>
                          </div>
                      </section>

                      <section className="space-y-6">
                          <h4 className="text-[10px] font-black text-teal-400 uppercase tracking-[0.5em] ml-4">Audio Profiles</h4>
                          <div className="bg-[#081b1b] p-10 rounded-[3.5rem] border border-teal-900/30 space-y-8">
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col">
                                  <span className="text-sm font-black brand-font text-white uppercase tracking-wider">Retry Delta</span>
                                  <span className="text-[9px] text-teal-900 font-black uppercase tracking-widest mt-1">Snooze time</span>
                                </div>
                                <select value={user.snoozeTime} onChange={e => setUser({...user, snoozeTime: parseInt(e.target.value)})} className="bg-[#040d0d] p-4 rounded-2xl border border-teal-900/50 text-xs font-black text-teal-400 outline-none">
                                    <option value={5}>5 MIN</option>
                                    <option value={10}>10 MIN</option>
                                    <option value={15}>15 MIN</option>
                                </select>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col">
                                  <span className="text-sm font-black brand-font text-white uppercase tracking-wider">Sonic Profile</span>
                                  <span className="text-[9px] text-teal-900 font-black uppercase tracking-widest mt-1">Alert tone</span>
                                </div>
                                <select value={user.alertTone} onChange={e => setUser({...user, alertTone: e.target.value})} className="bg-[#040d0d] p-4 rounded-2xl border border-teal-900/50 text-xs font-black text-teal-400 outline-none">
                                    <option>Midnight Mint Pulse</option>
                                    <option>Clinical Siren</option>
                                    <option>Bionic Ping</option>
                                </select>
                            </div>
                          </div>
                      </section>
                  </div>
              </div>
          )}

          {view === 'verify' && (
              <div className="space-y-10 animate-in slide-in-from-bottom-10 duration-700">
                  <h2 className="text-4xl font-black brand-font text-white">Logic Registry</h2>
                  <p className="text-teal-900 font-bold uppercase tracking-widest text-[9px] mb-8">AI extraction verification loop</p>
                  <div className="space-y-8">
                      {pendingMeds.map((med, idx) => (
                          <div key={idx} className="bg-[#081b1b] p-10 rounded-[3.5rem] border-2 border-teal-400/30 shadow-2xl">
                              <input className="w-full bg-transparent text-3xl font-black brand-font outline-none border-b-2 border-teal-900/30 pb-4 mb-8 focus:border-teal-400 text-white" value={med.medication} onChange={e => {
                                  const next = [...pendingMeds];
                                  next[idx].medication = e.target.value;
                                  setPendingMeds(next);
                              }} />
                              <div className="grid grid-cols-2 gap-8">
                                  <div><label className="text-[9px] font-black text-teal-950 uppercase tracking-[0.4em] block mb-3 ml-1">Dose Node</label><input className="bg-[#040d0d] p-5 rounded-2xl w-full border border-teal-900/50 text-sm font-bold text-teal-400" value={med.dosage} /></div>
                                  <div><label className="text-[9px] font-black text-teal-950 uppercase tracking-[0.4em] block mb-3 ml-1">Entity Form</label><input className="bg-[#040d0d] p-5 rounded-2xl w-full border border-teal-900/50 text-sm font-bold text-teal-400" value={med.form} /></div>
                              </div>
                          </div>
                      ))}
                  </div>
                  <button onClick={() => { setMedications([...medications, ...pendingMeds]); setPendingMeds([]); setView('dashboard'); }} className={`w-full bg-gradient-to-r ${ACCENT_GRADIENT} p-8 rounded-[3rem] font-black brand-font shadow-2xl uppercase tracking-[0.4em] text-xs text-white`}>Sync Node All</button>
              </div>
          )}
        </main>

        {/* Dynamic Navigation */}
        {view === 'dashboard' && (
          <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#040d0d]/90 backdrop-blur-3xl border-t border-teal-950/20 px-12 py-10 flex justify-around items-center z-[110]">
            <button onClick={() => setView('dashboard')} className="text-teal-400 flex flex-col items-center gap-2 active:scale-95 transition-all">
              <i className="fa-solid fa-microchip text-xl"></i>
              <span className="text-[10px] font-black brand-font uppercase tracking-widest">Node</span>
            </button>
            <div className="relative -top-16">
              <button onClick={() => setView('scanner')} className={`w-24 h-24 bg-gradient-to-br ${ACCENT_GRADIENT} text-white rounded-[2.5rem] flex items-center justify-center shadow-[0_40px_80px_rgba(20,184,166,0.25)] border-[12px] border-[#040d0d] active:scale-90 transition-all`}>
                <i className="fa-solid fa-expand text-4xl"></i>
              </button>
            </div>
            <button onClick={() => setView('report')} className="text-teal-950 flex flex-col items-center gap-2 active:scale-95 transition-all hover:text-teal-400">
              <i className="fa-solid fa-chart-line text-xl"></i>
              <span className="text-[10px] font-black brand-font uppercase tracking-widest">Feed</span>
            </button>
          </nav>
        )}

        {view === 'scanner' && <Scanner onScan={handleScan} onCancel={() => setView('dashboard')} />}

        {isLoading && (
          <div className="fixed inset-0 bg-[#040d0d]/95 backdrop-blur-3xl z-[300] flex flex-col items-center justify-center text-white">
            <div className="relative w-40 h-40 mb-10">
                <div className="absolute inset-0 border-4 border-teal-500/10 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <i className="fa-solid fa-waveform text-5xl text-teal-400 animate-pulse"></i>
                </div>
            </div>
            <h3 className="text-3xl font-black brand-font tracking-tight text-white">Parsing Neural Data</h3>
            <p className="text-teal-900 text-[10px] font-black uppercase tracking-[0.5em] mt-4">Extracting Syntax Nodes</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
