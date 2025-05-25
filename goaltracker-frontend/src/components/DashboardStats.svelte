<script>
  import { PUBLIC_API_URL } from '$env/static/public'
  import { goals } from '../stores/goalStore.js';
  
  $: totalGoals = $goals.length;
  $: completedGoals = $goals.filter(g => g.status === 'completed').length;
  $: inProgressGoals = $goals.filter(g => g.status === 'in-progress').length;
  $: completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
  
  $: averageProgress = totalGoals > 0 
    ? Math.round($goals.reduce((sum, goal) => sum + goal.progress, 0) / totalGoals) 
    : 0;
</script>

<div class="stats-container">
  <div class="stat-card">
    <div class="stat-value">{totalGoals}</div>
    <div class="stat-label">Total Goals</div>
  </div>
  
  <div class="stat-card">
    <div class="stat-value">{completedGoals}</div>
    <div class="stat-label">Completed</div>
  </div>
  
  <div class="stat-card">
    <div class="stat-value">{inProgressGoals}</div>
    <div class="stat-label">In Progress</div>
  </div>
  
  <div class="stat-card">
    <div class="stat-value">{completionRate}%</div>
    <div class="stat-label">Completion Rate</div>
  </div>
  
  <div class="stat-card">
    <div class="stat-value">{averageProgress}%</div>
    <div class="stat-label">Average Progress</div>
  </div>
</div>

<style>
  .stats-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-3);
    margin-bottom: var(--space-5);
  }
  
  .stat-card {
    background-color: var(--color-card);
    border-radius: 10px;
    padding: var(--space-3);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .stat-value {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--color-primary);
    margin-bottom: var(--space-1);
  }
  
  .stat-label {
    font-size: 0.875rem;
    color: var(--color-text-light);
    text-align: center;
  }
  
  @media (min-width: 640px) {
    .stats-container {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  
  @media (min-width: 1024px) {
    .stats-container {
      grid-template-columns: repeat(5, 1fr);
    }
  }
</style>