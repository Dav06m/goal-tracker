<script>
  import { PUBLIC_API_URL } from '$env/static/public'
  import { goals } from '../stores/goalStore.js';
  
  export let suggestions = [];
  export let goalId;
  
  function applySuggestion(id) {
    goals.applySuggestion(goalId, id);
  }
  
  function getTypeIcon(type) {
    switch(type) {
      case 'action': return '⚡';
      case 'resource': return '📚';
      case 'tip': return '💡';
      default: return '💡';
    }
  }
  
  function getTypeLabel(type) {
    switch(type) {
      case 'action': return 'Action Item';
      case 'resource': return 'Resource';
      case 'tip': return 'Tip';
      default: return 'Suggestion';
    }
  }
</script>

<div class="suggestions">
  {#if suggestions.length === 0}
    <div class="empty-suggestions">
      <p>No suggestions available yet</p>
      <p class="empty-hint">Suggestions will appear as you make progress on your goal</p>
    </div>
  {:else}
    <ul class="suggestion-list">
      {#each suggestions as suggestion (suggestion.id)}
        <li class="suggestion-item {suggestion.applied ? 'applied' : ''}">
          <div class="suggestion-icon">{getTypeIcon(suggestion.type)}</div>
          
          <div class="suggestion-content">
            <div class="suggestion-type">{getTypeLabel(suggestion.type)}</div>
            <div class="suggestion-text">{suggestion.text}</div>
            
            {#if !suggestion.applied}
              <button 
                class="apply-btn" 
                on:click={() => applySuggestion(suggestion.id)}
              >
                Apply
              </button>
            {:else}
              <div class="applied-status">✓ Applied</div>
            {/if}
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .suggestions {
    background-color: var(--color-card);
    border-radius: 8px;
    padding: var(--space-4);
    margin-bottom: var(--space-4);
  }
  
  .empty-suggestions {
    padding: var(--space-3);
    text-align: center;
    color: var(--color-text-light);
    border: 1px dashed #D1D5DB;
    border-radius: 6px;
  }
  
  .empty-hint {
    font-size: 0.75rem;
    margin-top: var(--space-2);
  }
  
  .suggestion-list {
    list-style: none;
  }
  
  .suggestion-item {
    display: flex;
    padding: var(--space-3);
    border-radius: 8px;
    margin-bottom: var(--space-3);
    background-color: rgba(79, 70, 229, 0.05);
    border-left: 3px solid var(--color-primary);
    transition: all 0.2s;
  }
  
  .suggestion-item.applied {
    background-color: rgba(16, 185, 129, 0.05);
    border-left-color: var(--color-success);
  }
  
  .suggestion-icon {
    font-size: 1.25rem;
    margin-right: var(--space-3);
  }
  
  .suggestion-content {
    flex: 1;
  }
  
  .suggestion-type {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-primary);
    margin-bottom: var(--space-1);
  }
  
  .applied .suggestion-type {
    color: var(--color-success);
  }
  
  .suggestion-text {
    margin-bottom: var(--space-2);
  }
  
  .apply-btn {
    display: inline-block;
    background-color: var(--color-primary);
    color: white;
    font-size: 0.75rem;
    padding: 4px 10px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .apply-btn:hover {
    background-color: var(--color-primary-dark);
  }
  
  .applied-status {
    display: inline-block;
    font-size: 0.75rem;
    color: var(--color-success);
    font-weight: 500;
  }
</style>
