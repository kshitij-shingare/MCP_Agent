// ==========================================================================
// SANJIVANI SUGAR FACTORY — CLIENT APPLICATION SCRIPT
// Real-time MongoDB Atlas data binding, filter engine & MCP AI query runner
// ==========================================================================

const formatINR = (val) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val || 0);
};

const formatTons = (val) => {
  return new Intl.NumberFormat("en-IN").format(val || 0) + " T";
};

// Global state
let allFarmers = [];

// DOM Elements
const kpiTotalTons = document.getElementById("kpiTotalTons");
const kpiTotalPaid = document.getElementById("kpiTotalPaid");
const kpiTotalPending = document.getElementById("kpiTotalPending");
const kpiTotalFarmers = document.getElementById("kpiTotalFarmers");
const farmersTableBody = document.getElementById("farmersTableBody");
const recordCountLabel = document.getElementById("recordCountLabel");
const villageBarsContainer = document.getElementById("villageBars");

const searchInput = document.getElementById("searchInput");
const villageSelect = document.getElementById("villageSelect");
const pendingOnlyToggle = document.getElementById("pendingOnlyToggle");

const askForm = document.getElementById("askForm");
const userQueryInput = document.getElementById("userQueryInput");
const submitBtn = document.getElementById("submitBtn");
const aiLoadingIndicator = document.getElementById("aiLoadingIndicator");
const aiOutputContent = document.getElementById("aiOutputContent");
const aiResponsePanel = document.getElementById("aiResponsePanel");
const mcpTraceDrawer = document.getElementById("mcpTraceDrawer");
const traceToolName = document.getElementById("traceToolName");
const traceJson = document.getElementById("traceJson");
const answerText = document.getElementById("answerText");

// 1. Fetch Factory Summary
async function loadFactorySummary() {
  try {
    const res = await fetch("/api/summary");
    const json = await res.json();
    if (!json.success) return;

    const { totalFarmers, totalSugarcaneSuppliedTons, totalAmountPaidINR, totalPaymentPendingINR, villageStats } = json.data;

    kpiTotalTons.textContent = new Intl.NumberFormat("en-IN").format(totalSugarcaneSuppliedTons);
    kpiTotalPaid.textContent = formatINR(totalAmountPaidINR);
    kpiTotalPending.textContent = formatINR(totalPaymentPendingINR);
    kpiTotalFarmers.textContent = totalFarmers;

    // Render village breakdown bars
    renderVillageBars(villageStats, totalSugarcaneSuppliedTons);
  } catch (err) {
    console.error("Failed to load factory summary:", err);
  }
}

// 2. Render Village Supply Breakdown
function renderVillageBars(villageStats, totalTons) {
  if (!villageStats) return;
  villageBarsContainer.innerHTML = "";

  const entries = Object.entries(villageStats).sort((a, b) => b[1].tons - a[1].tons);

  entries.forEach(([village, stats]) => {
    const percentage = totalTons > 0 ? Math.round((stats.tons / totalTons) * 100) : 0;

    const item = document.createElement("div");
    item.className = "village-bar-item";
    item.innerHTML = `
      <div class="bar-meta">
        <span class="bar-name">${village} (${stats.farmers} growers)</span>
        <span class="bar-tons">${stats.tons} Tons (${percentage}%)</span>
      </div>
      <div class="bar-track">
        <div class="bar-fill" style="width: ${percentage}%"></div>
      </div>
    `;
    villageBarsContainer.appendChild(item);
  });
}

// 3. Fetch Farmers Directory
async function loadFarmers() {
  try {
    const res = await fetch("/api/farmers");
    const json = await res.json();
    if (!json.success) return;

    allFarmers = json.data;
    renderFarmersTable();
  } catch (err) {
    console.error("Failed to load farmers:", err);
  }
}

