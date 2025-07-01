<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { currentUser } from "../../../stores/user.js";
  import { goto } from "$app/navigation";

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
      // populating pie chart data
      //   if (transactionGroup && transactionGroup.transactions) {
      //     const categoryTotals = {};
      //     for (const tx of transactionGroup.transactions) {
      //       if (!categoryTotals[tx.category]) {
      //         categoryTotals[tx.category] = 0;
      //       }
      //       categoryTotals[tx.category] += tx.amount;
      //     }

      //     options.labels = Object.keys(categoryTotals);
      //     series = Object.values(categoryTotals);
      //   }
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

{#if transactionGroup}
  <h1>{transactionGroup.name}</h1>
  <p>{transactionGroup.description}</p>
  <p>Total: ${transactionGroup.total}</p>
  {#if ApexCharts}
    <ApexCharts {options} {series} type="pie" height="350" />
  {/if}
{/if}
