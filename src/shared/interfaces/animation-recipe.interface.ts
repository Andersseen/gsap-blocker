export type AnimationDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface AnimationRecipe {
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: AnimationDifficulty;
  angularConcepts: string[];
  gsapConcepts: string[];
  accessibility: string[];
  performance: string[];
}

export default AnimationRecipe;
