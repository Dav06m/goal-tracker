<script lang="ts">
  import { PUBLIC_API_URL } from '$env/static/public'
  let count: number = 0
  const increment = () => {
    count += 1
  }
</script>

<button on:click={increment}>
  count is {count}
</button>
