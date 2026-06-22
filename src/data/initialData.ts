import { Character, QuizAttempt } from "../types";

export const INITIAL_CHARACTERS: Character[] = [
  {
    id: "char-hamlet",
    nombreCompleto: "Hamlet de Dinamarca",
    fechaNacimiento: "15 de Mayo de 1599",
    lugarNacimiento: "Castillo de Elsinor, Dinamarca",
    nombrePadre: "Rey Hamlet (Espectro)",
    fechaNacimientoPadre: "04 de Agosto de 1560",
    nombreMadre: "Reina Gertrudis",
    fechaNacimientoMadre: "12 de Diciembre de 1568",
    estudios: "Filosofía del Humanismo y Teología",
    lugarEstudios: "Universidad de Wittenberg, Alemania",
    fechaGraduacionSecundaria: "18 de Junio de 1614",
    fechaGraduacionPreparatoria: "22 de Junio de 1617",
    fechaGraduacionUniversidad: "Inconclusa (regresó por duelo real)",
    direccionCasa: "Ala Norte, Torre de los Tapices, Real Castillo de Elsinor",
    datosAdicionales: "Sufre de profunda melancolía y sospechas constantes. Viste estrictamente de luto negro. Su filósofo de cabecera es Horacio. Está obsesionado con el retraso de su propia venganza.",
    playName: "Hamlet (Tragedia de Shakespeare)",
    assignedActorName: "Sofía Martín",
    createdAt: "2026-06-15T10:00:00Z",
    customFields: [
      { id: "cf-1", label: "Mayor Confidente", value: "Horacio" },
      { id: "cf-2", label: "Interés Amoroso", value: "Ofelia (Hija de Polonio)" },
      { id: "cf-3", label: "Objeto Emblemático", value: "El cráneo de Yorick, el bufón" },
      { id: "cf-4", label: "Secreto Mayor", value: "Sospecha que su tío Claudio envenenó a su padre" }
    ],
    customQuestions: [
      {
        id: "cq-hamlet-1",
        questionText: "¿De quién es el cráneo que sostiene Hamlet en el cementerio?",
        expectedAnswer: "Yorick",
        associatedField: "datosAdicionales"
      },
      {
        id: "cq-hamlet-2",
        questionText: "¿Quién es el actual rey usurpador y tío de Hamlet?",
        expectedAnswer: "Claudio",
        associatedField: "datosAdicionales"
      },
      {
        id: "cq-hamlet-3",
        questionText: "¿Cuál es el famoso dilema que expresa en su monólogo?",
        expectedAnswer: "Ser o no ser",
        associatedField: "datosAdicionales"
      }
    ]
  },
  {
    id: "char-bernarda",
    nombreCompleto: "Bernarda Alba",
    fechaNacimiento: "10 de Abril de 1876",
    lugarNacimiento: "Valderrubio, Granada, España",
    nombrePadre: "Manuel Alba",
    fechaNacimientoPadre: "15 de Febrero de 1845",
    nombreMadre: "Josefa de la Santísima Trinidad",
    fechaNacimientoMadre: "30 de Octubre de 1851",
    estudios: "Estudios domésticos y costura tradicional",
    lugarEstudios: "Hogar familiar, Andalucía",
    fechaGraduacionSecundaria: "No cursó secundaria oficial",
    fechaGraduacionPreparatoria: "No cursó preparatoria",
    fechaGraduacionUniversidad: "Sin estudios universitarios",
    direccionCasa: "Calle Real Nº 12, Casa de Blancas Paredes Grises",
    datosAdicionales: "Impone un riguroso luto de ocho años tras la muerte de su segundo esposo. Controladora extrema, obsesionada con la decencia, la pureza y las habladurías del pueblo. Su bastón de mando es el símbolo de su autoridad absoluta.",
    playName: "La Casa de Bernarda Alba",
    assignedActorName: "Alejandra Ruiz",
    createdAt: "2026-06-18T14:30:00Z",
    customFields: [
      { id: "cf-b1", label: "Segundo Esposo (Fallecido)", value: "Antonio María Benavides" },
      { id: "cf-b2", label: "Criada Principal", value: "La Poncia" },
      { id: "cf-b3", label: "Número de hijas del personaje", value: "Cinco hijas" },
      { id: "cf-b4", label: "Mayor fobia social", value: "El chisme local y el 'qué dirán'" }
    ],
    customQuestions: [
      {
        id: "cq-bernarda-1",
        questionText: "¿Cuántos años de riguroso luto impone Bernarda a sus hijas?",
        expectedAnswer: "Ocho",
        associatedField: "datosAdicionales"
      },
      {
        id: "cq-bernarda-2",
        questionText: "¿Qué objeto representa la autoridad absoluta de Bernarda en escena?",
        expectedAnswer: "Su bastón",
        associatedField: "datosAdicionales"
      }
    ]
  }
];

