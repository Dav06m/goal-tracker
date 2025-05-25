<script>
  import { PUBLIC_API_URL } from '$env/static/public';
  import { createEventDispatcher } from 'svelte';
  import { v4 as uuidv4 } from 'uuid';
  
  export let goal = null;
  
  const dispatch = createEventDispatcher();
  
  let title = goal?.title || '';
  let description = goal?.description || '';
  let category = goal?.category || 'personal';
  let priority = goal?.priority || 'medium';
  let status = goal?.status || 'not-started';
  let startDate = goal?.startDate ? new Date(goal.startDate).toISOString().substr(0, 10) : '';
  let dueDate = goal?.dueDate ? new Date(goal.dueDate).toISOString().substr(0, 10) : '';
  let milestones = goal?.milestones || [];
  
  let newMilestoneTitle = '';
  let newMilestoneDueDate = '';
  
  const categories = [
    { value: 'personal', label: 'Personal' },
    { value: 'work', label: 'Work' },
    { value: 'health', label: 'Health' },
    { value: 'finance', label: 'Finance' },
    { value: 'learning', label: 'Learning' },
    { value: 'other', label: 'Other' }
  ];
  
  const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];
  
  const statuses = [
    { value: 'not-started', label: 'Not Started' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'on-hold', label: 'On Hold' },
    { value: 'completed', label: 'Completed' }
  ];
  
  function handleSubmit() {
    const formData = {
      title,
      description,
      category,
      priority,
      status,
      progress: goal?.progress || 0,
      createdAt: goal?.createdAt || new Date(),
      startDate: startDate ? new Date(startDate) : undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      completedDate: goal?.completedDate,
      milestones,
      suggestions: goal?.suggestions || []
    };
    
    dispatch('submit', formData);
  }
  
  function addMilestone() {
    if (!newMilestoneTitle.trim()) return;
    
    const milestone = {
      id: uuidv4(),
      title: newMilestoneTitle,
      completed: false,
      dueDate: newMilestoneDueDate ? new Date(newMilestoneDueDate) : undefined
    };
    
    milestones = [...milestones, milestone];
    newMilestoneTitle = '';
    newMilestoneDueDate = '';
  }
  
  function removeMilestone(id) {
    milestones = milestones.filter(m => m.id !== id);
  }
  
  function toggleMilestone(id) {
    milestones = milestones.map(m => 
      m.id === id ? {...m, completed: !m.completed} : m
    );
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="goal-form">
  <div class="form-group">
    <label for="title">Goal Title</label>
    <input 
      type="text" 
      id="title" 
      bind:value={title} 
      required 
      placeholder="What do you want to achieve?"
    />
  </div>
  
  <div class="form-group">
    <label for="description">Description</label>
    <textarea 
      id="description" 
      bind:value={description} 
      rows="3" 
      placeholder="Describe your goal in detail"
    ></textarea>
  </div>
  
  <div class="form-row">
    <div class="form-group">
      <label for="category">Category</label>
      <select id="category" bind:value={category}>
        {#each categories as cat}
          <option value={cat.value}>{cat.label}</option>
        {/each}
      </select>
    </div>
    
    <div class="form-group">
      <label for="priority">Priority</label>
      <select id="priority" bind:value={priority}>
        {#each priorities as pri}
          <option value={pri.value}>{pri.label}</option>
        {/each}
      </select>
    </div>
  </div>
  
  <div class="form-row">
    <div class="form-group">
      <label for="status">Status</label>
      <select id="status" bind:value={status}>
        {#each statuses as stat}
          <option value={stat.value}>{stat.label}</option>
        {/each}
      </select>
    </div>
  </div>
  
  <div class="form-row">
    <div class="form-group">
      <label for="startDate">Start Date</label>
      <input 
        type="date" 
        id="startDate" 
        bind:value={startDate}
      />
    </div>
    
    <div class="form-group">
      <label for="dueDate">Due Date</label>
      <input 
        type="date" 
        id="dueDate" 
        bind:value={dueDate}
      />
    </div>
  </div>
  
  <div class="milestones-section">
    <h3>Milestones</h3>
    
    {#if milestones.length > 0}
      <ul class="milestone-list">
        {#each milestones as milestone}
          <li class="milestone-item">
            <div class="milestone-content">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={milestone.completed} 
                  on:change={() => toggleMilestone(milestone.id)}
                />
                <span class={milestone.completed ? 'completed' : ''}>{milestone.title}</span>
              </label>
              
              {#if milestone.dueDate}
                <div class="milestone-due">
                  Due: {new Date(milestone.dueDate).toLocaleDateString()}
                </div>
              {/if}
            </div>
            
            <button 
              type="button" 
              class="remove-btn" 
              on:click={() => removeMilestone(milestone.id)}
            >
              ×
            </button>
          </li>
        {/each}
      </ul>
    {:else}
      <p class="no-milestones">No milestones added yet</p>
    {/if}
    
    <div class="add-milestone">
      <div class="form-row">
        <div class="form-group flex-grow">
          <input 
            type="text" 
            placeholder="New milestone" 
            bind:value={newMilestoneTitle}
          />
        </div>
        
        <div class="form-group">
          <input 
            type="date" 
            bind:value={newMilestoneDueDate}
          />
        </div>
      </div>
      
      <button 
        type="button" 
        class="button secondary add-btn" 
        on:click={addMilestone}
      >
        Add Milestone
      </button>
    </div>
  </div>
  
  <div class="form-actions">
    <button type="submit" class="button">Save Goal</button>
  </div>
</form>

<style>
  .goal-form {
    width: 100%;
  }
  
  .form-group {
    margin-bottom: var(--space-4);
    width: 100%;
  }
  
  .form-row {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    margin-bottom: var(--space-3);
  }
  
  .milestones-section {
    margin-bottom: var(--space-4);
    padding-top: var(--space-3);
    border-top: 1px solid #E5E7EB;
  }
  
  .milestones-section h3 {
    margin-bottom: var(--space-3);
  }
  
  .milestone-list {
    list-style: none;
    margin-bottom: var(--space-4);
  }
  
  .milestone-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-2);
    border-bottom: 1px solid #E5E7EB;
  }
  
  .milestone-content {
    flex: 1;
  }
  
  .checkbox-label {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-weight: normal;
    margin-bottom: var(--space-1);
  }
  
  .checkbox-label input {
    width: auto;
    margin: 0;
  }
  
  .completed {
    text-decoration: line-through;
    color: var(--color-text-light);
  }
  
  .milestone-due {
    font-size: 0.75rem;
    color: var(--color-text-light);
  }
  
  .remove-btn {
    background: none;
    border: none;
    color: var(--color-text-light);
    font-size: 1.25rem;
    cursor: pointer;
    padding: 0 var(--space-2);
  }
  
  .remove-btn:hover {
    color: var(--color-error);
    background: none;
  }
  
  .add-milestone {
    margin-bottom: var(--space-3);
  }
  
  .no-milestones {
    color: var(--color-text-light);
    font-style: italic;
    margin-bottom: var(--space-3);
  }
  
  .add-btn {
    margin-top: var(--space-2);
  }
  
  .flex-grow {
    flex-grow: 1;
  }
  
  .form-actions {
    margin-top: var(--space-5);
    display: flex;
    justify-content: flex-end;
  }
  
  @media (min-width: 640px) {
    .form-row {
      flex-direction: row;
      gap: var(--space-4);
    }
  }
</style>