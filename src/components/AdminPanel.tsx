import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  PlusCircle, 
  BarChart3, 
  Edit3, 
  Trash2, 
  HelpCircle, 
  UserPlus, 
  Plus, 
  X, 
  Database,
  ArrowRight,
  Sparkles,
  ClipboardList,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  Clock,
  UserCheck
} from "lucide-react";
import { Character, QuizAttempt, CustomField, CustomQuestion, FIXED_FIELD_LABELS } from "../types";

interface AdminPanelProps {
  characters: Character[];
  attempts: QuizAttempt[];
  onAddCharacter: (character: Character) => void;
  onUpdateCharacter: (character: Character) => void;
  onDeleteCharacter: (id: string) => void;
}

export default function AdminPanel({
  characters,
  attempts,
  onAddCharacter,
  onUpdateCharacter,
  onDeleteCharacter
}: AdminPanelProps) {
  const [adminTab, setAdminTab] = useState<"lista" | "ficha-form" | "preguntas-form" | "progreso">("lista");
  
  // Selection for editing or managing custom questions
  const [selectedCharId, setSelectedCharId] = useState<string>(characters[0]?.id || "");
  const [editingChar, setEditingChar] = useState<Character | null>(null);

  // Dynamic custom question creator local state
  const [customQText, setCustomQText] = useState<string>("");
  const [customQExpected, setCustomQExpected] = useState<string>("");

  // Character Form Fields state
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [lugarNacimiento, setLugarNacimiento] = useState("");
  const [nombrePadre, setNombrePadre] = useState("");
  const [fechaNacimientoPadre, setFechaNacimientoPadre] = useState("");
  const [nombreMadre, setNombreMadre] = useState("");
  const [fechaNacimientoMadre, setFechaNacimientoMadre] = useState("");
  const [estudios, setEstudios] = useState("");
  const [lugarEstudios, setLugarEstudios] = useState("");
  const [fechaGraduacionSecundaria, setFechaGraduacionSecundaria] = useState("");
  const [fechaGraduacionPreparatoria, setFechaGraduacionPreparatoria] = useState("");
  const [fechaGraduacionUniversidad, setFechaGraduacionUniversidad] = useState("");
  const [direccionCasa, setDireccionCasa] = useState("");
  const [datosAdicionales, setDatosAdicionales] = useState("");
  const [playName, setPlayName] = useState("");
  const [assignedActor, setAssignedActor] = useState("");
  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  // Helpers for supplementary custom properties
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldValue, setNewFieldValue] = useState("");

  const handleAddCustomField = () => {
    if (!newFieldLabel.trim() || !newFieldValue.trim()) return;
    setCustomFields([
      ...customFields,
      { id: `cf-user-${Date.now()}`, label: newFieldLabel.trim(), value: newFieldValue.trim() }
    ]);
    setNewFieldLabel("");
    setNewFieldValue("");
  };

  const handleRemoveCustomField = (id: string) => {
    setCustomFields(customFields.filter(f => f.id !== id));
  };

  // Switch form to "Create Character"
  const prepareCreateForm = () => {
    setEditingChar(null);
    setNombreCompleto("");
    setFechaNacimiento("");
    setLugarNacimiento("");
    setNombrePadre("");
    setFechaNacimientoPadre("");
    setNombreMadre("");
    setFechaNacimientoMadre("");
    setEstudios("");
    setLugarEstudios("");
    setFechaGraduacionSecundaria("");
    setFechaGraduacionPreparatoria("");
    setFechaGraduacionUniversidad("");
    setDireccionCasa("");
    setDatosAdicionales("");
    setPlayName("");
    setAssignedActor("");
    setCustomFields([]);
    setAdminTab("ficha-form");
  };

  // Switch form to "Edit Character"
  const prepareEditForm = (char: Character) => {
    setEditingChar(char);
    setNombreCompleto(char.nombreCompleto);
    setFechaNacimiento(char.fechaNacimiento);
    setLugarNacimiento(char.lugarNacimiento);
    setNombrePadre(char.nombrePadre);
    setFechaNacimientoPadre(char.fechaNacimientoPadre);
    setNombreMadre(char.nombreMadre);
    setFechaNacimientoMadre(char.fechaNacimientoMadre);
    setEstudios(char.estudios);
    setLugarEstudios(char.lugarEstudios);
    setFechaGraduacionSecundaria(char.fechaGraduacionSecundaria);
    setFechaGraduacionPreparatoria(char.fechaGraduacionPreparatoria);
    setFechaGraduacionUniversidad(char.fechaGraduacionUniversidad);
    setDireccionCasa(char.direccionCasa);
    setDatosAdicionales(char.datosAdicionales);
    setPlayName(char.playName || "");
    setAssignedActor(char.assignedActorName || "");
    setCustomFields(char.customFields || []);
    setAdminTab("ficha-form");
  };

  const handleCharacterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreCompleto.trim()) return;

    if (editingChar) {
      // update
      const updated: Character = {
        ...editingChar,
        nombreCompleto: nombreCompleto.trim(),
        fechaNacimiento: fechaNacimiento.trim(),
        lugarNacimiento: lugarNacimiento.trim(),
        nombrePadre: nombrePadre.trim(),
        fechaNacimientoPadre: fechaNacimientoPadre.trim(),
        nombreMadre: nombreMadre.trim(),
        fechaNacimientoMadre: fechaNacimientoMadre.trim(),
        estudios: estudios.trim(),
        lugarEstudios: lugarEstudios.trim(),
        fechaGraduacionSecundaria: fechaGraduacionSecundaria.trim(),
        fechaGraduacionPreparatoria: fechaGraduacionPreparatoria.trim(),
        fechaGraduacionUniversidad: fechaGraduacionUniversidad.trim(),
        direccionCasa: direccionCasa.trim(),
        datosAdicionales: datosAdicionales.trim(),
        playName: playName.trim(),
        assignedActorName: assignedActor.trim(),
        customFields,
      };
      onUpdateCharacter(updated);
    } else {
      // create
      const brandNew: Character = {
        id: `char-${Date.now()}`,
        nombreCompleto: nombreCompleto.trim(),
        fechaNacimiento: fechaNacimiento.trim() || "Sin especificar",
        lugarNacimiento: lugarNacimiento.trim() || "Sin especificar",
        nombrePadre: nombrePadre.trim() || "Sin especificar",
        fechaNacimientoPadre: fechaNacimientoPadre.trim() || "Sin especificar",
        nombreMadre: nombreMadre.trim() || "Sin especificar",
        fechaNacimientoMadre: fechaNacimientoMadre.trim() || "Sin especificar",
        estudios: estudios.trim() || "Sin especificar",
        lugarEstudios: lugarEstudios.trim() || "Sin especificar",
        fechaGraduacionSecundaria: fechaGraduacionSecundaria.trim() || "Sin especificar",
        fechaGraduacionPreparatoria: fechaGraduacionPreparatoria.trim() || "Sin especificar",
        fechaGraduacionUniversidad: fechaGraduacionUniversidad.trim() || "Sin especificar",
        direccionCasa: direccionCasa.trim() || "Sin especificar",
        datosAdicionales: datosAdicionales.trim(),
        playName: playName.trim() || "Obra Teatral General",
        assignedActorName: assignedActor.trim() || "Sin asignar",
        customFields,
        customQuestions: [],
        createdAt: new Date().toISOString()
      };
      onAddCharacter(brandNew);
      // set active selection for question editing convenience
      setSelectedCharId(brandNew.id);
    }

    setAdminTab("lista");
  };

  // Add Custom Questions
  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQText.trim() || !customQExpected.trim()) return;

    const char = characters.find(c => c.id === selectedCharId);
    if (!char) return;

    const newQ: CustomQuestion = {
      id: `q-cust-${Date.now()}`,
      questionText: customQText.trim(),
      expectedAnswer: customQExpected.trim(),
      associatedField: "datosAdicionales"
    };

    const updated: Character = {
      ...char,
      customQuestions: [...(char.customQuestions || []), newQ]
    };

    onUpdateCharacter(updated);
    setCustomQText("");
    setCustomQExpected("");
  };

  const handleRemoveQuestion = (charId: string, qId: string) => {
    const char = characters.find(c => c.id === charId);
    if (!char) return;

    const updated: Character = {
      ...char,
      customQuestions: char.customQuestions.filter(q => q.id !== qId)
    };

    onUpdateCharacter(updated);
  };

  // METRICS FOR PROGRESS DASHBOARD:
  // 1. Total Quizzes done
  const totalQuizzes = attempts.length;

  // 2. Average accuracy score (%)
  const avgScore = totalQuizzes 
    ? Math.round(attempts.reduce((acc, curr) => acc + curr.percentageScore, 0) / totalQuizzes) 
    : 0;

  // 3. Questions that actors fail the most (Preguntas que más falla)
  const questionFailures: Record<string, { text: string; count: number; charName: string; fieldName: string }> = {};
  attempts.forEach((att) => {
    att.questionsLog.forEach((log) => {
      if (!log.isCorrect) {
        // use questionText as unique target
        const key = `${att.characterId}-${log.questionText}`;
        if (!questionFailures[key]) {
          questionFailures[key] = {
            text: log.questionText,
            count: 0,
            charName: att.characterName,
            fieldName: log.fieldName
          };
        }
        questionFailures[key].count += 1;
      }
    });
  });

  // Sort failing questions by descending count
  const sortedFailuresList = Object.values(questionFailures)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const activeCharForQuestions = characters.find(c => c.id === selectedCharId);

  return (
    <div className="space-y-6">
      
      {/* Top Banner admin */}
      <div className="bg-[#120d0c] text-stone-100 p-6 md:p-8 rounded-2xl border border-stone-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-theatre-maroon/20 blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <span className="text-[10px] font-mono tracking-widest text-[#d97706] uppercase border border-[#d97706]/40 px-2 py-0.5 rounded bg-theatre-gold/5">
            Mesa de Trabajo del Director
          </span>
          <h1 className="font-serif text-3xl font-light tracking-tight text-white mt-3">
            Gestión & <span className="font-semibold text-theatre-gold italic">Control Escénico</span>
          </h1>
          <p className="text-xs md:text-sm text-stone-400 font-light mt-1 max-w-xl">
            Edita fichas dramáticas, asigna papeles, diseña cuestionarios biográficos para estudiar personajes y monitorea el avance del elenco en su curva de retención mental.
          </p>
        </div>

        <button
          onClick={prepareCreateForm}
          className="relative z-10 px-4.5 py-2.5 bg-theatre-maroon hover:bg-[#8f1e1e] active:bg-[#661414] text-white rounded-lg text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 font-bold shadow-lg"
        >
          <PlusCircle className="w-4 h-4 text-theatre-gold animate-pulse" />
          <span>Cargar Ficha Nueva</span>
        </button>
      </div>

      {/* Admin SubNavigation */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-px">
        <button
          onClick={() => setAdminTab("lista")}
          className={`px-4 py-2.5 font-serif text-sm border-b-2 font-medium transition-all flex items-center gap-2 ${
            adminTab === "lista"
              ? "border-theatre-maroon text-theatre-maroon font-semibold"
              : "border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          <Users className="w-4.5 h-4.5" />
          Elenco & Personajes ({characters.length})
        </button>
        <button
          onClick={() => {
            if (characters.length > 0) {
              if (!selectedCharId) setSelectedCharId(characters[0].id);
              setAdminTab("preguntas-form");
            }
          }}
          disabled={characters.length === 0}
          className={`px-4 py-2.5 font-serif text-sm border-b-2 font-medium transition-all flex items-center gap-2 ${
            characters.length === 0 ? "opacity-40 cursor-not-allowed" : ""
          } ${
            adminTab === "preguntas-form"
              ? "border-theatre-maroon text-theatre-maroon font-semibold"
              : "border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          <HelpCircle className="w-4.5 h-4.5" />
          Banco de Preguntas
        </button>
        <button
          onClick={() => setAdminTab("progreso")}
          className={`px-4 py-2.5 font-serif text-sm border-b-2 font-medium transition-all flex items-center gap-2 ${
            adminTab === "progreso"
              ? "border-theatre-maroon text-theatre-maroon font-semibold"
              : "border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          <BarChart3 className="w-4.5 h-4.5" />
          Progreso del Actor (Evaluación)
        </button>
      </div>

      <AnimatePresence mode="wait">
        
        {/* TAB 1: Characters List */}
        {adminTab === "lista" && (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {characters.length === 0 ? (
              <div className="bg-white col-span-2 p-12 text-center rounded-2xl border border-stone-200">
                <Database className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                <h3 className="font-serif text-xl font-light mb-1 text-stone-800">No hay personajes cargados</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
                  Usa el botón superior para precargar la biografía obligatoria del primer personaje del elenco.
                </p>
                <button
                  onClick={prepareCreateForm}
                  className="px-4 py-2 bg-theatre-maroon text-[#fbfaf7] rounded-lg text-xs font-mono uppercase tracking-widest"
                >
                  Cargar Primer Ficha
                </button>
              </div>
            ) : (
              characters.map((char) => (
                <div 
                  key={char.id}
                  className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Header bar */}
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div>
                        {char.playName && (
                          <span className="text-[9px] font-mono tracking-widest text-[#d97706] uppercase inline-block bg-amber-50 px-2 py-0.5 rounded mb-1">
                            {char.playName}
                          </span>
                        )}
                        <h3 className="font-serif text-xl font-semibold text-stone-900 leading-tight">
                          {char.nombreCompleto}
                        </h3>
                      </div>
                      
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => prepareEditForm(char)}
                          title="Editar biografía"
                          className="p-1 px-2 hover:bg-stone-100 text-stone-600 rounded border border-stone-200 transition-all flex items-center gap-1 text-[11px]"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => onDeleteCharacter(char.id)}
                          title="Eliminar personaje"
                          className="p-1 px-1.5 hover:bg-red-50 text-red-600 rounded border border-red-150 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Meta description */}
                    <p className="text-xs text-stone-400 font-light italic leading-relaxed line-clamp-2 border-l-2 border-stone-150 pl-3.5 my-3">
                      "{char.datosAdicionales || "Sin comentarios."}"
                    </p>

                    {/* Quick facts metrics */}
                    <div className="mt-4 grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-150 text-xs">
                      <div>
                        <span className="block text-[8px] font-mono text-stone-400 uppercase">Actor asignado:</span>
                        <div className="flex items-center gap-1 mt-0.5 text-stone-800 font-semibold">
                          <UserPlus className="w-3.5 h-3.5 text-theatre-maroon" />
                          <span>{char.assignedActorName || "Sin asignar"}</span>
                        </div>
                      </div>
                      <div>
                        <span className="block text-[8px] font-mono text-stone-400 uppercase">Preguntas personalizadas:</span>
                        <div className="flex items-center gap-1 mt-0.5 text-stone-800 font-semibold">
                          <HelpCircle className="w-3.5 h-3.5 text-stone-500" />
                          <span>{char.customQuestions?.length || 0} cargadas</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-stone-100 flex justify-between gap-2 items-center">
                    <span className="text-[10px] font-mono text-stone-400">
                      ID: {char.id}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedCharId(char.id);
                        setAdminTab("preguntas-form");
                      }}
                      className="text-xs font-mono text-theatre-maroon hover:text-[#991b1b] flex items-center gap-1 hover:underline font-semibold"
                    >
                      <span>Preguntas del Quiz</span>
                      <ArrowRight className="w-3.5 h-3.5 text-theatre-gold" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}

        {/* TAB 2: Add/Edit Character Form */}
        {adminTab === "ficha-form" && (
          <motion.div
            key="ficha-form"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-white rounded-2xl border border-stone-200/95 shadow-md p-6 md:p-8"
          >
            {/* Form Header */}
            <div className="pb-4 border-b border-stone-200 mb-6 flex justify-between items-center">
              <div>
                <h3 className="font-serif text-xl font-semibold text-stone-900">
                  {editingChar ? "Editar Ficha de Personaje" : "Crear Nueva Ficha Biográfica"}
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Ingresa todos los campos requeridos para que el actor tenga suficiente material que memorizar.
                </p>
              </div>
              
              <button
                type="button"
                onClick={() => setAdminTab("lista")}
                className="p-1.5 hover:bg-stone-100 text-stone-500 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCharacterSubmit} className="space-y-6">
              
              {/* Play context settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-theatre-maroon/5 border border-theatre-maroon/15 rounded-xl">
                <div className="md:col-span-1">
                  <label className="block text-xs font-mono uppercase tracking-wide text-stone-600 mb-1">
                    Obra Dramática (Libreto)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Hamlet"
                    value={playName}
                    onChange={(e) => setPlayName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm bg-white outline-none focus:ring-2 focus:ring-theatre-maroon/20"
                  />
                </div>
                
                <div className="md:col-span-1">
                  <label className="block text-xs font-mono uppercase tracking-wide text-stone-600 mb-1">
                    Nombre Completo del Personaje
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Hamlet de Dinamarca"
                    value={nombreCompleto}
                    onChange={(e) => setNombreCompleto(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm bg-white outline-none focus:ring-2 focus:ring-theatre-maroon/20"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block text-xs font-mono uppercase tracking-wide text-stone-600 mb-1">
                    Actor / Actriz Asignado(a)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Sofía Martín"
                    value={assignedActor}
                    onChange={(e) => setAssignedActor(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm bg-white outline-none focus:ring-2 focus:ring-theatre-maroon/20"
                  />
                </div>
              </div>

              {/* Grid section 1: Birth profile */}
              <div>
                <h4 className="font-serif text-sm font-semibold text-[#1e1b18] mb-3 pb-1 border-b border-stone-100 flex items-center gap-1.5 uppercase tracking-wide">
                  <span>1. Perfil de Nacimiento</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-stone-500 mb-1">Fecha de nacimiento</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. 15 de Mayo de 1599"
                      value={fechaNacimiento}
                      onChange={(e) => setFechaNacimiento(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs bg-stone-50/50 outline-none focus:bg-white focus:ring-1 focus:ring-theatre-maroon"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-stone-500 mb-1">Lugar de nacimiento</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Castillo de Elsinor, Dinamarca"
                      value={lugarNacimiento}
                      onChange={(e) => setLugarNacimiento(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs bg-stone-50/50 outline-none focus:bg-white focus:ring-1 focus:ring-theatre-maroon"
                    />
                  </div>
                </div>
              </div>

              {/* Grid section 2: Parents */}
              <div>
                <h4 className="font-serif text-sm font-semibold text-[#1e1b18] mb-3 pb-1 border-b border-stone-100 flex items-center gap-1.5 uppercase tracking-wide">
                  <span>2. Vínculos de Sangre (Padre y Madre)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-stone-500 mb-1">Nombre del padre</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Rey Hamlet"
                      value={nombrePadre}
                      onChange={(e) => setNombrePadre(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs bg-stone-50/50 outline-none focus:bg-white focus:ring-1 focus:ring-theatre-maroon"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-stone-500 mb-1">Fecha de nacimiento del padre</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. 04 de Agosto de 1560"
                      value={fechaNacimientoPadre}
                      onChange={(e) => setFechaNacimientoPadre(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs bg-stone-50/50 outline-none focus:bg-white focus:ring-1 focus:ring-theatre-maroon"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-stone-500 mb-1">Nombre de la madre</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Reina Gertrudis"
                      value={nombreMadre}
                      onChange={(e) => setNombreMadre(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs bg-stone-50/50 outline-none focus:bg-white focus:ring-1 focus:ring-theatre-maroon"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-stone-500 mb-1">Fecha de nacimiento de la madre</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. 12 de Diciembre de 1568"
                      value={fechaNacimientoMadre}
                      onChange={(e) => setFechaNacimientoMadre(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs bg-stone-50/50 outline-none focus:bg-white focus:ring-1 focus:ring-theatre-maroon"
                    />
                  </div>
                </div>
              </div>

              {/* Grid section 3: Academic/Studies */}
              <div>
                <h4 className="font-serif text-sm font-semibold text-[#1e1b18] mb-3 pb-1 border-b border-stone-100 flex items-center gap-1.5 uppercase tracking-wide">
                  <span>3. Historial de Estudios</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-stone-500 mb-1">Formación / Profesión (Estudios)</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Filosofía del Humanismo y Teología"
                      value={estudios}
                      onChange={(e) => setEstudios(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs bg-stone-50/50 outline-none focus:bg-white focus:ring-1 focus:ring-theatre-maroon"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-stone-500 mb-1">Lugar de estudios</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Universidad de Wittenberg, Alemania"
                      value={lugarEstudios}
                      onChange={(e) => setLugarEstudios(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs bg-stone-50/50 outline-none focus:bg-white focus:ring-1 focus:ring-theatre-maroon"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-stone-500 mb-1">Fecha de graduación de secundaria</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. 18 de Junio de 1614"
                      value={fechaGraduacionSecundaria}
                      onChange={(e) => setFechaGraduacionSecundaria(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs bg-stone-50/50 outline-none focus:bg-white focus:ring-1 focus:ring-theatre-maroon"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-stone-500 mb-1">Fecha de graduación de preparatoria</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. 22 de Junio de 1617"
                      value={fechaGraduacionPreparatoria}
                      onChange={(e) => setFechaGraduacionPreparatoria(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs bg-stone-50/50 outline-none focus:bg-white focus:ring-1 focus:ring-theatre-maroon"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono text-stone-500 mb-1">Fecha de graduación de universidad</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Inconclusa / Fecha exacta de Tesis"
                      value={fechaGraduacionUniversidad}
                      onChange={(e) => setFechaGraduacionUniversidad(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs bg-stone-50/50 outline-none focus:bg-white focus:ring-1 focus:ring-theatre-maroon"
                    />
                  </div>
                </div>
              </div>

              {/* Grid section 4: Domicilio */}
              <div>
                <h4 className="font-serif text-sm font-semibold text-[#1e1b18] mb-3 pb-1 border-b border-stone-100 flex items-center gap-1.5 uppercase tracking-wide">
                  <span>4. Domicilio</span>
                </h4>
                <div>
                  <label className="block text-xs font-mono text-stone-500 mb-1">Dirección de casa</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Ala Norte, Torre de los Tapices, Castillo de Elsinor"
                    value={direccionCasa}
                    onChange={(e) => setDireccionCasa(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs bg-stone-50/50 outline-none focus:bg-white focus:ring-1 focus:ring-theatre-maroon"
                  />
                </div>
              </div>

              {/* Supplementary Custom fields area */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                <h4 className="font-serif text-sm font-semibold text-[#1e1b18] mb-2 flex items-center gap-1">
                  <PlusCircle className="w-4 h-4 text-theatre-gold" />
                  Agregar Datos Adicionales Personalizados (Clave-Valor)
                </h4>
                <p className="text-[11px] text-stone-500 mb-4 leading-none">
                  Puedes inventar campos libres de biografía, como "Secreto", "Color de ojos" o "Talento especial".
                </p>

                {/* Grid inputs for adding */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end mb-4">
                  <div className="sm:col-span-1">
                    <label className="block text-[10px] font-mono uppercase text-stone-500 mb-1">Título del campo</label>
                    <input
                      type="text"
                      placeholder="Ej. Fobia Principal"
                      value={newFieldLabel}
                      onChange={(e) => setNewFieldLabel(e.target.value)}
                      className="w-full px-3 py-1.5 rounded border border-stone-200 text-xs bg-white"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-[10px] font-mono uppercase text-stone-500 mb-1">Valor biográfico</label>
                    <input
                      type="text"
                      placeholder="Ej. Clostrofobia extrema"
                      value={newFieldValue}
                      onChange={(e) => setNewFieldValue(e.target.value)}
                      className="w-full px-3 py-1.5 rounded border border-stone-200 text-xs bg-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCustomField}
                    className="p-1.5 px-3 bg-stone-800 hover:bg-stone-900 text-stone-100 rounded text-xs font-mono uppercase font-semibold flex items-center gap-1 leading-normal"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Añadir campo
                  </button>
                </div>

                {/* Render listed additions */}
                {customFields.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-stone-200/60">
                    <span className="block text-[9px] font-mono uppercase tracking-wider text-stone-400">Campos Adicionales Activos:</span>
                    <div className="flex flex-wrap gap-2">
                      {customFields.map((cf) => (
                        <div key={cf.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#eee9dc] border border-[#d8d0bd] text-stone-800 text-xs font-medium">
                          <span className="font-mono text-stone-500 text-[10px]">{cf.label}:</span>
                          <span className="font-serif italic">{cf.value}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveCustomField(cf.id)}
                            className="text-stone-400 hover:text-red-700 font-bold ml-1 text-[10px]"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Free format description block */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wide text-stone-650 mb-1">
                  Datos adicionales del personaje (Descripción psicológica / Acotación de contexto)
                </label>
                <textarea
                  rows={4}
                  placeholder="Detalla acotaciones secundarias, notas sobre el luto de Bernarda, miedos inconscientes, aflicciones físicas..."
                  value={datosAdicionales}
                  onChange={(e) => setDatosAdicionales(e.target.value)}
                  className="w-full p-3 rounded-lg border border-stone-200 text-sm bg-stone-50/50 outline-none focus:bg-white focus:ring-2 focus:ring-theatre-maroon/20 font-serif"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end border-t border-stone-250 pt-5">
                <button
                  type="button"
                  onClick={() => setAdminTab("lista")}
                  className="py-2.5 px-5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-mono uppercase tracking-wider transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-lg bg-theatre-maroon hover:bg-[#8f1e1e] text-white text-xs font-mono uppercase tracking-wider transition-all font-semibold shadow-md inline-flex items-center gap-1"
                >
                  <Database className="w-3.5 h-3.5 text-theatre-gold" />
                  <span>{editingChar ? "Guardar Modificaciones" : "Registrar Personaje"}</span>
                </button>
              </div>

            </form>
          </motion.div>
        )}

        {/* TAB 3: Questions Designer Panel */}
        {adminTab === "preguntas-form" && (
          <motion.div
            key="preguntas-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Left side selector */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 h-fit">
              <label className="block text-xs font-mono uppercase tracking-wider text-stone-400 mb-2">
                Selecciona Personaje para Diseñar Cuestionario:
              </label>
              <div className="space-y-1.5">
                {characters.map((char) => (
                  <button
                    key={char.id}
                    onClick={() => setSelectedCharId(char.id)}
                    className={`w-full p-2.5 rounded-lg text-xs font-serif font-medium text-left transition-all flex items-center justify-between border ${
                      selectedCharId === char.id 
                        ? "bg-theatre-maroon text-[#fbfaf7] border-theatre-maroon shadow" 
                        : "bg-stone-50/50 hover:bg-stone-100 text-stone-700 border-stone-200"
                    }`}
                  >
                    <span className="truncate">{char.nombreCompleto}</span>
                    <span className="font-mono text-[9px] bg-white/20 px-1.5 py-0.5 rounded leading-none">
                      {char.customQuestions?.length || 0}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right side designer */}
            <div className="md:col-span-2 space-y-6">
              
              {activeCharForQuestions ? (
                <>
                  {/* Create Question Box */}
                  <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                    <h3 className="font-serif text-lg font-semibold text-stone-900 mb-1 flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-theatre-maroon" />
                      Diseñar Pregunta para: <span className="text-theatre-maroon italic">{activeCharForQuestions.nombreCompleto}</span>
                    </h3>
                    <p className="text-xs text-stone-500 font-light mb-5">
                      Agrega preguntas personalizadas libres relacionadas con detalles específicos de su biografía o motivaciones ocultas.
                    </p>

                    <form onSubmit={handleAddQuestion} className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-stone-400 mb-1">Enunciado de la Pregunta:</label>
                        <input
                          type="text"
                          required
                          placeholder="Ej. ¿Quién fue el primer amor de Hamlet?"
                          value={customQText}
                          onChange={(e) => setCustomQText(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-stone-400 mb-1">Respuesta Esperada en Texto (Memorizable):</label>
                        <input
                          type="text"
                          required
                          placeholder="Ej. Ofelia"
                          value={customQExpected}
                          onChange={(e) => setCustomQExpected(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs"
                        />
                        <span className="text-[10px] font-mono text-amber-600 block mt-1 leading-none">
                          * Nota: Debe coincidir literalmente con datos existentes o respuestas cortas memorizables de libreto.
                        </span>
                      </div>
                      
                      <div className="pt-2 flex justify-end">
                        <button
                          type="submit"
                          className="py-1.5 px-4 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded text-xs font-mono uppercase font-semibold flex items-center gap-1 cursor-pointer transition-all active:scale-[0.99]"
                        >
                          <Plus className="w-3.5 h-3.5 text-theatre-gold" />
                          Agregar Pregunta de Guión
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* List of custom questions */}
                  <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                    <h4 className="font-serif text-base font-semibold text-stone-900 mb-4 pb-2 border-b">
                      Preguntas Personalizadas Creadas ({activeCharForQuestions.customQuestions?.length || 0})
                    </h4>

                    {(!activeCharForQuestions.customQuestions || activeCharForQuestions.customQuestions.length === 0) ? (
                      <div className="p-8 text-center text-stone-400 text-xs italic bg-stone-50 rounded-xl border border-stone-150">
                        No hay preguntas personalizadas. El quiz evaluará solo campos fijos biográficos autogenerados.
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {activeCharForQuestions.customQuestions.map((q) => (
                          <div key={q.id} className="p-3 bg-[#faf9f6] rounded-xl border border-stone-200 flex items-center justify-between gap-4">
                            <div>
                              <p className="font-serif text-xs text-stone-900 font-medium font-semibold">
                                {q.questionText}
                              </p>
                              <p className="text-[10px] font-mono text-[#d97706] mt-0.5">
                                R: <span className="font-serif font-bold italic">"{q.expectedAnswer}"</span>
                              </p>
                            </div>
                            <button
                              onClick={() => handleRemoveQuestion(activeCharForQuestions.id, q.id)}
                              className="text-stone-400 hover:text-red-700 p-1 rounded transition-colors bg-white/60 hover:bg-red-50"
                              title="Borrar pregunta"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="bg-white p-8 text-center rounded-2xl border">
                  Carga un personaje primero.
                </div>
              )}

            </div>
          </motion.div>
        )}

        {/* TAB 4: Actor Progress Metrics Dashboard */}
        {adminTab === "progreso" && (
          <motion.div
            key="progreso"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Visual KPI Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-theatre-maroon/10 text-theatre-maroon flex items-center justify-center shrink-0">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-[9px] font-mono text-stone-400 uppercase">Evaluaciones Tomadas</span>
                  <span className="text-2xl font-semibold text-stone-900">{totalQuizzes}</span>
                  <span className="block text-[10px] text-stone-500 font-light mt-0.5">Quizzes escritos completados</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-theatre-gold/15 text-[#b45309] flex items-center justify-center shrink-0">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-[9px] font-mono text-stone-400 uppercase">Porcentaje de Memorización</span>
                  <span className="text-2xl font-semibold text-stone-900">{avgScore}%</span>
                  <span className="block text-[10px] text-[#059669] font-light mt-0.5">Promedio global del elenco</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-150 text-red-700 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-[9px] font-mono text-stone-400 uppercase">Debilidades Teatrales</span>
                  <span className="text-2xl font-semibold text-stone-900">{Object.keys(questionFailures).length}</span>
                  <span className="block text-[10px] text-stone-500 font-light mt-0.5">Campos biográficos errados</span>
                </div>
              </div>

            </div>

            {/* Secondary splits: Left is most failing parts, Right is historical evaluations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Bottlenecks / Preguntas que más falla block */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4.5 h-4.5 text-theatre-maroon shrink-0" />
                  <h3 className="font-serif text-lg font-semibold text-stone-950">
                    Preguntas que más falla el elenco
                  </h3>
                </div>
                <p className="text-xs text-stone-500 font-light mb-6">
                  Identifica en qué datos específicos o preguntas personalizadas tiene mayor dificultad de memorización tu elenco de actores.
                </p>

                {sortedFailuresList.length === 0 ? (
                  <div className="p-12 text-center text-xs text-stone-400 italic bg-stone-50 rounded-xl border border-stone-150">
                    Aún no hay fallas registradas. El elenco demuestra memorización perfecta de inicio.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sortedFailuresList.map((fail, index) => (
                      <div 
                        key={index}
                        className="p-3 rounded-xl border border-stone-150 bg-stone-50/60 transition-all flex items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-2.5">
                          {/* visual bullet count of failures */}
                          <div className="w-6.5 h-6.5 rounded bg-red-100 text-red-700 text-xs font-mono font-semibold flex items-center justify-center shrink-0 mt-0.5">
                            {fail.count}
                          </div>
                          <div>
                            <p className="font-serif text-xs text-stone-900 font-semibold leading-snug">
                              {fail.text}
                            </p>
                            <span className="text-[9px] font-mono text-[#d97706] uppercase tracking-wider block mt-1">
                              Personaje: {fail.charName} • Tipo: {fail.fieldName}
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono text-red-650 font-bold tracking-widest uppercase shrink-0">
                          {fail.count === 1 ? "1 error" : `${fail.count} errores`}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recital activity loop logs */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4.5 h-4.5 text-theatre-gold shrink-0" />
                  <h3 className="font-serif text-lg font-semibold text-stone-950">
                    Historial de Ensayos / Quizzes
                  </h3>
                </div>
                <p className="text-xs text-stone-500 font-light mb-6">
                  Lista cronológica completa de todas las evaluaciones de libreto enviadas por los actores.
                </p>

                {attempts.length === 0 ? (
                  <div className="p-12 text-center text-xs text-stone-400 italic bg-stone-50 rounded-xl border border-stone-150">
                    Ningún actor ha tomado exámenes de memorización escritos todavía.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                    {[...attempts].reverse().map((att) => (
                      <div 
                        key={att.id}
                        className="p-3 bg-[#fbfaf7] rounded-xl border border-stone-150 flex flex-col sm:flex-row justify-between sm:items-center gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-stone-900 font-sans">{att.actorName}</span>
                            <span className="text-[9px] font-mono text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded leading-none uppercase">
                              {att.characterName}
                            </span>
                          </div>
                          <span className="text-[9px] font-mono text-stone-400 mt-1 block">
                            {new Date(att.timestamp).toLocaleString("es-ES")}
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5 self-end sm:self-auto">
                          <span className="text-[10px] font-mono text-stone-500">
                            {att.correctAnswersCount}/{att.totalQuestions} aciertos
                          </span>
                          
                          <div className={`px-2 py-1 rounded text-xs font-mono font-semibold ${
                            att.percentageScore >= 80 ? "bg-emerald-50 text-emerald-700 border border-emerald-150" :
                            att.percentageScore >= 50 ? "bg-amber-50 text-[#b45309] border border-amber-150" :
                            "bg-red-50 text-theatre-maroon border border-red-150"
                          }`}>
                            {att.percentageScore}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
