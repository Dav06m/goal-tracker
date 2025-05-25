<script>
  import { PUBLIC_API_URL } from '$env/static/public';
  import { format, isAfter, differenceInDays } from 'date-fns';
  
  export let goal;
  
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
  
  $: dueStatus = goal.dueDate ? getDueStatus(goal.dueDate) : null;
</script>

<a href={`/goals/${goal.id}`} class="goal-preview card">
  <div class="goal-header">
    <h3 class="preview-title">{goal.title}</h3>
    {#if goal.dueDate}
      <div class="due-date {dueStatus ? dueStatus.class : ''}">
        {#if dueStatus}
          {dueStatus.text}
        {:else}
          Due {format(new Date(goal.dueDate), 'MMM d')}
        {/if}
      </div>
    {/if}
  </div>
  
  <div class="progress-bar">
    <div class="progress-bar-fill" style="width: {goal.progress}%"></div>
  </div>
  
  <div class="preview-details">
    <div class="preview-category">
      <span class="preview-badge">{goal.category}</span>
    </div>
    
    <div class="preview-milestone">
      {#if goal.milestones.length > 0}
        <span>{goal.milestones.filter(m => m.completed).length}/{goal.milestones.length}</span>
      {:else}
        <span>No milestones</span>
      {/if}
    </div>
  </div>
</a>

<style>
  .goal-preview {
    display: block;
    text-decoration: none;
    color: inherit;
    padding: var(--space-3);
    cursor: pointer;
  }
  
  .goal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--space-2);
  }
  
  .preview-title {
    font-size: 1rem;
    margin-bottom: var(--space-1);
    font-weight: 600;
    margin-right: var(--space-2);
  }
  
  .due-date {
    font-size: 0.75rem;
    font-weight: 500;
    white-space: nowrap;
  }
  
  .preview-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.75rem;
    color: var(--color-text-light);
    margin-top: var(--space-2);
  }
  
  .preview-badge {
    background-color: rgba(0, 0, 0, 0.05);
    padding: 2px 8px;
    border-radius: 12px;
  }
</style>