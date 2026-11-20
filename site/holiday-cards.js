(() => {
  // Compact holiday cards (R1 #12): open the card an in-page link points to.
  function openTarget() {
    let id;
    try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
    if (!id) return;
    const card = document.getElementById(id);
    const detail = card && card.classList.contains("holiday-card-compact") && card.querySelector("details");
    if (detail && !detail.open) detail.open = true;
  }
  window.addEventListener("hashchange", openTarget);
  openTarget();
})();
