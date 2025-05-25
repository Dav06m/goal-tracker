export type GoalCategory = 'personal' | 'work' | 'health' | 'finance' | 'learning' | 'other';

export type GoalStatus = 'not-started' | 'in-progress' | 'on-hold' | 'completed';

export type GoalPriority = 'low' | 'medium' | 'high';

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
}

export interface Suggestion {
  id: string;
  text: string;
  type: 'action' | 'resource' | 'tip';
  applied?: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  priority: GoalPriority;
  status: GoalStatus;
  progress: number; // 0-100
  createdAt: Date;
  startDate?: Date;
  dueDate?: Date;
  completedDate?: Date;
  milestones: Milestone[];
  suggestions: Suggestion[];
}