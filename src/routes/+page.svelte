<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { currentUser } from "../stores/user.js";
  import { goto } from "$app/navigation";
  import CreateProfile from "./CreateProfile/+page.svelte";
  import CreateTransactionGroup from "./CreateTransactionGroup/+page.svelte";
  import { get } from "svelte/store";
  import AddTransaction from "./AddTransaction.svelte";

  let transactionGroups = [];

  let selectedTransactionGroupId = "";

  function goToTransactionGroup() {
    if (selectedTransactionGroupId) {
      goto(`/TransactionGroup/${selectedTransactionGroupId}`);
    }
  }

  onMount(async () => {
    console.log("FinanceTracker app has been loaded");
    const user = get(currentUser);
    if (!user) {
      console.log("No user found, redirecting to Log In Page");
      goto("/LogIn");
    } else {
      console.log("User found:", user);
    }

    if ($currentUser) {
      const res = await fetch(
        `http://localhost:8000/users/${$currentUser.id}/transaction_groups`,
      );
      if (res.ok) {
        transactionGroups = await res.json();
        console.log("Transaction groups fetched:", transactionGroups);
      } else {
        console.error("Failed to fetch transaction groups");
      }
    }
  });

  // $: currentPage = $page.url.pathname;
</script>

{#if $currentUser}
  <h1>Welcome to FinanceTracker, {$currentUser.username}!</h1>
  <button onclick={() => goto("/CreateTransactionGroup")}>
    Create a Transaction Group
  </button>

  <!-- Dropdown to select transaction group -->
  <label for="groupSelect">View a Transaction Group:</label>
  <select id="groupSelect" bind:value={selectedTransactionGroupId}>
    <option value="" disabled selected>Select a group</option>
    {#each transactionGroups as group}
      <option value={group.id}>{group.title}</option>
    {/each}
  </select>
  <button onclick={goToTransactionGroup}>Go</button>

  <AddTransaction />
{:else}
  <h1>Redirecting to profile setup...</h1>
{/if}
