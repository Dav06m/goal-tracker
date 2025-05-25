import { PUBLIC_API_URL } from '$env/static/public';
<script>
  import { onMount } from 'svelte';
  import { goals } from '../stores/goalStore.js';
  import DashboardStats from '../components/DashboardStats.svelte';
  import GoalPreview from '../components/GoalPreview.svelte';
  import SuggestionCard from '../components/SuggestionCard.svelte';
  
  let upcomingGoals = [];
  let recentGoals = [];
  let generalSuggestion = {
    id: 'general-1',
    text: 'Consider setting up weekly reviews for your goals to maintain momentum',
    type: 'tip'
  };
  
  $: {
    // ordina goal per data
    upcomingGoals = [...$goals]
      .filter(goal => goal.status !== 'completed' && goal.dueDate)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 3);
    
    // ottieni i goal recenti
    recentGoals = [...$goals]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);
  }
</script>

<svelte:head>
  <title>Dashboard | Goal Tracker</title>
</svelte:head>

<section class="dashboard">
  <h1>Dashboard</h1>
  
  <DashboardStats />
  
  <div class="dashboard-section">
    <div class="section-header">
      <h2>Upcoming Goals</h2>
      <a href="/goals" class="view-all">View all</a>
    </div>
    
    {#if upcomingGoals.length > 0}
      <div class="goal-grid">
        {#each upcomingGoals as goal}
          <GoalPreview {goal} />
        {/each}
      </div>
    {:else}
      <p class="empty-state">No upcoming goals. <a href="/goals/create">Create one</a>?</p>
    {/if}
  </div>
  
  <div class="dashboard-section">
    <div class="section-header">
      <h2>Recent Goals</h2>
      <a href="/goals" class="view-all">View all</a>
    </div>
    
    {#if recentGoals.length > 0}
      <div class="goal-grid">
        {#each recentGoals as goal}
          <GoalPreview {goal} />
        {/each}
      </div>
    {:else}
      <p class="empty-state">No goals yet. <a href="/goals/create">Create your first goal</a>?</p>
    {/if}
  </div>
  
  <div class="dashboard-section">
    <h2>Goal Insights</h2>
    <SuggestionCard suggestion={generalSuggestion} />
  </div>
</section>

<style>
  .dashboard {
    padding: var(--space-4) 0;
  }
  
  .dashboard-section {
    margin-bottom: var(--space-6);
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-4);
  }
  
  .view-all {
    color: var(--color-primary);
    font-size: 0.875rem;
    text-decoration: none;
    font-weight: 500;
  }
  
  .view-all:hover {
    text-decoration: underline;
  }
  
  .goal-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: var(--space-4);
  }
  
  .empty-state {
    padding: var(--space-4);
    background-color: var(--color-card);
    border-radius: 8px;
    text-align: center;
    color: var(--color-text-light);
  }
  
  .empty-state a {
    color: var(--color-primary);
    text-decoration: none;
    font-weight: 500;
  }
  
  .empty-state a:hover {
    text-decoration: underline;
  }
  
  @media (min-width: 640px) {
    .goal-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (min-width: 1024px) {
    .goal-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>