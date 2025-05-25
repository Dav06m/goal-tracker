<script>
  import { PUBLIC_API_URL } from '$env/static/public'
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  const categories = [
    { value: 'personal', label: 'Personal' },
    { value: 'work', label: 'Work' },
    { value: 'health', label: 'Health' },
    { value: 'finance', label: 'Finance' },
    { value: 'learning', label: 'Learning' },
    { value: 'other', label: 'Other' }
  ];
  
  let selectedCategories = [];
  
  function toggleCategory(category) {
    if (selectedCategories.includes(category)) {
      selectedCategories = selectedCategories.filter(c => c !== category);
    } else {
      selectedCategories = [...selectedCategories, category];
    }
    
    dispatch('change', selectedCategories);
  }
</script>

<div class="category-filter">
  <span class="filter-label">Categories:</span>
  
  <div class="filter-options">
    {#each categories as category}
      <button 
        class="filter-option {selectedCategories.includes(category.value) ? 'active' : ''}" 
        on:click={() => toggleCategory(category.value)}
      >
        {category.label}
      </button>
    {/each}
  </div>
</div>

<style>
  .category-filter {
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