// Skills data with proficiency levels (0-100)
export const skillsData = [
  // Programming Languages
  {
    category: "Programming Languages",
    skills: [
      { name: "JavaScript", level: 90 },
      { name: "TypeScript", level: 90 },
      { name: "Python", level: 85 },
      { name: "Java", level: 80 },
      { name: "SQL", level: 80 },
      { name: "C++", level: 50 }
    ]
  },
  // Frontend Technologies
  {
    category: "Frontend Technologies",
    skills: [
      { name: "React", level: 90 },
      { name: "Next.js", level: 85 },
      { name: "HTML/CSS", level: 90 },
      { name: "Tailwind CSS", level: 90 },
      { name: "Vite", level: 80 }
    ]
  },
  // Backend & Infrastructure
  {
    category: "Backend & Infrastructure",
    skills: [
      { name: "Node.js", level: 90 },
      { name: "Express.js", level: 85 },
      { name: "PostgreSQL", level: 80 },
      { name: "MongoDB", level: 60 },
      { name: "Bedrock", level: 60 },
      { name: "AWS", level: 45 }
    ]
  },
  // AI & Machine Learning
  {
    category: "AI & Machine Learning",
    skills: [
      { name: "AI-Native Interaction Design", level: 95 },
      { name: "Prompt Engineering", level: 90 },
      { name: "RAG Systems", level: 85 },
      { name: "Vector Databases", level: 80 },
      { name: "Ragas", level: 80 },
      { name: "LangChain", level: 75 }
    ]
  },
  // Design & UX
  {
    category: "Design & UX",
    skills: [
      { name: "UI/UX Design", level: 85 },
      { name: "User Research", level: 75 },
      { name: "Prototyping", level: 80 },
      { name: "Design Systems", level: 85 }
    ]
  },
  // Soft Skills & Collaboration
  {
    category: "Soft Skills & Collaboration",
    skills: [
      { name: "Communication", level: 90 },
      { name: "Teamwork", level: 85 },
      { name: "Problem Solving", level: 90 },
      { name: "Adaptability", level: 80 }
    ]
  }
];

export const getAllSkills = () => skillsData;

export const getSkillsByCategory = (category) => {
  const categoryData = skillsData.find(cat => cat.category === category);
  return categoryData ? categoryData.skills : [];
};