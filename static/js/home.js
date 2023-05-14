function initializeTooltips() {
    var tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    var tooltipOptions = {
      trigger: "click",
    };
    var tooltipInstances = [];
  
    tooltips.forEach(function (tooltip) {
      var instance = new bootstrap.Tooltip(tooltip, tooltipOptions);
      tooltipInstances.push(instance);
    });
  }
  
  function toggleIcons() {
    const botIcon = document.querySelector(".bot-icon");
    const focusIcon = document.querySelector(".focus-icon");
    const modal = document.querySelector("#exampleModal");
 
  }
  
  document.addEventListener("DOMContentLoaded", function () {
    initializeTooltips();
  
    document.querySelector(".wiz-bot-btn").addEventListener("click", toggleIcons);
  });
  