export const INITIAL_HISTORY: QuizAttempt[] = [
  {
    id: "attempt-1",
    characterId: "char-hamlet",
    characterName: "Hamlet de Dinamarca",
    timestamp: "2026-06-20T17:45:00-07:00",
    actorName: "Sofía Martín",
    totalQuestions: 6,
    correctAnswersCount: 4,
    incorrectAnswersCount: 2,
    percentageScore: 66,
    questionsLog: [
      {
        questionId: "nombreCompleto",
        questionText: "¿Cuál es el Nombre completo del personaje?",
        answerGiven: "Hamlet de Elsinor",
        answerExpected: "Hamlet de Dinamarca",
        isCorrect: false,
        fieldName: "Nombre completo del personaje"
      },
      {
        questionId: "fechaNacimiento",
        questionText: "¿Cuál es la Fecha de nacimiento?",
        answerGiven: "15 de mayo de 1599",
        answerExpected: "15 de Mayo de 1599",
        isCorrect: true,
        fieldName: "Fecha de nacimiento"
      },
      {
        questionId: "nombreMadre",
        questionText: "¿Cuál es el Nombre de la madre?",
        answerGiven: "Gertrudis",
        answerExpected: "Reina Gertrudis",
        isCorrect: true, // we can support lenient match!
        fieldName: "Nombre de la madre"
      },
      {
        questionId: "lugarEstudios",
        questionText: "¿Cuál es el Lugar de estudios?",
        answerGiven: "Wittenberg",
        answerExpected: "Universidad de Wittenberg, Alemania",
        isCorrect: true,
        fieldName: "Lugar de estudios"
      },
      {
        questionId: "cq-hamlet-1",
        questionText: "¿De quién es el cráneo que sostiene Hamlet en el cementerio?",
        answerGiven: "Yorik",
        answerExpected: "Yorick",
        isCorrect: true, // Lenient match spelling
        fieldName: "Pregunta Personalizada"
      },
      {
        questionId: "fechaNacimientoPadre",
        questionText: "¿Cuál es la Fecha de nacimiento del padre?",
        answerGiven: "1540 creo",
        answerExpected: "04 de Agosto de 1560",
        isCorrect: false,
        fieldName: "Fecha de nacimiento del padre"
      }
    ]
  },
  {
    id: "attempt-2",
    characterId: "char-hamlet",
    characterName: "Hamlet de Dinamarca",
    timestamp: "2026-06-21T11:20:00-07:00",
    actorName: "Sofía Martín",
    totalQuestions: 5,
    correctAnswersCount: 5,
    incorrectAnswersCount: 0,
    percentageScore: 100,
    questionsLog: [
      {
        questionId: "nombreCompleto",
        questionText: "¿Cuál es el Nombre completo del personaje?",
        answerGiven: "Hamlet de Dinamarca",
        answerExpected: "Hamlet de Dinamarca",
        isCorrect: true,
        fieldName: "Nombre completo del personaje"
      },
      {
        questionId: "fechaNacimientoPadre",
        questionText: "¿Cuál es la Fecha de nacimiento del padre?",
        answerGiven: "04 de agosto de 1560",
        answerExpected: "04 de Agosto de 1560",
        isCorrect: true,
        fieldName: "Fecha de nacimiento del padre"
      },
      {
        questionId: "direccionCasa",
        questionText: "¿Cuál es la Dirección de casa?",
        answerGiven: "Castillo de Elsinor ala norte",
        answerExpected: "Ala Norte, Torre de los Tapices, Real Castillo de Elsinor",
        isCorrect: true,
        fieldName: "Dirección de casa"
      },
      {
        questionId: "cq-hamlet-3",
        questionText: "¿Cuál es el famoso dilema que expresa en su monólogo?",
        answerGiven: "Ser o no ser",
        answerExpected: "Ser o no ser",
        isCorrect: true,
        fieldName: "Pregunta Personalizada"
      },
      {
        questionId: "lugarNacimiento",
        questionText: "¿Cuál es el Lugar de nacimiento?",
        answerGiven: "Castillo de Elsinor, Dinamarca",
        answerExpected: "Castillo de Elsinor, Dinamarca",
        isCorrect: true,
        fieldName: "Lugar de nacimiento"
      }
    ]
  },
  {
    id: "attempt-3",
    characterId: "char-bernarda",
    characterName: "Bernarda Alba",
    timestamp: "2026-06-21T15:10:00-07:00",
    actorName: "Alejandra Ruiz",
    totalQuestions: 4,
    correctAnswersCount: 2,
    incorrectAnswersCount: 2,
    percentageScore: 50,
    questionsLog: [
      {
        questionId: "nombreCompleto",
        questionText:  "¿Cuál es el Nombre completo del personaje?",
        answerGiven: "Bernarda Alba de Andalucía",
        answerExpected: "Bernarda Alba",
        isCorrect: true,
        fieldName: "Nombre completo del personaje"
      },
      {
        questionId: "direccionCasa",
        questionText: "¿Cuál es la Dirección de casa?",
        answerGiven: "No me acuerdo",
        answerExpected: "Calle Real Nº 12, Casa de Blancas Paredes Grises",
        isCorrect: false,
        fieldName: "Dirección de casa"
      },
      {
        questionId: "cq-bernarda-1",
        questionText: "¿Cuántos años de riguroso luto impone Bernarda a sus hijas?",
        answerGiven: "8 años",
        answerExpected: "Ocho",
        isCorrect: true, // lenient check
        fieldName: "Pregunta Personalizada"
      },
      {
        questionId: "fechaNacimientoMadre",
        questionText: "¿Cuál es la Fecha de nacimiento de la madre?",
        answerGiven: "1850",
        answerExpected: "30 de Octubre de 1551",
        isCorrect: false,
        fieldName: "Fecha de nacimiento de la madre"
      }
    ]
  }
];

