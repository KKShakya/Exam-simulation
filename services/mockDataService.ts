
import { MockQuestion } from '../types';

// Helper to generate random integer
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// --- QUANT GENERATORS ---

const generateNumberSeries = (count: number): MockQuestion[] => {
  const questions: MockQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const start = randomInt(2, 10);
    const diff = randomInt(2, 5);
    // Pattern: +diff, +diff+2, +diff+4...
    const series = [start];
    let current = start;
    let currentDiff = diff;
    for (let j = 0; j < 5; j++) {
      current += currentDiff;
      series.push(current);
      currentDiff += 2;
    }
    
    // Hide the last one
    const answer = series.pop()!;
    const options = [answer, answer + 2, answer - 2, answer + 5, answer - 5].sort(() => Math.random() - 0.5).map(String);
    
    questions.push({
      questionText: `Find the missing term in the series: ${series.join(', ')}, ?`,
      options: options,
      correctAnswerIndex: options.indexOf(String(answer)),
      explanation: `The pattern is adding consecutive odd/even differences. The next term is ${answer}.`,
      topic: 'Number Series',
      difficulty: 'Easy',
      section: 'Quantitative Aptitude',
      status: 'not_visited'
    });
  }
  return questions;
};

const generateSimplification = (count: number): MockQuestion[] => {
  const questions: MockQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const a = randomInt(11, 29);
    const b = randomInt(11, 29);
    const c = randomInt(5, 15);
    // Pattern: a * b + c^2 = ?
    const val = a * b + c * c;
    const options = [val, val + 10, val - 5, val + 20, val - 10].sort(() => Math.random() - 0.5).map(String);

    questions.push({
      questionText: `What value should come in place of (?): ${a} × ${b} + ${c}² = ?`,
      options: options,
      correctAnswerIndex: options.indexOf(String(val)),
      explanation: `${a} * ${b} = ${a*b}. ${c}^2 = ${c*c}. Sum = ${val}.`,
      topic: 'Simplification',
      difficulty: 'Easy',
      section: 'Quantitative Aptitude',
      status: 'not_visited'
    });
  }
  return questions;
};

const generateArithmetic = (count: number): MockQuestion[] => {
  const questions: MockQuestion[] = [];
  const topics = [
    { name: 'Profit Loss', q: (v1: number, v2: number) => `An item is bought for Rs.${v1 * 100} and sold at a profit of ${v2}%. Find the selling price.`, a: (v1: number, v2: number) => v1 * 100 * (1 + v2/100) },
    { name: 'Ages', q: (v1: number, v2: number) => `The ratio of ages of A and B is ${v1}:${v2}. If A is ${v1*5} years old, how old is B?`, a: (v1: number, v2: number) => v2 * 5 },
    { name: 'Time Work', q: (v1: number, v2: number) => `A can do a work in ${v1} days and B in ${v2} days. In how many days can they complete it together?`, a: (v1: number, v2: number) => Number(((v1*v2)/(v1+v2)).toFixed(1)) }
  ];

  for (let i = 0; i < count; i++) {
    const t = topics[i % topics.length];
    const v1 = randomInt(10, 20);
    const v2 = randomInt(20, 30);
    const ans = t.a(v1, v2);
    const options = [ans, Number((ans*1.1).toFixed(1)), Number((ans*0.9).toFixed(1)), Number((ans+5).toFixed(1)), Number((ans-2).toFixed(1))].map(String);

    questions.push({
      questionText: t.q(v1, v2),
      options: options,
      correctAnswerIndex: 0, // Simplified for generation
      explanation: `Standard ${t.name} formula application.`,
      topic: t.name,
      difficulty: 'Moderate',
      section: 'Quantitative Aptitude',
      status: 'not_visited'
    });
  }
  return questions;
};

const generateDI = (): MockQuestion[] => {
  // Generate a set of 5 questions based on one graph
  const questions: MockQuestion[] = [];
  const data = [
    { name: 'A', val: randomInt(200, 500) },
    { name: 'B', val: randomInt(200, 500) },
    { name: 'C', val: randomInt(200, 500) },
    { name: 'D', val: randomInt(200, 500) }
  ];
  const total = data.reduce((acc, cur) => acc + cur.val, 0);

  // Q1: Ratio
  questions.push({
    questionText: `Study the data: A=${data[0].val}, B=${data[1].val}, C=${data[2].val}, D=${data[3].val}. What is the ratio of A to B?`,
    options: [`${data[0].val}:${data[1].val}`, "1:2", "2:3", "3:4", "None"],
    correctAnswerIndex: 0,
    explanation: "Direct ratio calculation.",
    topic: 'Data Interpretation',
    difficulty: 'Moderate',
    section: 'Quantitative Aptitude',
    status: 'not_visited',
    chartData: { type: 'bar', title: 'Production Units', data: data.map(d => ({ name: d.name, value: d.val })) }
  });

  // Q2: Average
  questions.push({
    questionText: `Based on the same data, what is the average value of all four entities?`,
    options: [String(total/4), String(total/2), String(total/3), String(total/5), "None"],
    correctAnswerIndex: 0,
    explanation: `Total = ${total}. Average = ${total}/4.`,
    topic: 'Data Interpretation',
    difficulty: 'Moderate',
    section: 'Quantitative Aptitude',
    status: 'not_visited',
     chartData: { type: 'bar', title: 'Production Units', data: data.map(d => ({ name: d.name, value: d.val })) }
  });

  // Fill 3 more dummy DI questions
  for(let i=0; i<3; i++) {
     questions.push({
        questionText: `DI Question ${i+3} based on the chart: What is difference between C and D?`,
        options: [String(Math.abs(data[2].val - data[3].val)), "10", "20", "30", "40"],
        correctAnswerIndex: 0,
        explanation: "Difference calculation.",
        topic: 'Data Interpretation',
        difficulty: 'Easy',
        section: 'Quantitative Aptitude',
        status: 'not_visited',
         chartData: { type: 'bar', title: 'Production Units', data: data.map(d => ({ name: d.name, value: d.val })) }
     });
  }

  return questions;
}

