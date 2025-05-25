<script>
  import { PUBLIC_API_URL } from '$env/static/public';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { goals } from '../../../../stores/goalStore.js';
  import GoalForm from '../../../../components/GoalForm.svelte';
  
  export let data;
  
  let goal;
  let notFound = false;
  
  onMount(() => {
    goal = $goals.find(g => g.id === data.id);
    if (!goal) {
      notFound = true;
    }
  });
  
  function handleSubmit(event) {
    const updatedGoal = event.detail;
    goals.updateGoal(data.id, updatedGoal);
    goto(`/goals/${data.id}`);
  }
  
  function handleDelete() {
    if (confirm('Are you sure you want to delete this goal?')) {
      goals.deleteGoal(data.id);
      goto('/goals');
    }
  }
</script>

<svelte:head>
  <title>Edit Goal | Goal Tracker</title>
</svelte:head>

{#if notFound}
  <div class="not-found">
    <h2>Goal Not Found</h2>
    <p>The goal you're trying to edit doesn't exist or has been deleted.</p>
    <a href="/goals" class="button">Back to Goals</a>
  </div>
{:else if goal}
  <section class="edit-goal">
    <header class="page-header">
      <h1>Edit Goal</h1>
      <div class="actions">
        <a href={`/goals/${data.id}`} class="button secondary">Cancel</a>
        <button class="button accent" on:click={handleDelete}>Delete</button>
      </div>
    </header>
    
    <div class="form-container">
      <GoalForm {goal} on:submit={handleSubmit} />
    </div>
  </section>
{:else}
  <div class="loading">Loading goal details...</div>
{/if}

<style>
  .edit-goal {
    padding: var(--space-4) 0;
  }
  
  .page-header {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    margin-bottom: var(--space-5);
  }
  
  .actions {
    display: flex;
    gap: var(--space-2);
  }
  
  .form-container {
    background-color: var(--color-card);
    padding: var(--space-5);
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
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
      align-items: center;
    }
  }
</style>