<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { currentUser } from "../../stores/user.js";
  import { goto } from "$app/navigation";

  let username = "";
  let amount = 0;
  let userExistsMessage = "";

  let url = "http://localhost:8000";

  async function createProfile(event) {
    event.preventDefault();

    try {
      // First, check if the user already exists
      const checkResponse = await fetch(
        url + `/users/lookup?username=${encodeURIComponent(username)}`,
      );

      if (checkResponse.status === 200) {
        const existingUser = await checkResponse.json();
        if (existingUser && !existingUser.error) {
          console.log("i got here");
          userExistsMessage = "User already exists";
          currentUser.set({
            id: existingUser.id,
            username: existingUser.username,
          });
          console.log("User already exists:", existingUser);
          goto("/");
          return; // Exit early if user exists
        }
      }

      userExistsMessage = ""; // Clear previous message

      const response = await fetch(url + "/users/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, total_balance: amount }),
      });
      const data = await response.json();
      console.log("Server response:", data);

      if (data && data.id && data.username) {
        currentUser.set({ id: data.id, username: data.username });
      }
    } catch (error) {
      console.error("Error checking or creating user:", error);
    }
  }

  onMount(() => {
    console.log("CreateProfile component has been mounted");
  });
</script>

<h1>Log In or Create Your Profile</h1>

<p>Please enter your username to log in or create a new profile.</p>
<form on:submit|preventDefault={createProfile}>
  <label for="username">Enter your username:</label>
  <input
    id="username"
    type="string"
    bind:value={username}
    placeholder="Enter your username"
    required
  />
  <button type="submit">Submit</button>
</form>

{#if userExistsMessage}
  <p style="color: red;">{userExistsMessage}</p>
{/if}