// 4. Render Table with Active Filters
function renderFarmersTable() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedVillage = villageSelect.value;
  const pendingOnly = pendingOnlyToggle.checked;

  const filtered = allFarmers.filter((f) => {
    const matchesSearch =
      !searchTerm ||
      f.name.toLowerCase().includes(searchTerm) ||
      f.village.toLowerCase().includes(searchTerm);

    const matchesVillage =
      selectedVillage === "All" ||
      f.village.toLowerCase() === selectedVillage.toLowerCase();

    const matchesPending = !pendingOnly || f.paymentPending > 0;

    return matchesSearch && matchesVillage && matchesPending;
  });

  farmersTableBody.innerHTML = "";

  if (filtered.length === 0) {
    farmersTableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 32px; color: var(--text-tertiary);">
          No sugarcane supplier records match the selected criteria.
        </td>
      </tr>
    `;
    recordCountLabel.textContent = "Showing 0 records";
    return;
  }

  filtered.forEach((farmer) => {
    const isDue = farmer.paymentPending > 0;
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td class="farmer-name-cell">${farmer.name}</td>
      <td><span class="village-badge">${farmer.village}</span></td>
      <td class="text-right tons-val">${farmer.suppliesTons} Tons</td>
      <td class="text-right amount-val">${formatINR(farmer.amountPaid)}</td>
      <td class="text-right pending-val ${isDue ? 'has-pending' : 'zero-pending'}">
        ${formatINR(farmer.paymentPending)}
      </td>
      <td class="text-center">
        <span class="status-pill ${isDue ? 'due' : 'paid'}">
          ${isDue ? 'PAYMENT DUE' : 'FULLY SETTLED'}
        </span>
      </td>
    `;
    farmersTableBody.appendChild(tr);
  });

  recordCountLabel.textContent = `Showing ${filtered.length} of ${allFarmers.length} registered growers`;
}

// 5. Submit AI MCP Query
async function handleAskSubmit(e) {
  if (e) e.preventDefault();
  const question = userQueryInput.value.trim();
  if (!question) return;

  // Set UI Loading state
  submitBtn.disabled = true;
  aiResponsePanel.classList.remove("empty");
  aiLoadingIndicator.classList.remove("hidden");
  aiOutputContent.classList.add("hidden");

  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const json = await res.json();
    aiLoadingIndicator.classList.add("hidden");
    aiOutputContent.classList.remove("hidden");

    if (!json.success) {
      answerText.innerHTML = `<span style="color: var(--accent-danger);">Error: ${json.error}</span>`;
      mcpTraceDrawer.classList.add("hidden");
      return;
    }

    // Display MCP tool execution logs if any tools were called
    if (json.toolsUsed && json.toolsUsed.length > 0) {
      mcpTraceDrawer.classList.remove("hidden");
      const toolNames = json.toolsUsed.map((t) => t.tool).join(", ");
      traceToolName.textContent = `Invoked: ${toolNames}`;
      traceJson.textContent = JSON.stringify(json.toolsUsed, null, 2);
    } else {
      mcpTraceDrawer.classList.add("hidden");
    }

    // Format Markdown/line breaks in answer
    answerText.innerHTML = formatMarkdown(json.answer);
  } catch (err) {
    aiLoadingIndicator.classList.add("hidden");
    aiOutputContent.classList.remove("hidden");
    answerText.innerHTML = `<span style="color: var(--accent-danger);">Communication error: ${err.message}</span>`;
  } finally {
    submitBtn.disabled = false;
  }
}

// Simple Markdown converter for clean display
function formatMarkdown(text) {
  if (!text) return "";
  let formatted = text
    .replace(/^### (.*$)/gim, '<h4 style="margin: 12px 0 6px; color: var(--accent-gold); font-family: var(--font-serif); font-size: 1.15rem;">$1</h4>')
    .replace(/^## (.*$)/gim, '<h3 style="margin: 14px 0 8px; color: #a7f3d0; font-family: var(--font-serif); font-size: 1.3rem;">$1</h3>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/^\s*-\s+(.*$)/gim, '<li style="margin-bottom: 4px;">$1</li>')
    .replace(/^\s*\d+\.\s+(.*$)/gim, '<li style="margin-bottom: 4px;">$1</li>');

  return formatted.replace(/\n\n/g, '<p style="margin-bottom: 10px;"></p>');
}

// Event Listeners
searchInput.addEventListener("input", renderFarmersTable);
villageSelect.addEventListener("change", renderFarmersTable);
pendingOnlyToggle.addEventListener("change", renderFarmersTable);
askForm.addEventListener("submit", handleAskSubmit);

// Sample Prompt Chip Click Handlers
document.querySelectorAll(".chip-prompt").forEach((chip) => {
  chip.addEventListener("click", () => {
    const q = chip.getAttribute("data-query");
    userQueryInput.value = q;
    handleAskSubmit();
  });
});

// Initial boot
loadFactorySummary();
loadFarmers();
