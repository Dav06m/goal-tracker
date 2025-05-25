<script>
  import { PUBLIC_API_URL } from '$env/static/public'
  import { page } from '$app/stores';
  
  $: isActive = (path) => {
    return $page.url.pathname === path || $page.url.pathname.startsWith(path + '/');
  };
</script>

<nav class="navbar">
  <div class="container navbar-container">
    <a href="/" class="logo">
      <span class="logo-icon">🎯</span>
      <span class="logo-text">Goal Tracker</span>
    </a>
    
    <div class="nav-links">
      <a 
        href="/" 
        class="nav-link {isActive('/') ? 'active' : ''}"
      >
        Dashboard
      </a>
      <a 
        href="/goals" 
        class="nav-link {isActive('/goals') ? 'active' : ''}"
      >
        Goals
      </a>
    </div>
    
    <a href="/goals/create" class="button create-btn">Create Goal</a>
  </div>
</nav>

<style>
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 64px;
    background-color: var(--color-card);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    z-index: 100;
  }
  
  .navbar-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
  }
  
  .logo {
    display: flex;
    align-items: center;
    font-weight: 600;
    font-size: 1.25rem;
    color: var(--color-text);
    text-decoration: none;
  }
  
  .logo-icon {
    margin-right: var(--space-2);
    font-size: 1.5rem;
  }
  
  .nav-links {
    display: none;
  }
  
  .nav-link {
    padding: var(--space-2) var(--space-3);
    margin: 0 var(--space-1);
    color: var(--color-text);
    text-decoration: none;
    border-radius: 6px;
    font-weight: 500;
    transition: background-color 0.2s;
  }
  
  .nav-link:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  .nav-link.active {
    color: var(--color-primary);
    background-color: rgba(79, 70, 229, 0.1);
  }
  
  .create-btn {
    padding: var(--space-1) var(--space-3);
  }
  
  @media (min-width: 640px) {
    .nav-links {
      display: flex;
    }
    
    .logo-text {
      display: inline;
    }
  }
</style>