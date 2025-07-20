<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { currentUser } from "../../../stores/user.js";
  import { goto } from "$app/navigation";
  import AddTransaction from "../../AddTransaction.svelte";
  import Header from "../../Header.svelte";

  const options = {
    chart: { type: "pie" },
    labels: [
      "Food",
      "Transport",
      "Accomodations",
      "Apartment Furnishing",
      "Other",
    ],
  };

  let transactionGroupId = null;

  let transactionGroup = null;

  let series = [];

  let ApexCharts = null;

  onMount(async () => {
    ApexCharts = (await import("svelte-apexcharts")).default;

    const transactionGroupId = $page.params.transactionGroupId;
    console.log("TransactionGroup ID from route:", transactionGroupId);
    const user = $currentUser;
    if (!user) {
      console.log("No user found, redirecting to CreateProfile");
      goto("/CreateProfile");
    } else {
      console.log("User found:", user);
      transactionGroup = await fetchTransactionGroup(transactionGroupId);
    }
  });

  async function fetchTransactionGroup(id) {
    try {
      const response = await fetch(
        `http://localhost:8000/transaction_groups/${id}`,
      );
      if (response.ok) {
        return await response.json();
      } else {
        console.error("Failed to fetch transaction group");
      }
    } catch (error) {
      console.error("Error fetching transaction group:", error);
    }
    return null;
  }
</script>

<Header />

{#if !transactionGroup}
  <p>Loading transaction group...</p>
{:else}
  <div class="transaction-group-display-container">
    <h1>{transactionGroup.title}</h1>
    <p>{transactionGroup.description}</p>
    <p>Total: ${transactionGroup.total}</p>
    {#if ApexCharts}
      <ApexCharts {options} {series} type="pie" height="350" />
    {/if}
    <h2>Transactions</h2>
    <ul>
      {#each transactionGroup.transactions as transaction}
        <li class="transaction-item">
          <div class="transaction-meta">
            <span class="transaction-date"
              >{new Date(transaction.date_spent).toLocaleDateString()}</span
            >
            <span class="transaction-title">{transaction.title}</span>
            <span>${transaction.amount}</span>
          </div>
          <p><strong>Category:</strong> {transaction.category_id}</p>
          <p>{transaction.description}</p>
        </li>
      {/each}
    </ul>
  </div>
  <AddTransaction {transactionGroup} />
{/if}

<style>
  h1 {
    font-size: 60px;
    padding: 0;
    margin: 0;
  }
  .transaction-group-display-container {
    display: flex;
    flex-direction: column;
    /* gap: 2rem;
    padding: 2rem; */
    max-width: 800px;
    margin: 0 auto;
    /* align-items: center;
    justify-content: center; */
  }
  .transaction-item {
    background: #f9f9f9;
    display: flex;
    flex-direction: row;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 10px 15px;
    margin-bottom: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  }
  .transaction-item p {
    margin: 5px 0;
    font-size: 20px;
    color: #444;
  }
  .transaction-title {
    font-weight: bold;
    font-size: 30px;
    margin-right: 10px;
  }

  .transaction-meta {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 5px;
  }

  .transaction-date {
    padding-right: 15px;
  }

  /* h1 {
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }

  h2 {
    font-size: 1.5rem;
    margin-top: 2rem;
  } */
</style>
