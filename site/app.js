const chips = [...document.querySelectorAll(".chip")];
const activities = [...document.querySelectorAll(".activity-card")];

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const filter = chip.dataset.filter;
    chips.forEach((item) => item.classList.toggle("active", item === chip));
    activities.forEach((activity) => {
      const tags = (activity.dataset.tags || "").split(" ");
      activity.hidden = filter !== "all" && !tags.includes(filter);
    });
  });
});
