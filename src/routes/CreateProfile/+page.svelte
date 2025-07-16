<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { currentUser } from "../../stores/user.js";
  import { goto } from "$app/navigation";

  let username = "";
  let password = "";
  let amount = 0.0;
  let userExistsMessage = "";

  let url = "http://localhost:8000";

  async function createProfile(event) {
    event.preventDefault();
    try {
      const createResponse = await fetch(url + "/users/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
          total_balance: amount,
        }),
      });

      const data = await createResponse.json();
      console.log("Create Profile Response:", data);

      if (createResponse.ok && data.id && data.username) {
        currentUser.set({ id: data.id, username: data.username });
        goto("/");
      } else {
        userExistsMessage = "Could not create user";
      }
      return;

      userExistsMessage = "Login failed.";
    } catch (error) {
      console.error("Error logging in or creating user:", error);
      userExistsMessage =
        "An unexpected error occurred. Please try again later.";
    }
  }

  onMount(() => {
    console.log("CreateProfile component has been mounted");
  });
</script>

<h1>Create an Account</h1>

<p>
  Please enter a username and password. Also, please add an initial balance to
  your account.
</p>
<form on:submit|preventDefault={createProfile}>
  <label for="username">Enter your username:</label>
  <input
    id="username"
    type="string"
    bind:value={username}
    placeholder="Enter your username"
    required
  />
  <label for="password">Enter your password:</label>
  <input
    id="password"
    type="password"
    bind:value={password}
    placeholder="Enter your password"
    required
  />
  <label for="amount">Initial Balance:</label>
  <input
    id="amount"
    type="text"
    inputmode="decimal"
    pattern="^[0-9]*\.?[0-9]+$"
    bind:value={amount}
    placeholder="Enter your initial balance"
    required
  />
  <button type="submit">Create Account</button>
</form>

{#if userExistsMessage}
  <p style="color: red;">{userExistsMessage}</p>
{/if}
