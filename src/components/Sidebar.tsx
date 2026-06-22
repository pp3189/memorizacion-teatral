import React from "react";
import {
  Drama,
  BookOpen,
  HelpCircle,
  LogOut,
  PlusCircle,
  BarChart3,
  Settings,
  Users,
  User,
  Lock
} from "lucide-react";
import { Character } from "../types";

interface SidebarProps {
  role: "actor" | "admin";
  activeTab: string;
  setActiveTab: (tab: string) => void;
  assignedCharacter?: Character;
  actorName?: string;
  quizLocked?: boolean;
  onLogout: () => void;
}

export default function Sidebar({
  role,
  activeTab,
  setActiveTab,
  assignedCharacter,
  actorName,
  quizLocked,
  onLogout
}: SidebarProps) {

  // Cuando el actor entra al examen, la navegación de estudio desaparece.
  const actorMenu = quizLocked
    ? [{ id: "quiz", label: "Examen en curso", icon: Lock }]
    : [
        { id: "ficha", label: "Datos del Personaje", icon: BookOpen },
        { id: "estudio", label: "Modo Estudio", icon: HelpCircle },
      ];

  const adminMenu = [
    { id: "personajes", label: "Panel de Dirección", icon: Users },
    { id: "crear-personaje", label: "Cargar Personaje", icon: PlusCircle },
    { id: "progreso-elenco", label: "Progreso del Actor", icon: BarChart3 },
  ];

  const activeMenu = role === "actor" ? actorMenu : adminMenu;

  return (
    <aside className="w-full md:w-64 bg-stone-900 text-stone-100 flex flex-col border-r border-[#2d2522] shadow-2xl shrink-0" id="sidebar-container">
      {/* Brand space */}
      <div className="p-6 border-b border-[#2d2522] bg-[#1a1210] flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-theatre-maroon flex items-center justify-center text-theatre-gold shadow-md">
          <Drama className="w-5 h-5 text-[#fbfaf7]" />
        </div>
        <div>
          <h2 className="font-serif text-lg font-light tracking-tight text-white leading-none">
            Método<span className="text-theatre-gold font-normal">Actor</span>
          </h2>
          <span className="text-[10px] font-mono tracking-widest text-stone-500 uppercase">
            {role === "actor" ? "Estudio de Actor" : "Dirección Escénica"}
          </span>
        </div>
      </div>

      {/* User Session Profile Badge */}
      <div className="p-4 mx-4 my-5 rounded-xl bg-stone-800/60 border border-stone-800 flex flex-col gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-theatre-gold/15 flex items-center justify-center text-theatre-gold border border-theatre-gold/30 shrink-0">
            {role === "actor" ? <User className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-stone-200 truncate leading-tight">
              {role === "actor" ? actorName : "Director / Admin"}
            </p>
            <p className="text-[10px] text-stone-400 truncate">
              {role === "actor" ? "Intérprete Principal" : "Creador de Contenido"}
            </p>
          </div>
        </div>

        {role === "actor" && assignedCharacter && (
          <div className="mt-1 bg-[#1c1614] p-3 rounded-lg border border-[#382a25]">
            <p className="text-[9px] font-mono uppercase tracking-widest text-theatre-gold">
              Personaje Asignado:
            </p>
            <h4 className="text-xs font-serif italic text-stone-100 font-medium truncate mt-0.5">
              {assignedCharacter.nombreCompleto}
            </h4>
            {assignedCharacter.playName && (
              <p className="text-[10px] text-stone-400 italic truncate mt-0.5">
                {assignedCharacter.playName}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Primary Navigation Menu */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        <p className="text-[10px] font-mono uppercase tracking-wider text-stone-500 px-3 py-1 mb-1">
          Navegación
        </p>
        {activeMenu.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-sans transition-all duration-200 text-left ${
                isActive 
                  ? "bg-theatre-maroon text-[#fbfaf7] shadow-md border-r-4 border-theatre-gold" 
                  : "text-stone-400 hover:bg-stone-800/50 hover:text-stone-100"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-theatre-gold" : "text-stone-500"}`} />
              <span className="font-medium text-[13px]">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Quick Role Toggle Option */}
      <div className="p-4 border-t border-[#2d2522] bg-[#1a1210]/40 flex flex-col gap-2">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider text-stone-400 hover:bg-stone-800/40 hover:text-stone-200 transition-all text-left"
        >
          <LogOut className="w-3.5 h-3.5 text-stone-500" />
          <span>Cambiar Rol / Salir</span>
        </button>
      </div>
    </aside>
  );
}
