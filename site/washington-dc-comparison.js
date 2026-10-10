(() => {
  const toolbar = document.querySelector(".dc-toolbar");
  const checkbox = document.querySelector("#kitchen-only");
  const status = document.querySelector("#comparison-status");
  if (!toolbar || !checkbox || !status) return;
  const rows = [...document.querySelectorAll("#comparison tbody tr[data-room]")];
  const details = [...document.querySelectorAll(".dc-room[data-room]")];
  function update() {
    for (const element of [...rows, ...details]) {
      element.hidden = checkbox.checked && element.dataset.kitchen !== "published-kitchen";
    }
    const visible = rows.filter(row => !row.hidden).length;
    status.textContent = `${visible} room ${visible === 1 ? "category" : "categories"}${checkbox.checked ? " with a dated published cooking kitchen" : ""}`;
  }
  function revealHashTarget() {
    let id;
    try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
    const target = details.find(element => element.id === id);
    if (!target || !target.hidden) return;
    checkbox.checked = false;
    update();
    target.scrollIntoView({ block: "start" });
  }
  checkbox.addEventListener("change", update);
  window.addEventListener("hashchange", revealHashTarget);
  toolbar.hidden = false;
  update();
  revealHashTarget();
})();
