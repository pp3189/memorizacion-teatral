import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, ChevronRight, Play, Eye, Lock, Send, Sparkles } from "lucide-react";
import { Character, QuizAttempt } from "../types";
import { checkAnswersLeniently } from "../data/initialData";

interface QuizModeProps {
  character: Character;
  actorName: string;
  onQuizFinished: (attempt: QuizAttempt) => void;
}

interface PreparedQuestion {
  id: string; // unique ID
  type: "fixed" | "customField" | "customQuestion";
  fieldName: string; // label e.g., "Fecha de nacimiento"
  questionText: string;
  expectedAnswer: string;
}

export default function QuizMode({
  character,
  actorName,
  onQuizFinished
}: QuizModeProps) {
  const [questions, setQuestions] = useState<PreparedQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [answersMap, setAnswersMap] = useState<Record<string, string>>({});
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  // Evita doble envío del examen (doble clic / doble disparo).
  const finishedRef = useRef<boolean>(false);

  // Compile and randomize the question roster on launch
  useEffect(() => {
    const list: PreparedQuestion[] = [];

    // Helper to push non-empty fixed fields
    const addFixed = (key: keyof Character, fieldName: string, questionText: string) => {
      const val = character[key];
      if (typeof val === "string" && val.trim() !== "" && val.toLowerCase() !== "sin especificar" && val.toLowerCase() !== "no cursó" && val.toLowerCase() !== "no cursó preparatoria" && val.toLowerCase() !== "no cursó secundaria oficial" && val.toLowerCase() !== "sin estudios universitarios") {
        list.push({
          id: `fixed-${key}`,
          type: "fixed",
          fieldName,
          questionText,
          expectedAnswer: val.trim()
        });
      }
    };

    // Add corresponding natural queries for fixed fields
    addFixed("nombreCompleto", "Nombre completo del personaje", "¿Cuál es el nombre completo de tu personaje?");
    addFixed("fechaNacimiento", "Fecha de nacimiento", "¿Cuál es tu fecha de nacimiento en el papel?");
    addFixed("lugarNacimiento", "Lugar de nacimiento", "¿En qué lugar naciste?");
    addFixed("nombrePadre", "Nombre del padre", "¿Cómo se llama tu padre?");
    addFixed("fechaNacimientoPadre", "Fecha de nacimiento del padre", "¿Cuál es la fecha de nacimiento de tu padre?");
    addFixed("nombreMadre", "Nombre de la madre", "¿Cómo se llama tu madre?");
    addFixed("fechaNacimientoMadre", "Fecha de nacimiento de la madre", "¿Cuál es la fecha de nacimiento de tu madre?");
    addFixed("estudios", "Estudios", "¿Qué estudios o formación académica recibiste?");
    addFixed("lugarEstudios", "Lugar de estudios", "¿Dónde o en qué academia realizaste tus estudios?");
    addFixed("fechaGraduacionSecundaria", "Graduación de secundaria", "¿En qué fecha te graduaste de secundaria?");
    addFixed("fechaGraduacionPreparatoria", "Graduación de preparatoria", "¿En qué fecha te graduaste de preparatoria?");
    addFixed("fechaGraduacionUniversidad", "Graduación de universidad", "¿En qué fecha te graduaste de la universidad?");
    addFixed("direccionCasa", "Dirección de casa", "¿Cuál es tu dirección de domicilio / casa?");

    // Add custom key-value fields if filled
    character.customFields.forEach((cf) => {
      if (cf.label.trim() && cf.value.trim()) {
        list.push({
          id: `cf-${cf.id}`,
          type: "customField",
          fieldName: cf.label,
          questionText: `Respecto a tu antecedente de "${cf.label}", ¿cuál es la información exacta?`,
          expectedAnswer: cf.value.trim()
        });
      }
    });

    // Add administrator-created custom questions
    character.customQuestions.forEach((cq) => {
      if (cq.questionText.trim() && cq.expectedAnswer.trim()) {
        list.push({
          id: `cq-${cq.id}`,
          type: "customQuestion",
          fieldName: "Pregunta Personalizada del Guión",
          questionText: cq.questionText.trim(),
          expectedAnswer: cq.expectedAnswer.trim()
        });
      }
    });

    // Shuffle and cap at 15 questions
    const shuffled = [...list].sort(() => Math.random() - 0.5).slice(0, 15);
    setQuestions(shuffled);
  }, [character]);

  const handleStart = () => {
    setQuizStarted(true);
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    const currentQ = questions[currentIndex];
    
    // Save answer
    setAnswersMap((prev) => ({
      ...prev,
      [currentQ.id]: userAnswer
    }));

    // Reset answer block and transition
    setUserAnswer("");

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Calculate final results (solo una vez)
      if (finishedRef.current) return;
      finishedRef.current = true;
      const finalAnswers = { ...answersMap, [currentQ.id]: userAnswer };
      const logs = questions.map((q) => {
        const given = finalAnswers[q.id] || "";
        const isCorrect = checkAnswersLeniently(given, q.expectedAnswer);
        return {
          questionId: q.id,
          questionText: q.questionText,
          answerGiven: given,
          answerExpected: q.expectedAnswer,
          isCorrect,
          fieldName: q.fieldName
        };
      });

      const correctCount = logs.filter((l) => l.isCorrect).length;
      const incorrectCount = logs.length - correctCount;
      const pct = Math.round((correctCount / logs.length) * 100);

      const attempt: QuizAttempt = {
        id: `att-${Date.now()}`,
        characterId: character.id,
        characterName: character.nombreCompleto,
        timestamp: new Date().toISOString(),
        actorName,
        totalQuestions: questions.length,
        correctAnswersCount: correctCount,
        incorrectAnswersCount: incorrectCount,
        percentageScore: pct,
        questionsLog: logs
      };

      onQuizFinished(attempt);
    }
  };

  const percentageProgress = questions.length 
    ? Math.round((currentIndex / questions.length) * 100) 
    : 0;

  if (questions.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center max-w-xl mx-auto">
        <HelpCircle className="w-12 h-12 text-stone-300 mx-auto mb-4" />
        <h3 className="font-serif text-xl font-semibold mb-2">No hay suficientes datos</h3>
        <p className="text-sm text-stone-500 font-light mb-2">
          No existen datos precargados ni preguntas creadas para este personaje.
        </p>
        <p className="text-xs text-stone-400 font-light">
          Avisa a tu director para que cargue la biografía. Puedes salir desde el menú lateral.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <AnimatePresence mode="wait">
        {!quizStarted ? (
          <motion.div
            key="quiz-start"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="bg-white rounded-2xl border border-stone-200 shadow-md p-8 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-theatre-maroon/10 text-theatre-maroon flex items-center justify-center mx-auto mb-6">
              <Play className="w-8 h-8 text-theatre-maroon translate-x-0.5" />
            </div>

            <span className="text-[10px] font-mono tracking-widest text-[#d97706] uppercase bg-amber-50 px-2.5 py-1 rounded inline-block mb-3">
              Audición Cognitiva
            </span>

            <h1 className="font-serif text-3xl font-light text-stone-900 tracking-tight mb-3">
              Examen de Retención Escrita
            </h1>
            
            <p className="text-xs text-stone-500 font-light max-w-sm mx-auto leading-relaxed mb-6">
              Vas a responder <span className="font-semibold text-stone-800">{questions.length} preguntas</span> basadas en los datos biográficos de <span className="font-bold text-stone-800 italic">{character.nombreCompleto}</span>.
            </p>

            {/* Strict rules */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-150 text-left space-y-2 mb-8 max-w-sm mx-auto">
              <h5 className="text-[11px] font-mono uppercase tracking-wider text-stone-900 leading-none">Reglas de la función:</h5>
              <ul className="text-xs text-stone-500 font-light space-y-1">
                <li className="flex items-start gap-1.5">
                  <span className="text-[#d97706] shrink-0 mt-0.5">•</span>
                  <span><strong>Respuestas manuales:</strong> Escribe lo que recuerdas.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#d97706] shrink-0 mt-0.5">•</span>
                  <span><strong>Bloqueo visual:</strong> La ficha biográfica estará totalmente invisible.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#d97706] shrink-0 mt-0.5">•</span>
                  <span><strong>Secuencia aleatoria:</strong> El orden de preguntas cambia cada vez.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#d97706] shrink-0 mt-0.5">•</span>
                  <span><strong>Sin retorno:</strong> Una vez aquí no podrás volver a estudiar. Se calificará automáticamente.</span>
                </li>
              </ul>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-stone-400 mb-5">
              <Lock className="w-3.5 h-3.5 text-theatre-maroon" />
              <span>Área de evaluación bloqueada</span>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleStart}
                className="py-2.5 px-6 rounded-lg bg-theatre-maroon hover:bg-[#8f1e1e] text-[#fbfaf7] text-xs font-mono uppercase tracking-wider transition-all shadow-md font-semibold flex items-center gap-1.5"
              >
                Comenzar Examen
                <ChevronRight className="w-4 h-4 text-theatre-gold" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="quiz-active"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl border border-stone-200/90 shadow-lg p-6 md:p-8 relative overflow-hidden"
          >
            {/* Visual Header bar with Progress indication */}
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-theatre-maroon" />
                <span className="text-xs font-mono text-stone-400">Intérprete: {actorName}</span>
              </div>
              <span className="text-xs font-mono font-semibold text-theatre-gold">
                Pregunta {currentIndex + 1} de {questions.length}
              </span>
            </div>

            {/* Visual bar progress */}
            <div className="w-full h-1 bg-stone-100 rounded-full overflow-hidden mb-8">
              <div
                className="bg-theatre-maroon h-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>

            {/* Prompt Stage */}
            <div className="min-h-[140px] flex flex-col justify-center text-center py-4 px-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#d97706] mb-2 leading-none block">
                {questions[currentIndex].fieldName}
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-light text-stone-900 tracking-tight leading-relaxed">
                {questions[currentIndex].questionText}
              </h2>
            </div>

            {/* Form written answers */}
            <form onSubmit={handleNext} className="space-y-5">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wide text-stone-400 mb-1.5">
                  Escribe tu respuesta memorizada:
                </label>
                <textarea
                  required
                  rows={2}
                  autoFocus
                  placeholder="Escribe aquí exactamente lo que recuerdas..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-stone-200 text-[#1e1b18] text-sm focus:ring-2 focus:ring-theatre-maroon/20 focus:border-theatre-maroon bg-stone-50/20 font-serif leading-relaxed outline-none transition-all placeholder:text-stone-400"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-stone-300">
                  <Lock className="w-3.5 h-3.5" />
                  Examen en curso
                </span>

                <button
                  type="submit"
                  className="py-2.5 px-5 bg-stone-900 hover:bg-stone-800 text-stone-100 text-xs font-mono uppercase tracking-wider rounded-lg transition-all shadow flex items-center gap-1.5 font-semibold"
                >
                  <span>
                    {currentIndex === questions.length - 1 ? "Finalizar Examen" : "Siguiente"}
                  </span>
                  <Send className="w-3 h-3 text-theatre-gold" />
                </button>
              </div>
            </form>

            <div className="mt-8 pt-4 border-t border-stone-100/60 text-center">
              <p className="text-[10px] text-stone-400 font-light flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-theatre-gold" />
                El examinador admite aproximaciones semánticas razonables para facilitar tu estudio dramático.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
