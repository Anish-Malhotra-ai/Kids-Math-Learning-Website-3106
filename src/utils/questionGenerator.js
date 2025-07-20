export const generateQuestions = (topic, count) => {
  const questions = [];
  
  for (let i = 0; i < count; i++) {
    let question;
    
    switch (topic) {
      case 'Addition':
        question = generateAddition();
        break;
      case 'Subtraction':
        question = generateSubtraction();
        break;
      case 'Multiplication':
        question = generateMultiplication();
        break;
      case 'Division':
        question = generateDivision();
        break;
      case 'Fractions':
        question = generateFractions();
        break;
      case 'Times Tables':
        question = generateTimesTables();
        break;
      default:
        question = generateAddition();
    }
    
    question.id = `${topic.toLowerCase()}_${i}_${Date.now()}`;
    questions.push(question);
  }
  
  return questions;
};

const generateAddition = () => {
  const difficulties = [
    // 1-digit + 1-digit
    () => {
      const a = Math.floor(Math.random() * 9) + 1;
      const b = Math.floor(Math.random() * 9) + 1;
      return { question: `What is ${a} + ${b}?`, answer: a + b };
    },
    // 2-digit + 2-digit
    () => {
      const a = Math.floor(Math.random() * 90) + 10;
      const b = Math.floor(Math.random() * 90) + 10;
      return { question: `What is ${a} + ${b}?`, answer: a + b };
    },
    // 3-digit + 3-digit
    () => {
      const a = Math.floor(Math.random() * 900) + 100;
      const b = Math.floor(Math.random() * 900) + 100;
      return { question: `What is ${a} + ${b}?`, answer: a + b };
    },
    // 4-digit + 4-digit
    () => {
      const a = Math.floor(Math.random() * 9000) + 1000;
      const b = Math.floor(Math.random() * 9000) + 1000;
      return { question: `What is ${a} + ${b}?`, answer: a + b };
    }
  ];
  
  return difficulties[Math.floor(Math.random() * difficulties.length)]();
};

const generateSubtraction = () => {
  const difficulties = [
    // 1-digit - 1-digit
    () => {
      const a = Math.floor(Math.random() * 9) + 1;
      const b = Math.floor(Math.random() * a) + 1;
      return { question: `What is ${a} - ${b}?`, answer: a - b };
    },
    // 2-digit - 1-digit
    () => {
      const a = Math.floor(Math.random() * 90) + 10;
      const b = Math.floor(Math.random() * 9) + 1;
      return { question: `What is ${a} - ${b}?`, answer: a - b };
    },
    // 3-digit - 2-digit
    () => {
      const a = Math.floor(Math.random() * 900) + 100;
      const b = Math.floor(Math.random() * 90) + 10;
      return { question: `What is ${a} - ${b}?`, answer: a - b };
    },
    // 4-digit - 3-digit
    () => {
      const a = Math.floor(Math.random() * 9000) + 1000;
      const b = Math.floor(Math.random() * 900) + 100;
      return { question: `What is ${a} - ${b}?`, answer: a - b };
    }
  ];
  
  return difficulties[Math.floor(Math.random() * difficulties.length)]();
};

const generateMultiplication = () => {
  const difficulties = [
    // Single-digit × single-digit
    () => {
      const a = Math.floor(Math.random() * 9) + 1;
      const b = Math.floor(Math.random() * 9) + 1;
      return { question: `What is ${a} × ${b}?`, answer: a * b };
    },
    // 2-digit × single-digit
    () => {
      const a = Math.floor(Math.random() * 90) + 10;
      const b = Math.floor(Math.random() * 9) + 1;
      return { question: `What is ${a} × ${b}?`, answer: a * b };
    },
    // 2-digit × 2-digit
    () => {
      const a = Math.floor(Math.random() * 90) + 10;
      const b = Math.floor(Math.random() * 90) + 10;
      return { question: `What is ${a} × ${b}?`, answer: a * b };
    },
    // 3-digit × 1-digit
    () => {
      const a = Math.floor(Math.random() * 900) + 100;
      const b = Math.floor(Math.random() * 9) + 1;
      return { question: `What is ${a} × ${b}?`, answer: a * b };
    }
  ];
  
  return difficulties[Math.floor(Math.random() * difficulties.length)]();
};

const generateDivision = () => {
  const difficulties = [
    // 2-digit ÷ 1-digit
    () => {
      const divisor = Math.floor(Math.random() * 9) + 2;
      const quotient = Math.floor(Math.random() * 15) + 1;
      const dividend = divisor * quotient;
      return { question: `What is ${dividend} ÷ ${divisor}?`, answer: quotient };
    },
    // 3-digit ÷ 1-digit
    () => {
      const divisor = Math.floor(Math.random() * 9) + 2;
      const quotient = Math.floor(Math.random() * 150) + 10;
      const dividend = divisor * quotient;
      return { question: `What is ${dividend} ÷ ${divisor}?`, answer: quotient };
    }
  ];
  
  return difficulties[Math.floor(Math.random() * difficulties.length)]();
};

