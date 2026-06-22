/**
 * Types defining data structures for the Actor Character Memorizer app.
 */

export interface CustomField {
  id: string;
  label: string;
  value: string;
}

export interface CustomQuestion {
  id: string;
  questionText: string;
  expectedAnswer: string;
  associatedField?: string; // Key of fixed field or empty for fully custom ones
}

export interface Character {
  id: string;
  // Fixed Fields
  nombreCompleto: string;
  fechaNacimiento: string;
  lugarNacimiento: string;
  nombrePadre: string;
  fechaNacimientoPadre: string;
  nombreMadre: string;
  fechaNacimientoMadre: string;
  estudios: string;
  lugarEstudios: string;
  fechaGraduacionSecundaria: string;
  fechaGraduacionPreparatoria: string;
  fechaGraduacionUniversidad: string;
  direccionCasa: string;
  
  // Free supplementary field
  datosAdicionales: string;

  // Custom key-value variables
  customFields: CustomField[];

  // User-created custom questions for evaluator
  customQuestions: CustomQuestion[];

  // Assignment metadata
  assignedActorName: string;
  createdAt: string;
  playName?: string; // Optional name of the play/opera
}

export interface QuizAttempt {
  id: string;
  characterId: string;
  characterName: string;
  timestamp: string;
  actorName: string;
  totalQuestions: number;
  correctAnswersCount: number;
  incorrectAnswersCount: number;
  percentageScore: number;
  questionsLog: {
    questionId: string;
    questionText: string;
    answerGiven: string;
    answerExpected: string;
    isCorrect: boolean;
    fieldName: string; // The biological category or question type
  }[];
}

// Fixed field labels mapping for iterating and dynamic auto-generation of questions
export const FIXED_FIELD_LABELS: Record<string, string> = {
  nombreCompleto: "Nombre completo del personaje",
  fechaNacimiento: "Fecha de nacimiento",
  lugarNacimiento: "Lugar de nacimiento",
  nombrePadre: "Nombre del padre",
  fechaNacimientoPadre: "Fecha de nacimiento del padre",
  nombreMadre: "Nombre de la madre",
  fechaNacimientoMadre: "Fecha de nacimiento de la madre",
  estudios: "Estudios",
  lugarEstudios: "Lugar de estudios",
  fechaGraduacionSecundaria: "Fecha de graduación de secundaria",
  fechaGraduacionPreparatoria: "Fecha de graduación de preparatoria",
  fechaGraduacionUniversidad: "Fecha de graduación de universidad",
  direccionCasa: "Dirección de casa",
  datosAdicionales: "Datos adicionales del personaje"
};
