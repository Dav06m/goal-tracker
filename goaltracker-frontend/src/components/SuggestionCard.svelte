<script>
  import { PUBLIC_API_URL } from '$env/static/public'
  export let suggestion;
  
  function getTypeIcon(type) {
    switch(type) {
      case 'action': return '⚡';
      case 'resource': return '📚';
      case 'tip': return '💡';
      default: return '💡';
    }
  }
</script>

<div class="suggestion-card">
  <div class="suggestion-header">
    <div class="suggestion-icon">{getTypeIcon(suggestion.type)}</div>
    <div class="suggestion-title">Suggestion</div>
  </div>
  
  <div class="suggestion-body">
    {suggestion.text}
  </div>
</div>

<style>
  .suggestion-card {
    background-color: rgba(79, 70, 229, 0.05);
    border-left: 3px solid var(--color-primary);
    padding: var(--space-3);
    border-radius: 8px;
    transition: transform 0.2s;
  }
  
  .suggestion-card:hover {
    transform: translateY(-2px);
  }
  
  .suggestion-header {
    display: flex;
    align-items: center;
    margin-bottom: var(--space-2);
  }
  
  .suggestion-icon {
    font-size: 1.25rem;
    margin-right: var(--space-2);
  }
  
  .suggestion-title {
    font-weight: 600;
    color: var(--color-primary-dark);
  }
  
  .suggestion-body {
    color: var(--color-text);
    font-size: 0.9375rem;
  }
</style>