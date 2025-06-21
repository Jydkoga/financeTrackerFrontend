<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";

  let username = "";
  let amount = 0;
  let userExistsMessage = "";

  async function createProfile(event) {
    event.preventDefault();

    try {
      // First, check if the user already exists
      const checkResponse = await fetch(
        `http://localhost:8000/users/lookup?username=${encodeURIComponent(username)}`,
      );

      if (checkResponse.status === 200) {
        const existingUser = await checkResponse.json();
        if (existingUser && !existingUser.error) {
          console.log("i got here");
          userExistsMessage = "User already exists";
          return; // Exit early if user exists
        }
      }

      userExistsMessage = ""; // Clear previous message

      const response = await fetch("http://localhost:8000/users/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, total_balance: amount }),
      });
      const data = await response.json();
      console.log("Server response:", data);
    } catch (error) {
      console.error("Error checking or creating user:", error);
    }
  }

  onMount(() => {
    console.log("FinanceTracker app has been loaded");
  });

  $: currentPage = $page.url.pathname;
</script>

<h1>Welcome to FinanceTracker</h1>
<p></p>

<form on:submit|preventDefault={createProfile}>
  <label for="username">Enter your username:</label>
  <input
    id="username"
    type="string"
    bind:value={username}
    placeholder="Enter your username"
    required
  />
  <label for="amount">Enter existing balance:</label>
  <input
    id="amount"
    type="number"
    bind:value={amount}
    placeholder="Enter your existing balance"
    required
  />
  <button type="submit">Submit</button>
</form>

{#if userExistsMessage}
  <p style="color: red;">{userExistsMessage}</p>
{/if}