// Fuzzy matching function to support actors memorizing.
// It normalizes accents, lowercases, removes punctuation, and checks if keys match closely.
export function checkAnswersLeniently(given: string, expected: string): boolean {
  const normalize = (str: string) => {
    return str
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove accents
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'¿¡]/g, "") // remove punctuation
      .replace(/\s+/g, " "); // collapse double-spaces
  };

  const normGiven = normalize(given);
  const normExpected = normalize(expected);

  if (!normGiven) return false;
  if (!normExpected) return false;

  // Exact normalized match
  if (normGiven === normExpected) return true;

  // Let's do a sub-word inclusion if expected is long-ish, or direct numerical conversion
  // E.g. expected is "ocho", given has "8"
  if (normExpected === "ocho" && (normGiven.includes("8") || normGiven === "8")) return true;
  if (normExpected === "cinco" && (normGiven.includes("5") || normGiven === "5")) return true;

  // If given is included in expected or vice versa (for short answers, check percentage similarity)
  if (normExpected.length > 5 && normGiven.length > 3) {
    if (normExpected.includes(normGiven) || normGiven.includes(normExpected)) {
      return true;
    }
  }

  // Levenshtein distance check or word matching check (if 70% of words overlap)
  const expectedWords = normExpected.split(" ");
  const givenWords = normGiven.split(" ");
  if (expectedWords.length >= 3) {
    let matches = 0;
    expectedWords.forEach(w => {
      if (givenWords.includes(w) && w.length > 2) {
        matches++;
      }
    });
    // If more than 50% of the important words match, count as correct
    if (matches / expectedWords.filter(w => w.length > 2).length >= 0.5) {
      return true;
    }
  }

  return false;
}
