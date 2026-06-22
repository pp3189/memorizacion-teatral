import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  MapPin, 
  Calendar, 
  User, 
  GraduationCap, 
  Home, 
  Plus, 
  Sparkles, 
  ChevronRight,
  Eye,
  RotateCw,
  Award
} from "lucide-react";
import { Character, FIXED_FIELD_LABELS } from "../types";

interface StudyModeProps {
  character: Character;
  onStartQuiz: () => void;
}

export default function StudyMode({ character, onStartQuiz }: StudyModeProps) {
  const [activeStudyTab, setActiveStudyTab] = useState<"ficha" | "tarjetas">("ficha");
  
  // Flashcard state
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Group fields for organized reading
  const dataGroups = [
    {
      title: "Identidad Esencial",
      icon: User,
      bgColor: "bg-amber-50/50",
      borderColor: "border-amber-200/60",
      iconColor: "text-amber-700",
      fields: [
        { key: "nombreCompleto", label: "Nombre completo del personaje", val: character.nombreCompleto },
        { key: "fechaNacimiento", label: "Fecha de nacimiento", val: character.fechaNacimiento },
        { key: "lugarNacimiento", label: "Lugar de nacimiento", val: character.lugarNacimiento }
      ]
    },
    {
      title: "Vínculos Familiares",
      icon: BookOpen,
      bgColor: "bg-red-50/50",
      borderColor: "border-red-200/65",
      iconColor: "text-theatre-maroon",
      fields: [
        { key: "nombrePadre", label: "Nombre del padre", val: character.nombrePadre },
        { key: "fechaNacimientoPadre", label: "Fecha de nacimiento del padre", val: character.fechaNacimientoPadre },
        { key: "nombreMadre", label: "Nombre de la madre", val: character.nombreMadre },
        { key: "fechaNacimientoMadre", label: "Fecha de nacimiento de la madre", val: character.fechaNacimientoMadre }
      ]
    },
    {
      title: "Educación & Escuela de Vida",
      icon: GraduationCap,
      bgColor: "bg-stone-50",
      borderColor: "border-stone-200",
      iconColor: "text-stone-700",
      fields: [
        { key: "estudios", label: "Estudios", val: character.estudios },
        { key: "lugarEstudios", label: "Lugar de estudios", val: character.lugarEstudios },
        { key: "fechaGraduacionSecundaria", label: "Graduación de Secundaria", val: character.fechaGraduacionSecundaria },
        { key: "fechaGraduacionPreparatoria", label: "Graduación de Preparatoria", val: character.fechaGraduacionPreparatoria },
        { key: "fechaGraduacionUniversidad", label: "Graduación de Universidad", val: character.fechaGraduacionUniversidad }
      ]
    },
    {
      title: "Domicilio e Historial",
      icon: Home,
      bgColor: "bg-zinc-50/80",
      borderColor: "border-zinc-200",
      iconColor: "text-zinc-700",
      fields: [
        { key: "direccionCasa", label: "Dirección de casa", val: character.direccionCasa }
      ]
    }
  ];

  // Flat list of populated fields for flashcards
  const flashcardFields: { label: string; value: string }[] = [];
  
  // 1. Add fixed fields if they have value
  Object.keys(FIXED_FIELD_LABELS).forEach((key) => {
    const val = character[key as keyof Character];
    if (typeof val === "string" && val.trim() !== "" && val.toLowerCase() !== "sin especificar") {
      flashcardFields.push({
        label: FIXED_FIELD_LABELS[key],
        value: val
      });
    }
  });

  // 2. Add custom fields if any
  character.customFields.forEach(cf => {
    if (cf.label.trim() && cf.value.trim()) {
      flashcardFields.push({
        label: cf.label,
        value: cf.value
      });
    }
  });

  const handleNextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev + 1) % flashcardFields.length);
    }, 150);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev - 1 + flashcardFields.length) % flashcardFields.length);
    }, 150);
  };

  return (
    <div className="space-y-6">
      
      {/* Editorial Header */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-stone-200/80 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-theatre-gold uppercase tracking-wider mb-2">
              <BookOpen className="w-4.5 h-4.5" />
              Gabinete Dramático / {character.playName || "Obra Teatral"}
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-stone-900 font-light tracking-tight">
              Estudio de Personaje: <span className="font-semibold text-theatre-maroon italic">{character.nombreCompleto}</span>
            </h1>
            <p className="text-xs md:text-sm text-stone-500 font-light mt-1 max-w-2xl leading-relaxed">
              Estudia en detalle los hechos biográficos de tu rol asignado. Cuando te sientas seguro y recuerdes cada fecha de nacimiento o dirección, presiona el botón de evaluación para comprobar tus conocimientos por escrito.
            </p>
          </div>
          <div className="shrink-0 flex gap-3">
            <button
              onClick={onStartQuiz}
              className="px-5 py-3 rounded-lg bg-theatre-maroon hover:bg-[#8f1e1e] active:bg-[#661414] text-[#fbfaf7] text-sm font-sans font-semibold tracking-wide flex items-center gap-2 transition-all shadow-md active:scale-95"
            >
              <Award className="w-4 h-4 text-theatre-gold" />
              <span>Iniciar Quiz Escrito</span>
            </button>
          </div>
        </div>

        {/* Study Navigation Toggles */}
        <div className="mt-8 flex gap-2 border-b border-stone-150 pb-px">
          <button
            onClick={() => setActiveStudyTab("ficha")}
            className={`px-4 py-2.5 font-serif text-sm tracking-wide border-b-2 font-medium transition-all ${
              activeStudyTab === "ficha"
                ? "border-theatre-maroon text-theatre-maroon"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            Ficha del Personaje (Completa)
          </button>
          <button
            onClick={() => setActiveStudyTab("tarjetas")}
            className={`px-4 py-2.5 font-serif text-sm tracking-wide border-b-2 font-medium transition-all flex items-center gap-2 ${
              activeStudyTab === "tarjetas"
                ? "border-theatre-maroon text-theatre-maroon"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            Tarjetas de Memorización ({flashcardFields.length})
          </button>
        </div>
      </div>

      {/* Main Study views */}
      <AnimatePresence mode="wait">
        
        {activeStudyTab === "ficha" && (
          <motion.div
            key="study-ficha"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Grid of biographical cards */}
            {dataGroups.map((group, gIdx) => {
              const GroupIcon = group.icon;
              return (
                <div 
                  key={gIdx}
                  className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-stone-950 mb-4 pb-2 border-b border-stone-100 flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg ${group.bgColor} flex items-center justify-center ${group.iconColor}`}>
                        <GroupIcon className="w-4 h-4" />
                      </div>
                      {group.title}
                    </h3>

                    <div className="space-y-4">
                      {group.fields.map((field) => {
                        const hasVal = field.val && field.val.trim();
                        return (
                          <div key={field.key} className="group py-1">
                            <span className="block text-[10px] font-mono tracking-wider uppercase text-stone-500 leading-tight">
                              {field.label}
                            </span>
                            <span className={`block text-[13.5px] font-sans mt-0.5 ${hasVal ? "text-stone-800 font-medium" : "text-stone-400 italic font-light"}`}>
                              {hasVal ? field.val : "Información no provista por dirección"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Custom Extra Fields Card */}
            {character.customFields.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm col-span-1 md:col-span-2">
                <h3 className="font-serif text-lg font-semibold text-stone-950 mb-4 pb-2 border-b border-stone-100 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-theatre-gold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  Datos Adicionales Personalizados (Dirección)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {character.customFields.map((cf) => (
                    <div key={cf.id} className="bg-[#fbfcfa]/60 p-3.5 rounded-lg border border-stone-200/50">
                      <span className="block text-[10px] font-mono tracking-wider uppercase text-theatre-gold">
                        {cf.label}
                      </span>
                      <span className="block text-sm text-stone-800 font-medium mt-1 font-serif">
                        {cf.value || <span className="italic text-stone-400 font-light font-sans">Sin especificar</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Free formulation text blocks */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm col-span-1 md:col-span-2">
              <h3 className="font-serif text-lg font-semibold text-stone-950 mb-3 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-theatre-maroon">
                  <BookOpen className="w-4 h-4" />
                </div>
                Descripción Contextual del Personaje
              </h3>
              <div className="bg-[#fbfcfa] p-5 rounded-xl border border-stone-150 relative">
                <p className="text-stone-700 font-serif leading-relaxed text-sm whitespace-pre-line italic">
                  "{character.datosAdicionales || "No hay comentarios adicionales sobre el pasado o psicología del personaje."}"
                </p>
                <div className="absolute top-2 right-2.5 text-[9px] font-mono uppercase text-stone-400">
                  Anotaciones del Director
                </div>
              </div>
            </div>

            {/* Quiz suggestions */}
            <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row items-center justify-between p-6 bg-gradient-to-r from-stone-950 to-[#221010] text-[#fbfaf7] rounded-2xl border border-stone-800">
              <div className="mb-4 md:mb-0">
                <h4 className="font-serif text-lg font-medium text-stone-100 flex items-center gap-2">
                  ¿Listo para la audición cognitiva?
                </h4>
                <p className="text-xs text-stone-400 font-light mt-1">
                  El quiz evaluará exclusivamente la información que acabas de leer. Deberás escribir las respuestas textuales y el sistema se encargará de verificar la precisión de tu lóbulo de memoria.
                </p>
              </div>
              <button
                onClick={onStartQuiz}
                className="px-6 py-2.5 bg-theatre-gold hover:bg-[#c26a05] active:bg-[#9a5404] text-stone-950 rounded-lg text-sm font-semibold tracking-wide shrink-0 transition-all shadow-lg font-sans"
              >
                Tomar Examen Escrito
              </button>
            </div>
            
          </motion.div>
        )}

        {activeStudyTab === "tarjetas" && (
          <motion.div
            key="study-tarjetas"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-6"
          >
            {flashcardFields.length === 0 ? (
              <div className="bg-white rounded-xl border p-8 text-center max-w-md">
                <Eye className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                <p className="text-sm font-sans text-stone-500">Este personaje no posee información suficiente para generar tarjetas.</p>
              </div>
            ) : (
              <div className="w-full max-w-xl space-y-6">
                
                {/* Visual Progress marker */}
                <div className="flex items-center justify-between px-2 text-xs font-mono text-stone-500">
                  <span>Tarjeta {currentCardIndex + 1} de {flashcardFields.length}</span>
                  <div className="w-32 bg-stone-200 h-1 rounded-full overflow-hidden">
                    <div 
                      className="bg-theatre-maroon h-full transition-all duration-300"
                      style={{ width: `${((currentCardIndex + 1) / flashcardFields.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Interactive Flippable Card */}
                <div 
                  className="perspective-1000 w-full min-h-[300px] cursor-pointer"
                  onClick={() => setIsFlipped(!isFlipped)}
                >
                  <motion.div 
                    className={`w-full min-h-[300px] rounded-2xl relative transition-all duration-500 transform-style-3d border ${
                      isFlipped 
                        ? "bg-[#1f1615] text-[#fbfaf7] border-[#442c29] shadow-2xl hover:border-[#5a3b37]" 
                        : "bg-white text-stone-900 border-stone-200/80 shadow-md hover:border-stone-300"
                    }`}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ type: "spring", damping: 15 }}
                  >
                    
                    {/* Front cover of the card */}
                    <div 
                      className={`absolute inset-0 p-8 flex flex-col justify-between backface-hidden ${
                        isFlipped ? "opacity-0 invisible" : "opacity-100 visible"
                      }`}
                    >
                      <div className="flex justify-between items-start text-xs font-mono">
                        <span className="text-stone-400 uppercase tracking-widest leading-none">Dato Solicitado</span>
                        <span className="text-theatre-gold bg-theatre-gold/10 px-2 py-0.5 rounded uppercase leading-none">Pregunta</span>
                      </div>

                      <div className="text-center py-6">
                        <h3 className="font-serif text-2xl font-light text-stone-900 tracking-tight leading-normal">
                          {flashcardFields[currentCardIndex].label}
                        </h3>
                        <p className="text-[10px] text-stone-400 font-mono tracking-widest uppercase mt-4">
                          ¿Qué guardas en tu memoria?
                        </p>
                      </div>

                      <div className="flex justify-center items-center gap-1.5 text-xs font-mono text-[#b45309]">
                        <RotateCw className="w-3 h-3 animate-spin duration-3000" />
                        <span>Clic para revelar respuesta</span>
                      </div>
                    </div>

                    {/* Back cover (flipped answer) */}
                    <div 
                      className={`absolute inset-0 p-8 flex flex-col justify-between backface-hidden [transform:rotateY(180deg)] ${
                        isFlipped ? "opacity-100 visible" : "opacity-0 invisible"
                      }`}
                    >
                      <div className="flex justify-between items-start text-xs font-mono">
                        <span className="text-stone-500 uppercase tracking-widest leading-none">Categoría: {flashcardFields[currentCardIndex].label}</span>
                        <span className="text-emerald-400 bg-emerald-950/20 px-2.5 py-0.5 rounded uppercase leading-none">Respuesta</span>
                      </div>

                      <div className="text-center py-6">
                        <p className="text-[11px] font-mono uppercase tracking-widest text-[#d97706] mb-2">Para el personaje:</p>
                        <h3 className="font-serif italic text-2xl font-semibold text-stone-100 leading-normal">
                          "{flashcardFields[currentCardIndex].value}"
                        </h3>
                      </div>

                      <div className="flex justify-center items-center gap-1.5 text-xs font-mono text-stone-500">
                        <span>Clic para ocultar</span>
                      </div>
                    </div>

                  </motion.div>
                </div>

                {/* Control Panel Buttons */}
                <div className="flex justify-between gap-4">
                  <button
                    onClick={handlePrevCard}
                    className="flex-1 py-3 px-4 bg-white hover:bg-stone-50 text-stone-700 rounded-lg border border-stone-200 text-xs font-mono uppercase tracking-wider transition-all"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="py-3 px-6 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-mono uppercase tracking-wider transition-all"
                  >
                    Voltear
                  </button>
                  <button
                    onClick={handleNextCard}
                    className="flex-1 py-3 px-4 bg-theatre-maroon hover:bg-[#8f1e1e] text-white rounded-lg text-xs font-mono uppercase tracking-wider transition-all"
                  >
                    Siguiente
                  </button>
                </div>

                {/* Help cue */}
                <div className="text-center">
                  <p className="text-[11px] text-stone-400 font-light">
                    Consejo: Pronuncia la respuesta en voz alta como si estuvieras en el escenario antes de revelarla.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
