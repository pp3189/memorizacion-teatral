import React from "react";
import { motion } from "motion/react";
import { 
  Award, 
  XCircle, 
  CheckCircle2, 
  Volume2, 
  Sparkles, 
  RotateCcw, 
  BookOpen, 
  TrendingUp,
  Frown,
  Meh,
  Activity
} from "lucide-react";
import { QuizAttempt } from "../types";

interface QuizResultsProps {
  attempt: QuizAttempt;
  onRetry: () => void;
  onExit: () => void;
}

export default function QuizResults({
  attempt,
  onRetry,
  onExit
}: QuizResultsProps) {
  
  const score = attempt.percentageScore;

  // Cinematic theatrical feedback based on performance
  const getTheatricalFeedback = () => {
    if (score === 100) {
      return {
        title: "¡Digno de una Ovación de Pie!",
        description: "Has memorizado cada detalle con una precisión excepcional. Tu personaje ya corre por tus venas. Estás listo para presentarte ante cualquier crítico o director sin titubear sobre el escenario.",
        icon: Award,
        color: "text-emerald-700",
        bg: "bg-emerald-50",
        border: "border-emerald-200"
      };
    } else if (score >= 80) {
      return {
        title: "Excelente Retención Dramática",
        description: "Tienes el libreto bajo control. Exceptuando mínimos detalles o fechas específicas, tu audición fue formidable. Un ensayo de repaso rápido y rozarás la perfección.",
        icon: Sparkles,
        color: "text-theatre-gold",
        bg: "bg-amber-50/50",
        border: "border-amber-200/60"
      };
    } else if (score >= 50) {
      return {
        title: "Lectura de Mesa Aceptable",
        description: "Conoces la esencia de tu personaje, pero tropiezas en fechas clave, nombres o residencias exactas. El diablo está en los detalles; te recomendamos revisar la ficha técnica usando flashcards.",
        icon: Activity,
        color: "text-stone-700",
        bg: "bg-stone-50",
        border: "border-stone-200"
      };
    } else {
      return {
        title: "Se Requiere Mayor Ensayo",
        description: "Todavía confundes elementos esenciales de la biografía. Recuerda que la convicción del actor nace de la seguridad de sus antecedentes. Tómate un café, repasa las tarjetas de memorización e inténtalo de nuevo.",
        icon: Frown,
        color: "text-red-700",
        bg: "bg-red-50/50",
        border: "border-red-200/50"
      };
    }
  };

  const feedback = getTheatricalFeedback();
  const FeedbackIcon = feedback.icon;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Primary Scorecard */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-md p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          {/* Circular Percentage visual indicator */}
          <div className="flex flex-col items-center text-center p-4">
            <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400 mb-2">Puntuación</span>
            <div className="relative w-32 h-32 flex items-center justify-center rounded-full bg-stone-50 border border-stone-150">
              {/* Simple background circle */}
              <div className="absolute inset-2 rounded-full bg-white flex flex-col justify-center items-center shadow-inner">
                <span className="font-serif text-3xl font-extrabold text-stone-900">{score}%</span>
                <span className="text-[9px] font-mono tracking-widest text-[#d97706] uppercase mt-0.5">Aciertos</span>
              </div>
              
              {/* Outer stroke border */}
              <div 
                className={`absolute inset-0 rounded-full border-4 border-transparent transition-all ${
                  score >= 80 ? "border-t-emerald-500 border-r-emerald-500" :
                  score >= 50 ? "border-t-amber-500 border-r-amber-500" :
                  "border-t-theatre-maroon"
                }`}
              ></div>
            </div>
          </div>

          {/* Core Analytics Breakdown */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400">Resumen del Examen</span>
              <h2 className="font-serif text-2xl font-light text-stone-900 mt-0.5">
                Evaluación: <span className="italic font-medium">{attempt.characterName}</span>
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/50 text-center">
                <span className="block text-[9px] font-mono text-stone-500 uppercase">Preguntas</span>
                <span className="text-base font-semibold text-stone-800">{attempt.totalQuestions}</span>
              </div>
              
              <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100 text-center">
                <span className="block text-[9px] font-mono text-[#047857] uppercase">Correctas</span>
                <span className="text-base font-semibold text-emerald-700">{attempt.correctAnswersCount}</span>
              </div>

              <div className="bg-red-50/50 p-2.5 rounded-xl border border-red-100 text-center">
                <span className="block text-[9px] font-mono text-theatre-maroon uppercase">Incorrectas</span>
                <span className="text-base font-semibold text-theatre-maroon">{attempt.incorrectAnswersCount}</span>
              </div>
            </div>

            {/* Simulated timestamp info */}
            <p className="text-[10px] font-mono text-stone-400">
              Ensayo realizado el: {new Date(attempt.timestamp).toLocaleString("es-ES")}
            </p>
          </div>
          
        </div>

        {/* Dynamic Theatre Critique Speechbubble */}
        <div className={`mt-8 p-4 md:p-6 rounded-xl border ${feedback.bg} ${feedback.border} ${feedback.color} flex flex-col md:flex-row gap-4 items-start`}>
          <div className="rounded-lg bg-white p-2 shrink-0 border border-stone-200 shadow-sm">
            <FeedbackIcon className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-serif text-base font-bold leading-none mb-1.5">{feedback.title}</h4>
            <p className="text-xs font-light leading-relaxed text-stone-700">{feedback.description}</p>
          </div>
        </div>

        {/* Option actions */}
        <div className="mt-8 pt-6 border-t border-stone-100 flex flex-wrap gap-3 justify-end">
          <button
            onClick={onExit}
            className="px-4 py-2 bg-white hover:bg-stone-50 text-stone-700 rounded-lg border border-stone-200 text-xs font-mono uppercase tracking-wider transition-all"
          >
            Salir de la sesión
          </button>

          <button
            onClick={onRetry}
            className="px-5 py-2 bg-theatre-maroon hover:bg-[#8f1e1e] text-white rounded-lg text-xs font-mono uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5 font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5 text-theatre-gold" />
            <span>Repetir Examen</span>
          </button>
        </div>
      </div>

      {/* Side-by-Side Detailed Answer Log */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-md p-6">
        <h3 className="font-serif text-lg font-semibold text-stone-900 mb-2 flex items-center gap-2">
          <BookOpen className="w-4.5 h-4.5 text-theatre-maroon" />
          Libreto de Respuestas Examinadas
        </h3>
        <p className="text-xs text-stone-500 font-light mb-6">
          Compara tus recuerdos formulados por escrito contra los apuntes biográficos reales asignados por dirección.
        </p>

        <div className="space-y-4">
          {attempt.questionsLog.map((log, index) => (
            <div 
              key={index}
              className={`p-4 rounded-xl border transition-all ${
                log.isCorrect 
                  ? "bg-emerald-50/20 border-emerald-200" 
                  : "bg-red-50/20 border-red-200"
              }`}
            >
              <div className="flex items-start justify-between gap-3 food-header">
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block mb-1">
                    Pregunta {index + 1} • {log.fieldName}
                  </span>
                  <h4 className="font-serif text-sm font-semibold text-stone-900 leading-snug">
                    {log.questionText}
                  </h4>
                </div>

                {log.isCorrect ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Correcta
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-theatre-maroon bg-red-50 px-2.5 py-1 rounded-full shrink-0">
                    <XCircle className="w-3 h-3 text-[red]" />
                    Incorrecta
                  </span>
                )}
              </div>

              {/* Side by side columns */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-stone-100 pt-3 text-xs leading-relaxed">
                <div>
                  <p className="text-[10px] font-mono uppercase text-stone-400">Tu respuesta por escrito:</p>
                  <p className={`font-serif italic mt-1 font-medium ${log.isCorrect ? "text-emerald-800" : "text-theatre-maroon"}`}>
                    "{log.answerGiven || "(Espacio en blanco)"}"
                  </p>
                </div>
                
                <div className="bg-white/40 p-2.5 rounded border border-stone-200/50">
                  <p className="text-[10px] font-mono uppercase text-[#d97706]">Dato biográfico esperado:</p>
                  <p className="font-serif italic mt-1 text-stone-800 font-semibold">
                    "{log.answerExpected}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
