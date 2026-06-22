import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Drama, ShieldAlert, Loader2 } from "lucide-react";

import { Character, QuizAttempt } from "./types";
import {
  listCharacters,
  listAttempts,
  addCharacter,
  updateCharacter,
  deleteCharacter,
  addAttempt,
} from "./lib/db";
import { isAdminLoggedIn, adminLogout } from "./lib/auth";

import LoginScreen from "./components/LoginScreen";
import Sidebar from "./components/Sidebar";
import StudyMode from "./components/StudyMode";
import QuizMode from "./components/QuizMode";
import QuizResults from "./components/QuizResults";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  // Sesión / enrutamiento
  const [userRole, setUserRole] = useState<"guest" | "actor" | "admin">("guest");
  const [bootLoading, setBootLoading] = useState<boolean>(true);

  // Estado del administrador (cargado desde la base de datos)
  const [characters, setCharacters] = useState<Character[]>([]);
  const [quizHistory, setQuizHistory] = useState<QuizAttempt[]>([]);

  // Estado del actor
  const [actorCharacter, setActorCharacter] = useState<Character | null>(null);
  const [actorName, setActorName] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("ficha");
  const [currentAttempt, setCurrentAttempt] = useState<QuizAttempt | null>(null);

  // Una vez dentro del área de preguntas, no se puede volver a estudiar.
  const [quizLocked, setQuizLocked] = useState<boolean>(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Al arrancar: ¿hay sesión de administrador activa?
  useEffect(() => {
    (async () => {
      try {
        if (await isAdminLoggedIn()) {
          await loadAdminData();
          setUserRole("admin");
          setActiveTab("personajes");
        }
      } catch (e) {
        console.error("Error al restaurar sesión", e);
      } finally {
        setBootLoading(false);
      }
    })();
  }, []);

  const loadAdminData = async () => {
    const [chars, attempts] = await Promise.all([listCharacters(), listAttempts()]);
    setCharacters(chars);
    setQuizHistory(attempts);
  };

  // ----- Autenticación -----

  const handleActorAuthenticated = (character: Character, name: string) => {
    setActorCharacter(character);
    setActorName(name);
    setUserRole("actor");
    setActiveTab("ficha");
    setQuizLocked(false);
    setCurrentAttempt(null);
  };

  const handleAdminAuthenticated = async () => {
    await loadAdminData();
    setUserRole("admin");
    setActiveTab("personajes");
  };

  const handleLogout = async () => {
    if (userRole === "admin") {
      await adminLogout();
    }
    setUserRole("guest");
    setActorCharacter(null);
    setActorName("");
    setCurrentAttempt(null);
    setQuizLocked(false);
    setIsMobileMenuOpen(false);
  };

  // ----- Acciones del administrador (persistencia) -----

  const handleAddCharacter = async (newChar: Character) => {
    try {
      await addCharacter(newChar);
      setCharacters((prev) => [newChar, ...prev]);
    } catch (e) {
      console.error(e);
      alert("No se pudo guardar el personaje. Revisa tu conexión con Supabase.");
    }
  };

  const handleUpdateCharacter = async (updated: Character) => {
    try {
      await updateCharacter(updated);
      setCharacters((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    } catch (e) {
      console.error(e);
      alert("No se pudo actualizar el personaje.");
    }
  };

  const handleDeleteCharacter = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este personaje y todo su libreto de estudio?"))
      return;
    try {
      await deleteCharacter(id);
      setCharacters((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      console.error(e);
      alert("No se pudo eliminar el personaje.");
    }
  };

  // ----- Flujo del quiz (autocalificación) -----

  const handleStartQuiz = () => {
    // Al entrar al área de preguntas se bloquea el regreso al estudio.
    setQuizLocked(true);
    setCurrentAttempt(null);
    setActiveTab("quiz");
  };

  const handleQuizFinished = async (attempt: QuizAttempt) => {
    try {
      await addAttempt(attempt);
    } catch (e) {
      console.error("No se pudo registrar el intento", e);
    }
    setQuizHistory((prev) => [...prev, attempt]);
    setCurrentAttempt(attempt);
    setActiveTab("resultado");
  };

  if (bootLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#faf9f5] text-stone-500 gap-3">
        <Loader2 className="w-7 h-7 animate-spin text-theatre-maroon" />
        <span className="text-xs font-mono uppercase tracking-widest">Preparando el escenario…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f5]">
      {userRole === "guest" ? (
        <LoginScreen
          onActorAuthenticated={handleActorAuthenticated}
          onAdminAuthenticated={handleAdminAuthenticated}
        />
      ) : (
        <div className="flex-1 flex flex-col md:flex-row">
          {/* Encabezado móvil */}
          <header className="md:hidden bg-stone-950 text-white flex items-center justify-between p-4 border-b border-stone-800">
            <div className="flex items-center gap-2">
              <Drama className="w-5 h-5 text-theatre-gold" />
              <span className="font-serif text-sm font-semibold tracking-tight text-stone-100">
                Método<span className="text-theatre-gold">Actor</span>
              </span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1 px-1.5 bg-stone-900 border border-stone-800 rounded"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-stone-300" />
              ) : (
                <Menu className="w-5 h-5 text-stone-300" />
              )}
            </button>
          </header>

          {/* Drawer móvil */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-stone-900 border-b border-stone-800 relative z-20 flex flex-col"
              >
                <div className="p-2.5">
                  <Sidebar
                    role={userRole}
                    activeTab={activeTab}
                    setActiveTab={(tab) => {
                      setActiveTab(tab);
                      setIsMobileMenuOpen(false);
                    }}
                    assignedCharacter={actorCharacter ?? undefined}
                    actorName={actorName}
                    quizLocked={quizLocked}
                    onLogout={handleLogout}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sidebar de escritorio */}
          <div className="hidden md:flex">
            <Sidebar
              role={userRole}
              activeTab={activeTab === "resultado" ? "quiz" : activeTab}
              setActiveTab={setActiveTab}
              assignedCharacter={actorCharacter ?? undefined}
              actorName={actorName}
              quizLocked={quizLocked}
              onLogout={handleLogout}
            />
          </div>

          {/* Contenido principal */}
          <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full transition-all">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="min-h-full flex flex-col"
              >
                {/* 1. FLUJOS DEL ACTOR */}
                {userRole === "actor" && (
                  <>
                    {!actorCharacter ? (
                      <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center max-w-md mx-auto my-12">
                        <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h3 className="font-serif text-lg font-bold">Personaje no disponible</h3>
                        <p className="text-xs text-stone-500 font-light mt-1 mb-6">
                          El personaje asociado a esta sesión ya no está disponible. Vuelve a la entrada e ingresa el nombre exacto proporcionado por tu director.
                        </p>
                        <button
                          onClick={handleLogout}
                          className="px-4 py-2 bg-stone-900 text-white rounded text-xs uppercase tracking-widest font-mono"
                        >
                          Ir a la entrada
                        </button>
                      </div>
                    ) : (
                      <>
                        {(activeTab === "ficha" || activeTab === "estudio") && !quizLocked && (
                          <StudyMode character={actorCharacter} onStartQuiz={handleStartQuiz} />
                        )}

                        {activeTab === "quiz" && (
                          <QuizMode
                            character={actorCharacter}
                            actorName={actorName}
                            onQuizFinished={handleQuizFinished}
                          />
                        )}

                        {activeTab === "resultado" && currentAttempt && (
                          <QuizResults
                            attempt={currentAttempt}
                            onRetry={() => {
                              setCurrentAttempt(null);
                              setActiveTab("quiz");
                            }}
                            onExit={handleLogout}
                          />
                        )}
                      </>
                    )}
                  </>
                )}

                {/* 2. FLUJOS DEL ADMINISTRADOR */}
                {userRole === "admin" && (
                  <AdminPanel
                    characters={characters}
                    attempts={quizHistory}
                    onAddCharacter={handleAddCharacter}
                    onUpdateCharacter={handleUpdateCharacter}
                    onDeleteCharacter={handleDeleteCharacter}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      )}
    </div>
  );
}
