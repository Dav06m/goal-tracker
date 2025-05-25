import { writable, derived } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import { PUBLIC_API_URL } from '$env/static/public';

function generateSuggestions(goal) {
  const suggestionsByCategory = {
    personal: [
      "Set aside 30 minutes each day to work on this goal",
      "Share your goal with a friend for accountability",
      "Break this goal down into smaller weekly targets"
    ],
    work: [
      "Schedule a specific time block in your calendar for this task",
      "Use the Pomodoro technique (25min work, 5min break) to make progress",
      "Create a distraction-free environment when working on this goal"
    ],
    health: [
      "Track your progress with a dedicated health app",
      "Find a workout buddy to keep you motivated",
      "Prepare your gym clothes the night before to remove friction"
    ],
    finance: [
      "Set up an automatic transfer to a dedicated savings account",
      "Review your progress weekly and adjust your budget as needed",
      "Use a spending tracker app to identify areas where you can cut back"
    ],
    learning: [
      "Use spaced repetition techniques to retain what you learn",
      "Teach someone else what you've learned to solidify your understanding",
      "Join an online community related to what you're learning"
    ],
    other: [
      "Review your goal weekly and adjust your approach as needed",
      "Create a visual reminder of your goal somewhere you'll see daily",
      "Celebrate small wins to maintain motivation"
    ]
  };

  const categorySuggestions = suggestionsByCategory[goal.category] || suggestionsByCategory.other;
  
  return categorySuggestions.map((text, index) => ({
    id: `${goal.id}-suggestion-${index + 1}`,
    text,
    type: index === 0 ? 'action' : index === 1 ? 'tip' : 'resource',
    applied: false
  }));
}

const initialGoals = [
  {
    id: '1',
    title: 'Learn SvelteKit',
    description: 'Master SvelteKit framework for web development projects',
    category: 'learning',
    priority: 'high',
    status: 'in-progress',
    progress: 35,
    createdAt: new Date('2023-06-01'),
    startDate: new Date('2023-06-05'),
    dueDate: new Date('2023-08-31'),
    milestones: [
      { id: '1-1', title: 'Complete official tutorial', completed: true },
      { id: '1-2', title: 'Build a simple CRUD app', completed: true },
      { id: '1-3', title: 'Implement authentication', completed: false },
      { id: '1-4', title: 'Learn server-side rendering', completed: false }
    ],
    suggestions: []
  },
  {
    id: '2',
    title: 'Exercise 3 times a week',
    description: 'Maintain a consistent workout routine for better health',
    category: 'health',
    priority: 'medium',
    status: 'in-progress',
    progress: 50,
    createdAt: new Date('2023-05-15'),
    startDate: new Date('2023-05-20'),
    dueDate: new Date('2023-12-31'),
    milestones: [
      { id: '2-1', title: 'Join a gym', completed: true },
      { id: '2-2', title: 'Create a workout plan', completed: true },
      { id: '2-3', title: 'Consistency for 1 month', completed: false }
    ],
    suggestions: []
  },
  {
    id: '3',
    title: 'Save $5000 for vacation',
    description: 'Put aside money each month for a trip to Europe',
    category: 'finance',
    priority: 'medium',
    status: 'in-progress',
    progress: 65,
    createdAt: new Date('2023-01-10'),
    startDate: new Date('2023-01-15'),
    dueDate: new Date('2023-11-30'),
    milestones: [
      { id: '3-1', title: 'Set up a separate savings account', completed: true },
      { id: '3-2', title: 'Save $1000', completed: true },
      { id: '3-3', title: 'Save $2500', completed: true },
      { id: '3-4', title: 'Save $5000', completed: false }
    ],
    suggestions: []
  }
];


initialGoals.forEach(goal => {
  goal.suggestions = generateSuggestions(goal);
});

