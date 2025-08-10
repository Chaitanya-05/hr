export const assessmentQuestions: Record<keyof Employee["assessment_answers"], string> = {
  q1: "What interests you about building AI-based products for HR technology, and why do you want to work in this area?",
  q2: "What motivates you to put forth your best effort at work or on a project?",
  q3: "If you find yourself assigned repetitive or uninteresting tasks, how do you keep yourself motivated to complete them?",
  q4: "Describe a time when you went above and beyond what was expected to achieve a goal. What drove you to do that, and what was the result?",
  q5: "Tell me about a challenging situation (in a project, job, or at university) that you faced and how you handled it.",
  q6: "How do you handle stress or pressure when working under tight deadlines or difficult conditions?",
  q7: "How do you typically respond to constructive criticism or negative feedback on your work?",
  q8: "Describe a time you failed to meet a goal or made a significant mistake. How did you handle the situation, and what did you learn from it?",
  q9: "Give an example of a time when you had to quickly adapt to a major change, or learn a new skill or technology in a short time. How did you manage it?",
  q10: "Tell me about a time you had to make an important decision quickly, even with limited information. What was the situation and what did you do?",
  q11: "Tell me about a time you had a conflict or disagreement with a team member (or fellow student). How did you handle it, and what was the outcome?",
  q12: "Have you ever disagreed with a decision made by your manager or superior? How did you approach the situation?",
  q13: "Have you ever been in a team or class project where people around you were very negative or demotivated? How did you react, and what did you do in that environment?",
  q14: "Where do you hope to be in your career one year from now? How about in five years?",
  q15: "How would you define success in your career?",
  q16: "Technology evolves quickly, especially in AI. How do you keep yourself updated with new skills or trends? Can you give an example of a new skill or tech you recently learned on your own?",
  q17: "Do you have any plans to pursue further education or certifications in the near future (say, within the next couple of years)? Please explain why or why not.",
  q18: "What would motivate you to stay with a company for 5 years or more?",
  q19: "Would you rather choose a job with a higher salary but a poor (toxic) work environment, or a job with a lower salary but an excellent work culture? Why?",
  q20: "What is your biggest dream or aspiration in life?"
};


export type Employee = {
    _id?: string;
  name: string;
  email: string;
  role: string;
  assessment_submitted: boolean;
  assessment_answers: {
    q1: string;
    q2: string;
    q3: string;
    q4: string;
    q5: string;
    q6: string;
    q7: string;
    q8: string;
    q9: string;
    q10: string;
    q11: string;
    q12: string;
    q13: string;
    q14: string;
    q15: string;
    q16: string;
    q17: string;
    q18: string;
    q19: string;
    q20: string;
  };
  tags: string[];
  culture: string;
  learning: string;
  interest: string;
  goals: string;
  submission_date?: string;
  learning_score?: number;
  createdAt?: string;
  updated_at?: string;
};
