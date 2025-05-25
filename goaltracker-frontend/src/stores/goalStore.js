import { writable, derived } from 'svelte/store';
import { PUBLIC_API_URL } from '$env/static/public';

function createGoalStore() {
  const { subscribe, set, update } = writable([]);

  const fetchGoals = async () => {
    const res = await fetch(`${PUBLIC_API_URL}/api/goals`);
    const data = await res.json();
    set(data);
  };

  const createGoal = async (goal) => {
    const res = await fetch(`${PUBLIC_API_URL}/api/goals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goal)
    });
    const newGoal = await res.json();
    update(goals => [...goals, newGoal]);
  };

  const updateGoal = async (id, updates) => {
    await fetch(`${PUBLIC_API_URL}/api/goals/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    fetchGoals(); // refetch to sync
  };

  const deleteGoal = async (id) => {
    await fetch(`${PUBLIC_API_URL}/api/goals/${id}`, {
      method: 'DELETE'
    });
    update(goals => goals.filter(goal => goal._id !== id));
  };

  return {
    subscribe,
    fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal
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
