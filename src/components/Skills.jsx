import React from 'react';
import SkillBar from './SkillBar';
import { getAllSkills } from '../utils/skills';

export default function Skills() {
  const skillsData = getAllSkills();

  return (
    <section className="py-24 px-6 sm:px-10">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl mb-12 text-center text-brand-text-primary">
          Skills & Expertise
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillsData.map((category, categoryIndex) => (
            <div key={category.category} className="bg-brand-surface border border-brand-border p-6 rounded-lg transition-colors shadow-card">
              <h3 className="text-lg font-semibold mb-6 text-brand-text-primary pb-2 border-b border-brand-border">
                {category.category}
              </h3>
              
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <SkillBar
                    key={skill.name}
                    name={skill.name}
                    level={skill.level}
                    delay={categoryIndex * 100 + skillIndex * 50}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