const generateFractions = () => {
  const operations = [
    // Simple addition with same denominator
    () => {
      const denominator = Math.floor(Math.random() * 8) + 2;
      const num1 = Math.floor(Math.random() * (denominator - 1)) + 1;
      const num2 = Math.floor(Math.random() * (denominator - num1)) + 1;
      return {
        question: `What is ${num1}/${denominator} + ${num2}/${denominator}? (Enter as decimal)`,
        answer: Number(((num1 + num2) / denominator).toFixed(2))
      };
    },
    // Convert fraction to decimal
    () => {
      const denominators = [2, 4, 5, 8, 10];
      const denominator = denominators[Math.floor(Math.random() * denominators.length)];
      const numerator = Math.floor(Math.random() * denominator) + 1;
      return {
        question: `What is ${numerator}/${denominator} as a decimal?`,
        answer: Number((numerator / denominator).toFixed(2))
      };
    },
    // Fraction comparison
    () => {
      const fractions = [
        { num: 1, den: 2, val: 0.5 },
        { num: 1, den: 3, val: 0.33 },
        { num: 2, den: 3, val: 0.67 },
        { num: 1, den: 4, val: 0.25 },
        { num: 3, den: 4, val: 0.75 },
        { num: 1, den: 5, val: 0.2 },
        { num: 2, den: 5, val: 0.4 },
        { num: 3, den: 5, val: 0.6 },
        { num: 4, den: 5, val: 0.8 }
      ];
      
      const frac1 = fractions[Math.floor(Math.random() * fractions.length)];
      const frac2 = fractions[Math.floor(Math.random() * fractions.length)];
      
      if (frac1.val > frac2.val) {
        return {
          question: `Which is bigger: ${frac1.num}/${frac1.den} or ${frac2.num}/${frac2.den}? (Enter 1 for first, 2 for second)`,
          answer: 1
        };
      } else if (frac2.val > frac1.val) {
        return {
          question: `Which is bigger: ${frac1.num}/${frac1.den} or ${frac2.num}/${frac2.den}? (Enter 1 for first, 2 for second)`,
          answer: 2
        };
      } else {
        return {
          question: `Are ${frac1.num}/${frac1.den} and ${frac2.num}/${frac2.den} equal? (Enter 1 for yes, 0 for no)`,
          answer: 1
        };
      }
    },
    // Simple addition with different denominators
    () => {
      const commonDenominators = [[2, 4], [3, 6], [4, 8], [5, 10]];
      const pair = commonDenominators[Math.floor(Math.random() * commonDenominators.length)];
      const den1 = pair[0];
      const den2 = pair[1];
      const num1 = Math.floor(Math.random() * den1) + 1;
      const num2 = Math.floor(Math.random() * den2) + 1;
      const result = (num1 / den1) + (num2 / den2);
      return {
        question: `What is ${num1}/${den1} + ${num2}/${den2}? (Enter as decimal)`,
        answer: Number(result.toFixed(2))
      };
    }
  ];
  
  return operations[Math.floor(Math.random() * operations.length)]();
};

const generateTimesTables = () => {
  const modes = [
    // Random question mode
    () => {
      const table = Math.floor(Math.random() * 11) + 2;
      const multiplier = Math.floor(Math.random() * 12) + 1;
      return {
        question: `What is ${table} × ${multiplier}?`,
        answer: table * multiplier,
        type: 'single'
      };
    },
    // Reverse lookup mode
    () => {
      const table = Math.floor(Math.random() * 11) + 2;
      const multiplier = Math.floor(Math.random() * 12) + 1;
      const result = table * multiplier;
      return {
        question: `What times ${table} gives ${result}?`,
        answer: multiplier,
        type: 'single'
      };
    }
  ];
  
  return modes[Math.floor(Math.random() * modes.length)]();
};

// Special function for generating full times tables
export const generateFullTimesTable = () => {
  const table = Math.floor(Math.random() * 11) + 2;
  const questions = [];
  
  for (let i = 1; i <= 10; i++) {
    questions.push({
      id: `table_${table}_${i}_${Date.now()}`,
      question: `${table} × ${i} = `,
      answer: table * i,
      multiplier: i,
      table: table,
      type: 'table'
    });
  }
  
  return {
    table: table,
    questions: questions,
    type: 'full_table'
  };
};