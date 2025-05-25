<script>
  import { PUBLIC_API_URL } from '$env/static/public';
  import { onMount } from 'svelte';
  import { goals } from '../../../stores/goalStore.js';
  import { format } from 'date-fns';
  import MilestoneList from '../../../components/MilestoneList.svelte';
  import SuggestionList from '../../../components/SuggestionList.svelte';
  
  export let data;
  
  let goal;
  let notFound = false;
  
  onMount(() => {
    goal = $goals.find(g => g.id === data.id);
    if (!goal) {
      notFound = true;
    }
  });
  
  function updateProgress(event) {
    const newProgress = event.detail;
    goals.updateGoalProgress(goal.id, newProgress);
  }
  
  function markComplete() {
    goals.updateGoalStatus(goal.id, 'completed');
  }
  
  function getStatusClass(status) {
    switch(status) {
      case 'not-started': return 'badge';
      case 'in-progress': return 'badge primary';
      case 'on-hold': return 'badge warning';
      case 'completed': return 'badge success';
      default: return 'badge';
    }
  }
  
  function getPriorityClass(priority) {
    switch(priority) {
      case 'low': return 'text-success';
      case 'medium': return 'text-warning';
      case 'high': return 'text-error';
      default: return '';
    }
  }
</script>

<svelte:head>
  <title>{goal ? goal.title : 'Goal Details'} | Goal Tracker</title>
</svelte:head>

{#if notFound}
  <div class="not-found">
    <h2>Goal Not Found</h2>
    <p>The goal you're looking for doesn't exist or has been deleted.</p>
    <a href="/goals" class="button">Back to Goals</a>
  </div>
{:else if goal}
  <section class="goal-detail">
    <header class="page-header">
      <div>
        <h1>{goal.title}</h1>
        <div class="meta-badges">
          <span class={getStatusClass(goal.status)}>{goal.status}</span>
          <span class="badge">{goal.category}</span>
          <span class={`priority ${getPriorityClass(goal.priority)}`}>
            {goal.priority} priority
          </span>
        </div>
      </div>
      
      <div class="actions">
        <a href={`/goals/${goal.id}/edit`} class="button">Edit</a>
        {#if goal.status !== 'completed'}
          <button class="button secondary" on:click={markComplete}>Mark Complete</button>
        {/if}
      </div>
    </header>
    
    <div class="goal-info card">
      <div class="progress-section">
        <div class="progress-header">
          <h3>Progress: {goal.progress}%</h3>
          <div class="progress-control">
            <input 
              type="range" 
              min="0" 
              max="100" 
              step="5" 
              value={goal.progress} 
              on:change={(e) => updateProgress(new CustomEvent('update', { detail: parseInt(e.target.value) }))}
            />
          </div>
        </div>
        <div class="progress-bar">
          <div class="progress-bar-fill" style="width: {goal.progress}%"></div>
        </div>
      </div>
      
      <div class="dates-section">
        <div class="date-item">
          <span class="date-label">Created</span>
          <span class="date-value">{format(new Date(goal.createdAt), 'MMM d, yyyy')}</span>
        </div>
        
        {#if goal.startDate}
          <div class="date-item">
            <span class="date-label">Started</span>
            <span class="date-value">{format(new Date(goal.startDate), 'MMM d, yyyy')}</span>
          </div>
        {/if}
        
        {#if goal.dueDate}
          <div class="date-item">
            <span class="date-label">Due</span>
            <span class="date-value">{format(new Date(goal.dueDate), 'MMM d, yyyy')}</span>
          </div>
        {/if}
        
        {#if goal.completedDate}
          <div class="date-item">
            <span class="date-label">Completed</span>
            <span class="date-value">{format(new Date(goal.completedDate), 'MMM d, yyyy')}</span>
          </div>
        {/if}
      </div>
      
      <div class="description-section">
        <h3>Description</h3>
        <p>{goal.description}</p>
      </div>
    </div>
    
    <div class="milestones-section">
      <h3>Milestones</h3>
      <MilestoneList 
        milestones={goal.milestones} 
        goalId={goal.id} 
      />
    </div>
    
    <div class="suggestions-section">
      <h3>Suggestions</h3>
      <SuggestionList 
        suggestions={goal.suggestions} 
        goalId={goal.id}
      />
    </div>
  </section>
{:else}
  <div class="loading">Loading goal details...</div>
{/if}

<style>
  .goal-detail {
    padding: var(--space-4) 0;
  }
  
  .page-header {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    margin-bottom: var(--space-5);
  }
  
  .meta-badges {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    margin-top: var(--space-2);
  }
  
  .priority {
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  .actions {
    display: flex;
    gap: var(--space-2);
    margin-top: var(--space-2);
  }
  
  .goal-info {
    margin-bottom: var(--space-5);
  }
  
  .progress-section {
    margin-bottom: var(--space-4);
  }
  
  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-2);
  }
  
  .progress-control {
    width: 60%;
  }
  
  .progress-control input {
    width: 100%;
    margin-bottom: 0;
  }
  
  .dates-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-3);
    margin-bottom: var(--space-4);
  }
  
  .date-item {
    display: flex;
    flex-direction: column;
  }
  
  .date-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--color-text-light);
  }
  
  .date-value {
    font-weight: 500;
  }
  
  .description-section {
    margin-bottom: var(--space-4);
  }
  
  .description-section p {
    color: var(--color-text);
  }
  
  .milestones-section, 
  .suggestions-section {
    margin-bottom: var(--space-5);
  }
  
  .not-found, 
  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: var(--space-8);
    background-color: var(--color-card);
    border-radius: 12px;
    margin: var(--space-6) 0;
  }
  
  .not-found h2, 
  .loading {
    margin-bottom: var(--space-4);
  }
  
  @media (min-width: 768px) {
    .page-header {
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-start;
    }
    
    .actions {
      margin-top: 0;
    }
  }
</style>