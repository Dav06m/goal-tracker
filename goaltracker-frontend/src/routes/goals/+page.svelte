<script>
  import { PUBLIC_API_URL } from '$env/static/public';
  import { goals } from '../../stores/goalStore.js';
  import GoalCard from '../../components/GoalCard.svelte';
  import CategoryFilter from '../../components/CategoryFilter.svelte';
  import StatusFilter from '../../components/StatusFilter.svelte';
  
  let filteredGoals = [];
  let selectedCategories = [];
  let selectedStatuses = [];
  let searchQuery = '';
  
  $: {
    filteredGoals = $goals.filter(goal => {
      // filtro categoria
      const categoryMatch = selectedCategories.length === 0 || 
                          selectedCategories.includes(goal.category);
      
      // filtro stato
      const statusMatch = selectedStatuses.length === 0 || 
                        selectedStatuses.includes(goal.status);
      
      // filtro ricerca
      const searchMatch = !searchQuery || 
                        goal.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        goal.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return categoryMatch && statusMatch && searchMatch;
    });
  }
  
  function handleCategoryChange(event) {
    selectedCategories = event.detail;
  }
  
  function handleStatusChange(event) {
    selectedStatuses = event.detail;
  }
</script>

<svelte:head>
  <title>Goals | Goal Tracker</title>
</svelte:head>

<section class="goals-page">
  <header class="page-header">
    <h1>My Goals</h1>
    <a href="/goals/create" class="button">Create Goal</a>
  </header>
  
  <div class="filters-section">
    <div class="search-bar">
      <input 
        type="text" 
        placeholder="Search goals..." 
        bind:value={searchQuery}
      />
    </div>
    
    <div class="filters">
      <CategoryFilter on:change={handleCategoryChange} />
      <StatusFilter on:change={handleStatusChange} />
    </div>
  </div>
  
  {#if filteredGoals.length > 0}
    <div class="goals-grid">
      {#each filteredGoals as goal (goal.id)}
        <GoalCard {goal} />
      {/each}
    </div>
  {:else}
    <div class="empty-state">
      <h3>No goals found</h3>
      <p>Try adjusting your filters or create a new goal</p>
      <a href="/goals/create" class="button">Create Goal</a>
    </div>
  {/if}
</section>

<style>
  .goals-page {
    padding: var(--space-4) 0;
  }
  
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-5);
  }
  
  .filters-section {
    margin-bottom: var(--space-5);
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }
  
  .search-bar {
    width: 100%;
  }
  
  .search-bar input {
    width: 100%;
    padding: var(--space-2) var(--space-3);
    border-radius: 8px;
    border: 1px solid #D1D5DB;
  }
  
  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
  }
  
  .goals-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }
  
  .empty-state {
    padding: var(--space-6);
    background-color: var(--color-card);
    border-radius: 12px;
    text-align: center;
    margin-top: var(--space-5);
  }
  
  .empty-state h3 {
    margin-bottom: var(--space-2);
  }
  
  .empty-state p {
    color: var(--color-text-light);
    margin-bottom: var(--space-4);
  }
  
  @media (min-width: 640px) {
    .filters-section {
      flex-direction: row;
      justify-content: space-between;
    }
    
    .search-bar {
      width: 50%;
    }
    
    .goals-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (min-width: 1024px) {
    .goals-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>