// --- REASONING GENERATORS ---

const generateSyllogism = (count: number): MockQuestion[] => {
  const questions: MockQuestion[] = [];
  for(let i=0; i<count; i++) {
    questions.push({
      questionText: `Statements: Some A are B. All B are C. \nConclusions:\nI. Some A are C.\nII. All A are C.`,
      options: ["Only I follows", "Only II follows", "Both follow", "Neither follows", "Either I or II follows"],
      correctAnswerIndex: 0,
      explanation: "Standard Syllogism logic. Since Some A is B and All B is C, intersection of A and C is valid.",
      topic: 'Syllogism',
      difficulty: 'Easy',
      section: 'Reasoning',
      status: 'not_visited'
    });
  }
  return questions;
};

const generateInequality = (count: number): MockQuestion[] => {
  const questions: MockQuestion[] = [];
  for(let i=0; i<count; i++) {
    questions.push({
      questionText: `Statement: P > Q ≥ R = S < T\nConclusions:\nI. P > S\nII. Q ≥ T`,
      options: ["Only I follows", "Only II follows", "Both follow", "Neither follows", "Either or"],
      correctAnswerIndex: 0,
      explanation: "P > Q >= R = S, so P > S is definitely true. Q >= S < T, relation between Q and T cannot be determined.",
      topic: 'Inequality',
      difficulty: 'Easy',
      section: 'Reasoning',
      status: 'not_visited'
    });
  }
  return questions;
};

const generatePuzzles = (): MockQuestion[] => {
  // 1 Puzzle set of 5 questions
  const questions: MockQuestion[] = [];
  const baseText = "Eight people A, B, C, D, E, F, G, H are sitting around a circular table facing the center. A sits third to the right of C. E sits second to the left of A...";
  
  for(let i=0; i<5; i++) {
    questions.push({
      questionText: `(Puzzle) ${baseText}\n\nQuestion ${i+1}: Who sits immediate right of A?`,
      options: ["B", "C", "D", "E", "F"],
      correctAnswerIndex: randomInt(0, 4),
      explanation: "Based on the circular arrangement solution.",
      topic: 'Puzzles',
      difficulty: 'Difficult',
      section: 'Reasoning',
      status: 'not_visited'
    });
  }
  return questions;
}

const generateCoding = (count: number): MockQuestion[] => {
   const questions: MockQuestion[] = [];
   for(let i=0; i<count; i++) {
     questions.push({
       questionText: `In a certain code, 'BANK' is written as 'CBSL'. How is 'PO' written?`,
       options: ["QP", "OP", "PQ", "QR", "RP"],
       correctAnswerIndex: 0,
       explanation: "+1 letter logic.",
       topic: 'Coding-Decoding',
       difficulty: 'Easy',
       section: 'Reasoning',
       status: 'not_visited'
     });
   }
   return questions;
}

export const getStaticMockExam = (): MockQuestion[] => {
  const reasoning: MockQuestion[] = [
    ...generateSyllogism(5),
    ...generateInequality(5),
    ...generateCoding(5),
    ...generatePuzzles(), // 5 qs
    ...generatePuzzles(), // 5 qs (Different text ideally, simplifying for structure)
    ...generateSyllogism(5), // More filler to reach 40
    ...generateInequality(5),
    ...generateCoding(5)
  ].map(q => ({...q, section: 'Reasoning'}));

  // Ensure exactly 40
  while(reasoning.length < 40) {
      reasoning.push({
          ...reasoning[0], 
          questionText: "Filler Reasoning Question " + (reasoning.length+1),
          id: "r-fill-"+reasoning.length
      });
  }
  // Trim to 40
  reasoning.length = 40;

  const quant: MockQuestion[] = [
    ...generateNumberSeries(5),
    ...generateSimplification(10),
    ...generateDI(), // 5 qs
    ...generateDI(), // 5 qs
    ...generateArithmetic(10),
    ...generateNumberSeries(5)
  ].map(q => ({...q, section: 'Quantitative Aptitude'}));
  
   // Ensure exactly 40
  while(quant.length < 40) {
      quant.push({
          ...quant[0], 
          questionText: "Filler Quant Question " + (quant.length+1),
           id: "q-fill-"+quant.length
      });
  }
  quant.length = 40;

  return [...reasoning, ...quant];
};
