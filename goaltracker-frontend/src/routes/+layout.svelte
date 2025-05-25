import { PUBLIC_API_URL } from '$env/static/public'
<script>
  import '../app.css';
  import Navbar from '../components/Navbar.svelte';
</script>

<div class="app">
  <Navbar />
  <main>
    <div class="container">
      <slot />
    </div>
  </main>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1;
    padding-top: 64px; 
  }
</style>