<script>
  import { PUBLIC_API_URL } from '$env/static/public'
  import { createEventDispatcher } from 'svelte';
  import { format, isAfter, differenceInDays } from 'date-fns';
  import { goals } from '../stores/goalStore.js';
  
  export let goal;
  
  const dispatch = createEventDispatcher();
  
  function getStatusClass(status) {
    switch(status) {
      case 'not-started': return 'badge';
      case 'in-progress': return 'badge primary';
      case 'on-hold': return 'badge warning';
      case 'completed': return 'badge success';
      default: return 'badge';
    }
  }
  
  function getPriorityIndicator(priority) {
    switch(priority) {
      case 'low': return { color: 'var(--color-success)', text: 'Low' };
      case 'medium': return { color: 'var(--color-warning)', text: 'Medium' };
      case 'high': return { color: 'var(--color-error)', text: 'High' };
      default: return { color: 'var(--color-text-light)', text: 'Priority' };
    }
  }
  
  function getDueStatus(dueDate) {
    if (!dueDate) return null;
    
    const today = new Date();
    const due = new Date(dueDate);
    
    if (isAfter(today, due)) {
      return { text: 'Overdue', class: 'text-error' };
    }
    
    const daysLeft = differenceInDays(due, today);
    
    if (daysLeft <= 3) {
      return { text: `${daysLeft} days left`, class: 'text-warning' };
    }
    
    return { text: `${daysLeft} days left`, class: '' };
  }
  
  $: priorityInfo = getPriorityIndicator(goal.priority);
  $: dueStatus = goal.dueDate ? getDueStatus(goal.dueDate) : null;
</script>

<div class="goal-card card">
  <div class="card-header">
    <span class={getStatusClass(goal.status)}>{goal.status}</span>
    <span 
      class="priority-indicator" 
      style="background-color: {priorityInfo.color};" 
      title="{priorityInfo.text} Priority"
    ></span>
  </div>
  
  <h3 class="goal-title">{goal.title}</h3>
  
  <div class="goal-category">
    <span class="category-label">{goal.category}</span>
  </div>
  
  <p class="goal-description">{goal.description.length > 100 ? goal.description.slice(0, 100) + '...' : goal.description}</p>
  
  <div class="progress-section">
    <div class="progress-info">
      <span class="progress-text">{goal.progress}% complete</span>
      {#if dueStatus}
        <span class="due-text {dueStatus.class}">{dueStatus.text}</span>
      {/if}
    </div>
    <div class="progress-bar">
      <div class="progress-bar-fill" style="width: {goal.progress}%"></div>
    </div>
  </div>
  
  <div class="milestone-info">
    {#if goal.milestones.length > 0}
      <span>{goal.milestones.filter(m => m.completed).length}/{goal.milestones.length} milestones</span>
    {:else}
      <span>No milestones</span>
    {/if}
  </div>
  
  <div class="card-footer">
    <a href={`/goals/${goal.id}`} class="view-button">View Details</a>
  </div>
</div>

<style>
  .goal-card {
    display: flex;
    flex-direction: column;
    transition: transform 0.2s, box-shadow 0.2s;
    height: 100%;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-3);
  }
  
  .priority-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }
  
  .goal-title {
    margin-bottom: var(--space-2);
    font-size: 1.25rem;
  }
  
  .goal-category {
    margin-bottom: var(--space-3);
  }
  
  .category-label {
    font-size: 0.75rem;
    background-color: rgba(0, 0, 0, 0.05);
    padding: 2px 8px;
    border-radius: 12px;
    color: var(--color-text-light);
  }
  
  .goal-description {
    color: var(--color-text-light);
    font-size: 0.875rem;
    margin-bottom: var(--space-3);
    flex-grow: 1;
  }
  
  .progress-section {
    margin-bottom: var(--space-3);
  }
  
  .progress-info {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    margin-bottom: var(--space-1);
  }
  
  .progress-text {
    font-weight: 500;
  }
  
  .due-text {
    font-weight: 500;
  }
  
  .milestone-info {
    font-size: 0.75rem;
    color: var(--color-text-light);
    margin-bottom: var(--space-3);
  }
  
  .card-footer {
    margin-top: auto;
    text-align: right;
  }
  
  .view-button {
    color: var(--color-primary);
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  .view-button:hover {
    text-decoration: underline;
  }
</style>