function createGoalStore() {
  const { subscribe, set, update } = writable(initialGoals);
  
  return {
    subscribe,
    createGoal: (goalData) => {
      const newGoal = {
        ...goalData,
        id: uuidv4(),
        createdAt: new Date(),
        suggestions: [],
        milestones: goalData.milestones || []
      };
      
      
      newGoal.suggestions = generateSuggestions(newGoal);
      
      update(goals => [...goals, newGoal]);
    },
    updateGoal: (id, updatedGoal) => {
      update(goals => 
        goals.map(goal => 
          goal.id === id 
            ? { 
                ...goal, 
                ...updatedGoal,
                suggestions: goal.category !== updatedGoal.category
                  ? [...goal.suggestions.filter(s => s.applied), ...generateSuggestions({...goal, ...updatedGoal}).slice(0, 3 - goal.suggestions.filter(s => s.applied).length)]
                  : goal.suggestions
              } 
            : goal
        )
      );
    },
    deleteGoal: (id) => {
      update(goals => goals.filter(goal => goal.id !== id));
    },
    updateGoalProgress: (id, progress) => {
      update(goals => 
        goals.map(goal => 
          goal.id === id 
            ? { ...goal, progress } 
            : goal
        )
      );
    },
    updateGoalStatus: (id, status) => {
      update(goals => 
        goals.map(goal => 
          goal.id === id 
            ? { 
                ...goal, 
                status, 
                completedDate: status === 'completed' ? new Date() : goal.completedDate,
                progress: status === 'completed' ? 100 : goal.progress
              } 
            : goal
        )
      );
    },
    addMilestone: (goalId, milestone) => {
      update(goals => 
        goals.map(goal => 
          goal.id === goalId 
            ? { 
                ...goal, 
                milestones: [...goal.milestones, milestone] 
              } 
            : goal
        )
      );
    },
    updateMilestone: (goalId, milestoneId, updates) => {
      update(goals => 
        goals.map(goal => 
          goal.id === goalId 
            ? { 
                ...goal, 
                milestones: goal.milestones.map(milestone => 
                  milestone.id === milestoneId 
                    ? { ...milestone, ...updates } 
                    : milestone
                ) 
              } 
            : goal
        )
      );
    },
    removeMilestone: (goalId, milestoneId) => {
      update(goals => 
        goals.map(goal => 
          goal.id === goalId 
            ? { 
                ...goal, 
                milestones: goal.milestones.filter(milestone => milestone.id !== milestoneId) 
              } 
            : goal
        )
      );
    },
    toggleMilestone: (goalId, milestoneId) => {
      update(goals => 
        goals.map(goal => 
          goal.id === goalId 
            ? { 
                ...goal, 
                milestones: goal.milestones.map(milestone => 
                  milestone.id === milestoneId 
                    ? { ...milestone, completed: !milestone.completed } 
                    : milestone
                ),
                progress: goal.milestones.length > 0
                  ? Math.round(((goal.milestones.filter(m => m.id !== milestoneId || !m.completed).length + 
                      (goal.milestones.find(m => m.id === milestoneId)?.completed ? 0 : 1)) / 
                      goal.milestones.length) * 100)
                  : goal.progress
              } 
            : goal
        )
      );
    },
    applySuggestion: (goalId, suggestionId) => {
      update(goals => 
        goals.map(goal => 
          goal.id === goalId 
            ? { 
                ...goal, 
                suggestions: goal.suggestions.map(suggestion => 
                  suggestion.id === suggestionId 
                    ? { ...suggestion, applied: true } 
                    : suggestion
                ) 
              } 
            : goal
        )
      );
    }
  };
}

export const goals = createGoalStore();


export const goalStats = derived(goals, $goals => {
  const total = $goals.length;
  const completed = $goals.filter(g => g.status === 'completed').length;
  const inProgress = $goals.filter(g => g.status === 'in-progress').length;
  const notStarted = $goals.filter(g => g.status === 'not-started').length;
  const onHold = $goals.filter(g => g.status === 'on-hold').length;
  
  const completionRate = total > 0 ? (completed / total) * 100 : 0;
  
  return {
    total,
    completed,
    inProgress,
    notStarted,
    onHold,
    completionRate: Math.round(completionRate)
  };
});