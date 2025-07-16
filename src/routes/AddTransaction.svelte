<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { currentUser } from "../stores/user.js";
  import CreateTransactionGroup from "./CreateTransactionGroup/+page.svelte";

  export let transactionGroup = null;
  let transactionAmount = "";
  let transactionTitle = "";
  let transactionDescription = "";
  let transactionDateSpent = "";

  let transactionGroups = [];

  let transactionCategory = "";
  let categories = [];

  let url = "http://localhost:8000";

  onMount(async () => {
    if (!transactionGroup && $currentUser) {
      const res = await fetch(
        `${url}/users/${$currentUser.id}/transaction_groups`,
      );
      if (res.ok) {
        transactionGroups = await res.json();
        console.log("Transaction groups fetched:", transactionGroups);
      } else {
        console.error("Failed to fetch transaction groups");
      }
    }
    if ($currentUser) {
      const catRes = await fetch(`${url}/categories/user/${$currentUser.id}`);
      if (catRes.ok) {
        categories = await catRes.json();
        console.log("Categories fetched:", categories);
      } else {
        console.error("Failed to fetch categories");
      }
    }
  });

  async function addTransaction(event) {
    event.preventDefault();

    let normalizedInput = transactionCategory.trim().toLowerCase();
    let selectedCategory = categories.find(
      (cat) => cat.name.trim().toLowerCase() === normalizedInput,
    );

    if (!selectedCategory) {
      // Send a POST to add the new category
      const addCatRes = await fetch(`${url}/categories/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: transactionCategory.trim(),
          user_id: $currentUser.id,
        }),
      });

      if (addCatRes.ok) {
        selectedCategory = await addCatRes.json();
        categories = [...categories, selectedCategory]; // add it to local list
      } else {
        console.error("Failed to create category");
        return;
      }
    }
    console.log("transactionGroup:", transactionGroup);
    console.log("transaction title:", transactionTitle);
    try {
      const response = await fetch(`${url}/transactions/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(transactionAmount),
          title: transactionTitle,
          description: transactionDescription,
          transaction_group_id: transactionGroup.id,
          user_id: $currentUser.id,
          category_id: selectedCategory.id,
          date_spent: transactionDateSpent
            ? new Date(transactionDateSpent)
            : null,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Transaction added:", data);
        transactionAmount = "";
        transactionTitle = "";
        transactionDescription = "";
        transactionCategory = "";
        transactionDateSpent = "";
      } else {
        console.error("Failed to add transaction:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  }
</script>

<h3>Add a Transaction</h3>
<form on:submit={addTransaction}>
  <label>
    Date Spent:
    <input type="date" bind:value={transactionDateSpent} required />
  </label>
  <label>
    Title:
    <input type="text" bind:value={transactionTitle} required />
  </label>
  <label>
    Amount:
    <input type="number" step="0.01" bind:value={transactionAmount} required />
  </label>
  <label>
    Category:
    <input list="category-options" bind:value={transactionCategory} required />
    <datalist id="category-options">
      {#each categories as category}
        <option value={category.name}></option>
      {/each}
    </datalist>
  </label>
  <label>
    <label>
      Description:
      <textarea bind:value={transactionDescription}></textarea>
    </label>

    {#if transactionGroup}
      <p>Transaction Group: {transactionGroup.title}</p>
    {:else}
      <label>
        Transaction Group:
        <select bind:value={transactionGroup} required>
          <option value="" disabled selected>Select a group</option>
          {#each transactionGroups as group}
            <option value={group.id}>{group.title}</option>
          {/each}
        </select>
      </label>
    {/if}

    <button type="submit">Submit Transaction</button>
  </label>
</form>
