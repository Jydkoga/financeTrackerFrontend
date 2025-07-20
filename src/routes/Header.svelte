<script>
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { currentUser } from "../stores/user.js";
  import { get } from "svelte/store";

  let transactionGroups = [];
  let url = "http://localhost:8000";
  let showDropdown = false;

  onMount(async () => {
    const user = get(currentUser);
    if (!user) {
      console.log("No user found, redirecting to CreateProfile");
      goto("/CreateProfile");
      return;
    }
    console.log("Header component has been mounted");
    const res = await fetch(`${url}/users/${user.id}/transaction_groups`);
    if (res.ok) {
      transactionGroups = await res.json();
      console.log("Transaction groups fetched:", transactionGroups);
    } else {
      console.error("Failed to fetch transaction groups");
    }
  });
</script>

<header>
  <nav>
    <ul>
      <button type="button" class="logoButton" on:click={() => goto("/")}>
        <img src="/logo.png" alt="Logo" class="logo" />
      </button>
      <div class="dropdown">
        <button class="dropbtn" on:click={() => (showDropdown = !showDropdown)}>
          Transaction groups
          <i class="fa fa-caret-down"></i>
        </button>
        <div class="dropdownContent" class:show={showDropdown}>
          {#each transactionGroups as group}
            <button
              class="dropdownLink"
              on:click={() => goto(`/TransactionGroup/${group.id}`)}
            >
              {group.name}
            </button>
          {/each}
        </div>
      </div>
    </ul>
  </nav>
</header>

<style>
  .logoButton {
    background: none;
    border: none;
    cursor: pointer;
  }
  .logo {
    width: 50px;
    height: 50px;
  }

  .dropdownLink {
    background: none;
    border: none;
    color: inherit;
    padding: 12px 16px;
    width: 100%;
    text-align: left;
    cursor: pointer;
    font: inherit;
  }

  .dropdownLink:hover {
    background-color: #f1f1f1;
  }

  .dropdown {
    position: relative;
    display: inline-block;
  }

  .dropbtn {
    background-color: #3498db;
    color: white;
    padding: 10px;
    font-size: 16px;
    border: none;
    cursor: pointer;
  }

  .dropdownContent {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 160px;
    z-index: 100;
  }
  .dropdownContent.show {
    display: block;
  }
</style>
