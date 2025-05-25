<script>
  import { PUBLIC_API_URL } from '$env/static/public';
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  const statuses = [
    { value: 'not-started', label: 'Not Started' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'on-hold', label: 'On Hold' },
    { value: 'completed', label: 'Completed' }
  ];
  
  let selectedStatuses = [];
  
  function toggleStatus(status) {
    if (selectedStatuses.includes(status)) {
      selectedStatuses = selectedStatuses.filter(s => s !== status);
    } else {
      selectedStatuses = [...selectedStatuses, status];
    }
    
    dispatch('change', selectedStatuses);
  }
</script>

<div class="status-filter">
  <span class="filter-label">Status:</span>
  
  <div class="filter-options">
    {#each statuses as status}
      <button 
        class="filter-option {selectedStatuses.includes(status.value) ? 'active' : ''}" 
        on:click={() => toggleStatus(status.value)}
      >
        {status.label}
      </button>
    {/each}
  </div>
</div>

<style>
  .status-filter {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-2);
  }
  
  .filter-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-light);
  }
  
  .filter-options {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1);
  }
  
  .filter-option {
    font-size: 0.75rem;
    background-color: #F3F4F6;
    border: 1px solid #E5E7EB;
    color: var(--color-text);
    padding: 4px 10px;
    border-radius: 9999px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .filter-option:hover {
    border-color: var(--color-primary-light);
    background-color: #F3F4F6;
  }
  
  .filter-option.active {
    background-color: var(--color-primary);
    border-color: var(--color-primary);
    color: white;
  }
  
  .filter-option.active:hover {
    background-color: var(--color-primary-dark);
  }
</style>