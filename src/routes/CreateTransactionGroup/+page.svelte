<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { currentUser } from "../../stores/user.js";
  import { goto } from "$app/navigation";

  let groupTitle = "";
  let groupDescription = "";

  $: userId = $currentUser ? $currentUser.id : null;

  async function createTransactionGroup(event) {
    event.preventDefault();

    if (!userId) {
      console.error("No user ID available. Cannot create transaction group.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8000/transaction_groups/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: groupTitle,
            description: groupDescription,
            user_id: userId,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Transaction group created:", data);
        goto("/"); // Redirect to the home page after creation
      } else {
        console.error(
          "Failed to create transaction group:",
          response.statusText,
        );
      }
    } catch (error) {
      console.error("Error creating transaction group:", error);
    }
  }
</script>

<h1>Create a Transaction Group</h1>
<p>Transaction groups allow you to group multiple transactions together.</p>
<p>
  For example, you can create a group for all transactions related to a specific
  event or purpose.
</p>
<p>
  To create a transaction group, you need to provide a name for the group and
  optionally a description.
</p>
<p>Once you create a transaction group, you can add transactions to it.</p>

<form on:submit|preventDefault={createTransactionGroup}>
  <label for="groupTitle">Group Name:</label>
  <input type="text" id="groupTitle" bind:value={groupTitle} required />

  <label for="groupDescription">Group Description:</label>
  <textarea id="groupDescription" bind:value={groupDescription}></textarea>

  <button type="submit">Create Transaction Group</button>
</form>
