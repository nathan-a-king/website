import { describe, it, expect } from 'vitest';
import { skillsData, getAllSkills, getSkillsByCategory } from '../skills';

describe('Skills', () => {
  describe('skillsData', () => {
    it('should export skills data', () => {
      expect(skillsData).toBeDefined();
      expect(Array.isArray(skillsData)).toBe(true);
    });

    it('should have multiple skill categories', () => {
      expect(skillsData.length).toBeGreaterThan(0);
    });

    it('should have correct structure for each category', () => {
      skillsData.forEach(category => {
        expect(category).toHaveProperty('category');
        expect(category).toHaveProperty('skills');
        expect(typeof category.category).toBe('string');
        expect(Array.isArray(category.skills)).toBe(true);
      });
    });

    it('should have correct structure for each skill', () => {
      skillsData.forEach(category => {
        category.skills.forEach(skill => {
          expect(skill).toHaveProperty('name');
          expect(skill).toHaveProperty('level');
          expect(typeof skill.name).toBe('string');
          expect(typeof skill.level).toBe('number');
          expect(skill.level).toBeGreaterThanOrEqual(0);
          expect(skill.level).toBeLessThanOrEqual(100);
        });
      });
    });

    it('should include Programming Languages category', () => {
      const category = skillsData.find(cat => cat.category === 'Programming Languages');
      expect(category).toBeDefined();
      expect(category.skills.length).toBeGreaterThan(0);
    });

    it('should include Frontend Technologies category', () => {
      const category = skillsData.find(cat => cat.category === 'Frontend Technologies');
      expect(category).toBeDefined();
      expect(category.skills.length).toBeGreaterThan(0);
    });

    it('should include Backend & Infrastructure category', () => {
      const category = skillsData.find(cat => cat.category === 'Backend & Infrastructure');
      expect(category).toBeDefined();
      expect(category.skills.length).toBeGreaterThan(0);
    });

    it('should include AI & Machine Learning category', () => {
      const category = skillsData.find(cat => cat.category === 'AI & Machine Learning');
      expect(category).toBeDefined();
      expect(category.skills.length).toBeGreaterThan(0);
    });

    it('should include Design & UX category', () => {
      const category = skillsData.find(cat => cat.category === 'Design & UX');
      expect(category).toBeDefined();
      expect(category.skills.length).toBeGreaterThan(0);
    });

    it('should include Soft Skills & Collaboration category', () => {
      const category = skillsData.find(cat => cat.category === 'Soft Skills & Collaboration');
      expect(category).toBeDefined();
      expect(category.skills.length).toBeGreaterThan(0);
    });
  });

  describe('getAllSkills', () => {
    it('should return all skills data', () => {
      const skills = getAllSkills();

      expect(skills).toBeDefined();
      expect(Array.isArray(skills)).toBe(true);
      expect(skills).toEqual(skillsData);
    });

    it('should return same reference as skillsData', () => {
      const skills = getAllSkills();
      expect(skills).toBe(skillsData);
    });

    it('should return array with all categories', () => {
      const skills = getAllSkills();
      expect(skills.length).toBeGreaterThanOrEqual(6);
    });
  });

  describe('getSkillsByCategory', () => {
    it('should return skills for Programming Languages category', () => {
      const skills = getSkillsByCategory('Programming Languages');

      expect(Array.isArray(skills)).toBe(true);
      expect(skills.length).toBeGreaterThan(0);
      expect(skills[0]).toHaveProperty('name');
      expect(skills[0]).toHaveProperty('level');
    });

    it('should return skills for Frontend Technologies category', () => {
      const skills = getSkillsByCategory('Frontend Technologies');

      expect(Array.isArray(skills)).toBe(true);
      expect(skills.length).toBeGreaterThan(0);
    });

    it('should return skills for Backend & Infrastructure category', () => {
      const skills = getSkillsByCategory('Backend & Infrastructure');

      expect(Array.isArray(skills)).toBe(true);
      expect(skills.length).toBeGreaterThan(0);
    });

    it('should return skills for AI & Machine Learning category', () => {
      const skills = getSkillsByCategory('AI & Machine Learning');

      expect(Array.isArray(skills)).toBe(true);
      expect(skills.length).toBeGreaterThan(0);
    });

    it('should return empty array for non-existent category', () => {
      const skills = getSkillsByCategory('Non-Existent Category');

      expect(Array.isArray(skills)).toBe(true);
      expect(skills.length).toBe(0);
    });

    it('should return empty array for null category', () => {
      const skills = getSkillsByCategory(null);
      expect(skills).toEqual([]);
    });

    it('should return empty array for undefined category', () => {
      const skills = getSkillsByCategory(undefined);
      expect(skills).toEqual([]);
    });

    it('should be case-sensitive', () => {
      const skills = getSkillsByCategory('programming languages'); // lowercase
      expect(skills).toEqual([]);
    });
  });

  describe('Specific Skills', () => {
    it('should include JavaScript in Programming Languages', () => {
      const skills = getSkillsByCategory('Programming Languages');
      const javascript = skills.find(s => s.name === 'JavaScript');

      expect(javascript).toBeDefined();
      expect(javascript.level).toBeGreaterThan(0);
    });

    it('should include React in Frontend Technologies', () => {
      const skills = getSkillsByCategory('Frontend Technologies');
      const react = skills.find(s => s.name === 'React');

      expect(react).toBeDefined();
      expect(react.level).toBeGreaterThan(0);
    });

    it('should include Node.js in Backend & Infrastructure', () => {
      const skills = getSkillsByCategory('Backend & Infrastructure');
      const nodejs = skills.find(s => s.name === 'Node.js');

      expect(nodejs).toBeDefined();
      expect(nodejs.level).toBeGreaterThan(0);
    });

    it('should include AI-Native Interaction Design in AI & Machine Learning', () => {
      const skills = getSkillsByCategory('AI & Machine Learning');
      const aiDesign = skills.find(s => s.name === 'AI-Native Interaction Design');

      expect(aiDesign).toBeDefined();
      expect(aiDesign.level).toBeGreaterThan(0);
    });
  });

  describe('Data Integrity', () => {
    it('should not have duplicate category names', () => {
      const categories = skillsData.map(cat => cat.category);
      const uniqueCategories = [...new Set(categories)];

      expect(categories.length).toBe(uniqueCategories.length);
    });

    it('should not have duplicate skill names within a category', () => {
      skillsData.forEach(category => {
        const skillNames = category.skills.map(s => s.name);
        const uniqueNames = [...new Set(skillNames)];

        expect(skillNames.length).toBe(uniqueNames.length);
      });
    });

    it('should have valid skill levels (0-100)', () => {
      skillsData.forEach(category => {
        category.skills.forEach(skill => {
          expect(skill.level).toBeGreaterThanOrEqual(0);
          expect(skill.level).toBeLessThanOrEqual(100);
        });
      });
    });

    it('should have non-empty skill names', () => {
      skillsData.forEach(category => {
        category.skills.forEach(skill => {
          expect(skill.name).toBeTruthy();
          expect(skill.name.trim().length).toBeGreaterThan(0);
        });
      });
    });

    it('should have non-empty category names', () => {
      skillsData.forEach(category => {
        expect(category.category).toBeTruthy();
        expect(category.category.trim().length).toBeGreaterThan(0);
      });
    });
  });
});
