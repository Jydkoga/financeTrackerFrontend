<script>
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { currentUser } from "../stores/user.js";
  import { get } from "svelte/store";

  let transactionGroups = [];
  let url = "http://localhost:8000";

  onMount(async () => {
    const user = get(currentUser);
    if (!user) {
      console.log("No user found, redirecting to CreateProfile");
      goto("/CreateProfile");
      return;
    }
    console.log("Header component has been mounted");
    const res = await fetch(`${url}/${user.id}/transaction_groups`);
    if (res.ok) {
      transactionGroups = await res.json();
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
        <button class="dropbtn">
          Transaction groups
          <i class="fa fa-caret-down"></i>
        </button>
        <div class="dropdownContent">
          {#each transactionGroups as group}
            console.log("Group:", group);
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
    z-index: 1;
  }

  .dropdown:hover .dropdownContent {
    display: block;
  }

  .dropdown:hover .dropbtn {
    background-color: #2980b9;
  }
</style>
