<script>
  import { PUBLIC_API_URL } from '$env/static/public';
  import { createEventDispatcher } from 'svelte';
  import { goals } from '../stores/goalStore.js';
  import { v4 as uuidv4 } from 'uuid';
  import { format } from 'date-fns';
  
  export let milestones = [];
  export let goalId;
  
  const dispatch = createEventDispatcher();
  
  let newMilestoneTitle = '';
  let newMilestoneDueDate = '';
  
  function toggleMilestone(id) {
    goals.toggleMilestone(goalId, id);
  }
  
  function addMilestone() {
    if (!newMilestoneTitle.trim()) return;
    
    const milestone = {
      id: uuidv4(),
      title: newMilestoneTitle,
      completed: false,
      dueDate: newMilestoneDueDate ? new Date(newMilestoneDueDate) : undefined
    };
    
    goals.addMilestone(goalId, milestone);
    newMilestoneTitle = '';
    newMilestoneDueDate = '';
  }
  
  function removeMilestone(id) {
    if (confirm('Are you sure you want to remove this milestone?')) {
      goals.removeMilestone(goalId, id);
    }
  }
</script>

<div class="milestones">
  {#if milestones.length === 0}
    <div class="empty-milestones">
      <p>No milestones added yet</p>
    </div>
  {:else}
    <ul class="milestone-list">
      {#each milestones as milestone (milestone.id)}
        <li class="milestone-item">
          <label class="milestone-checkbox">
            <input 
              type="checkbox" 
              checked={milestone.completed} 
              on:change={() => toggleMilestone(milestone.id)} 
            />
            <span class="checkbox-custom"></span>
            <span class="milestone-text {milestone.completed ? 'completed' : ''}">
              {milestone.title}
            </span>
          </label>
          
          {#if milestone.dueDate}
            <div class="milestone-due">
              {format(new Date(milestone.dueDate), 'MMM d, yyyy')}
            </div>
          {/if}
          
          <button 
            class="delete-btn" 
            on:click={() => removeMilestone(milestone.id)}
            aria-label="Delete milestone"
          >
            ×
          </button>
        </li>
      {/each}
    </ul>
  {/if}
  
  <div class="add-milestone">
    <div class="add-milestone-form">
      <div class="milestone-inputs">
        <input 
          type="text" 
          placeholder="Add a new milestone" 
          bind:value={newMilestoneTitle}
        />
        <input 
          type="date" 
          bind:value={newMilestoneDueDate}
        />
      </div>
      <button class="button secondary" on:click={addMilestone}>Add</button>
    </div>
  </div>
</div>

<style>
  .milestones {
    background-color: var(--color-card);
    border-radius: 8px;
    padding: var(--space-4);
    margin-bottom: var(--space-4);
  }
  
  .empty-milestones {
    padding: var(--space-3);
    text-align: center;
    color: var(--color-text-light);
    border: 1px dashed #D1D5DB;
    border-radius: 6px;
    margin-bottom: var(--space-3);
  }
  
  .milestone-list {
    list-style: none;
    margin-bottom: var(--space-4);
  }
  
  .milestone-item {
    display: flex;
    align-items: center;
    padding: var(--space-2) 0;
    border-bottom: 1px solid #E5E7EB;
    position: relative;
  }
  
  .milestone-checkbox {
    display: flex;
    align-items: center;
    flex-grow: 1;
    cursor: pointer;
    padding: var(--space-1) 0;
    font-weight: normal;
    margin-bottom: 0;
  }
  
  .milestone-checkbox input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }
  
  .checkbox-custom {
    position: relative;
    height: 18px;
    width: 18px;
    background-color: #fff;
    border: 2px solid #D1D5DB;
    border-radius: 4px;
    margin-right: var(--space-2);
    transition: all 0.2s;
  }
  
  .milestone-checkbox input:checked ~ .checkbox-custom {
    background-color: var(--color-primary);
    border-color: var(--color-primary);
  }
  
  .checkbox-custom:after {
    content: "";
    position: absolute;
    display: none;
    left: 5px;
    top: 1px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
  
  .milestone-checkbox input:checked ~ .checkbox-custom:after {
    display: block;
  }
  
  .milestone-text {
    transition: all 0.2s;
  }
  
  .completed {
    text-decoration: line-through;
    color: var(--color-text-light);
  }
  
  .milestone-due {
    font-size: 0.75rem;
    color: var(--color-text-light);
    margin-right: var(--space-4);
  }
  
  .delete-btn {
    background: none;
    border: none;
    color: var(--color-text-light);
    font-size: 1.25rem;
    cursor: pointer;
    padding: 0 var(--space-2);
    opacity: 0.6;
    transition: opacity 0.2s;
  }
  
  .milestone-item:hover .delete-btn {
    opacity: 1;
  }
  
  .delete-btn:hover {
    color: var(--color-error);
    background: none;
  }
  
  .add-milestone-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }
  
  .milestone-inputs {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }
  
  @media (min-width: 640px) {
    .add-milestone-form {
      flex-direction: row;
      gap: var(--space-3);
      align-items: flex-end;
    }
    
    .milestone-inputs {
      flex: 1;
      flex-direction: row;
    }
    
    .milestone-inputs input:first-child {
      flex: 2;
    }
    
    .milestone-inputs input:last-child {
      flex: 1;
    }
  }
</style>