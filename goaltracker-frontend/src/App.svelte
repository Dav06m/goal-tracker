<script lang="ts">
  import { PUBLIC_API_URL } from '$env/static/public';
  import { Router, Route } from 'svelte-navigator';
  import Navbar from './components/Navbar.svelte';
  import Dashboard from './pages/Dashboard.svelte';
  import GoalList from './pages/GoalList.svelte';
  import GoalDetail from './pages/GoalDetail.svelte';
  import CreateGoal from './pages/CreateGoal.svelte';
  import EditGoal from './pages/EditGoal.svelte';
</script>

<Router>
  <main>
    <Navbar />
    <div class="container">
      <Route path="/" component={Dashboard} />
      <Route path="/goals" component={GoalList} />
      <Route path="/goals/create" component={CreateGoal} />
      <Route path="/goals/:id" component={GoalDetail} />
      <Route path="/goals/:id/edit" component={EditGoal} />
    </div>
  </main>
</Router>

<style>
  main {
    width: 100%;
    min-height: 100vh;
    padding-top: 64px; 
  }
</style>