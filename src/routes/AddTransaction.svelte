<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { currentUser } from "../stores/user.js";
  import CreateTransactionGroup from "./CreateTransactionGroup/+page.svelte";

  let transactionAmount = "";
  let transactionTitle = "";
  let transactionDescription = "";
  let transactionGroup = "";
  let transactionGroups = [];

  onMount(async () => {
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

  async function addTransaction(event) {
    event.preventDefault();
    console.log("transactionGroup:", transactionGroup);
    console.log("transaction title:", transactionTitle);
    try {
      const response = await fetch("http://localhost:8000/transactions/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(transactionAmount),
          title: transactionTitle,
          description: transactionDescription,
          transaction_group_id: parseInt(transactionGroup),
          user_id: $currentUser.id,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Transaction added:", data);
      } else {
        console.error("Failed to add transaction:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  }
</script>

<h1>Add a Transaction</h1>
<form on:submit={addTransaction}>
  <label>
    Amount:
    <input type="number" bind:value={transactionAmount} required />
  </label>
  <label>
    Title:
    <input type="text" bind:value={transactionTitle} required />
  </label>

  <label>
    Description:
    <textarea bind:value={transactionDescription}></textarea>
  </label>

  <label>
    Transaction Group:
    <select bind:value={transactionGroup} required>
      <option value="" disabled selected>Select a group</option>
      {#each transactionGroups as group}
        <option value={group.id}>{group.title}</option>
      {/each}
    </select>
  </label>

  <button type="submit">Submit Transaction</button>
</form>
