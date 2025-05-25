<script>
  import { PUBLIC_API_URL } from '$env/static/public';
  import { goto } from '$app/navigation';
  import { goals } from '../../../stores/goalStore.js';
  import GoalForm from '../../../components/GoalForm.svelte';
  
  function handleSubmit(event) {
    const newGoal = event.detail;
    goals.createGoal(newGoal);
    goto('/goals');
  }
</script>

<svelte:head>
  <title>Create Goal | Goal Tracker</title>
</svelte:head>

<section class="create-goal">
  <header class="page-header">
    <h1>Create New Goal</h1>
    <a href="/goals" class="button secondary">Cancel</a>
  </header>
  
  <div class="form-container">
    <GoalForm on:submit={handleSubmit} />
  </div>
</section>

<style>
  .create-goal {
    padding: var(--space-4) 0;
  }
  
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-5);
  }
  
  .form-container {
    background-color: var(--color-card);
    padding: var(--space-5);
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
</style>