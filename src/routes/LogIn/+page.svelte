<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { currentUser } from "../../stores/user.js";
  import { goto } from "$app/navigation";

  let username = "";
  let password = "";
  let amount = 0;
  let displayedErrorMessage = "";

  let url = "http://localhost:8000";

  async function logIn(event) {
    event.preventDefault();

    try {
      // Try logging in
      const loginResponse = await fetch(url + "/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const loginData = await loginResponse.json();

      if (loginResponse.ok) {
        currentUser.set({
          id: loginData.id,
          username: loginData.username,
        });
        goto("/");
        return;
      }

      // Login Failed - user doesn't exist or wrong password
      if (loginResponse.status === 401) {
        displayedErrorMessage =
          "Incorrect username or password. Please try again.";
        return;
      }
      displayedErrorMessage =
        "Login failed. Please check your credentials and try again.";
    } catch (error) {
      console.error("Error logging in:", error);
      displayedErrorMessage =
        "Something went wrong on our end. Please try again in a few minutes.";
    }
  }

  onMount(() => {
    console.log("LogIn component has been mounted");
  });
</script>

<h1>Log In</h1>
<form on:submit|preventDefault={logIn}>
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
  <button type="submit">Log In</button>
</form>

{#if displayedErrorMessage}
  <p style="color: red;">{displayedErrorMessage}</p>
{/if}

<div>
  <p>
    Don't have an account? <button on:click={() => goto("./CreateProfile")}>
      Create a new profile</button
    >
  </p>
</div>
