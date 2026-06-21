document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector(".site-header");
  const navLinks = document.querySelectorAll(".menu a");
  const allHashLinks = document.querySelectorAll('a[href^="#"]');
  const sections = document.querySelectorAll("section[id], main[id]");
  const projectCards = document.querySelectorAll(".project-card");
  const shortsCards = document.querySelectorAll(".shorts-card");
  const skillCards = document.querySelectorAll(".skill-card");
  const backToTopLink = document.querySelector('.footer a[href="#home"]');

  function getHeaderHeight() {
    if (header) {
      return header.offsetHeight;
    }

    return 0;
  }

  function scrollToSection(targetId) {
    const target = document.querySelector(targetId);

    if (!target) {
      return;
    }

    const headerHeight = getHeaderHeight();
    const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 18;

    window.scrollTo({
      top: Math.max(targetPosition, 0),
      behavior: "smooth"
    });
  }

  function updateHeaderStyle() {
    if (!header) {
      return;
    }

    if (window.scrollY > 20) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  function updateActiveMenu() {
    const headerHeight = getHeaderHeight();
    const currentPosition = window.scrollY + headerHeight + 120;
    let activeId = "home";

    sections.forEach(function (section) {
      if (currentPosition >= section.offsetTop) {
        activeId = section.id;
      }
    });

    navLinks.forEach(function (link) {
      const href = link.getAttribute("href");

      if (href === "#" + activeId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  allHashLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      const href = link.getAttribute("href");

      if (!href || href === "#") {
        return;
      }

      if (!href.startsWith("#")) {
        return;
      }

      const target = document.querySelector(href);

      if (!target) {
        return;
      }

      event.preventDefault();
      scrollToSection(href);
    });
  });

  function revealOnScroll() {
    const revealItems = document.querySelectorAll(".reveal-item");

    revealItems.forEach(function (item) {
      const itemTop = item.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (itemTop < windowHeight - 80) {
        item.classList.add("is-visible");
      }
    });
  }

  function setupRevealItems() {
    projectCards.forEach(function (card) {
      card.classList.add("reveal-item");
    });

    shortsCards.forEach(function (card) {
      card.classList.add("reveal-item");
    });

    skillCards.forEach(function (card) {
      card.classList.add("reveal-item");
    });

    revealOnScroll();
  }

  function animateNumber(element, targetNumber, suffix) {
    let startNumber = 0;
    const duration = 900;
    const startTime = performance.now();

    function updateNumber(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentValue = Math.floor(startNumber + (targetNumber - startNumber) * progress);

      element.textContent = currentValue.toLocaleString("ko-KR") + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      }
    }

    requestAnimationFrame(updateNumber);
  }

  function setupShortsStatsAnimation() {
    const stats = document.querySelectorAll(".stats strong");

    stats.forEach(function (stat) {
      const originalText = stat.textContent.trim();
      let numberOnly = originalText.replace(/,/g, "");
      let suffix = "";

      if (numberOnly.includes("K")) {
        numberOnly = numberOnly.replace("K", "");
        suffix = "K";
      }

      const targetNumber = Number(numberOnly);

      if (Number.isNaN(targetNumber)) {
        return;
      }

      stat.dataset.originalText = originalText;
      stat.textContent = "0" + suffix;
    });

    const shortsSection = document.querySelector("#shorts");
    let animated = false;

    function checkStatsPosition() {
      if (!shortsSection || animated) {
        return;
      }

      const sectionTop = shortsSection.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (sectionTop < windowHeight - 120) {
        animated = true;

        stats.forEach(function (stat) {
          const originalText = stat.dataset.originalText || stat.textContent;
          let numberOnly = originalText.replace(/,/g, "");
          let suffix = "";

          if (numberOnly.includes("K")) {
            numberOnly = numberOnly.replace("K", "");
            suffix = "K";
          }

          const targetNumber = Number(numberOnly);

          if (Number.isNaN(targetNumber)) {
            stat.textContent = originalText;
            return;
          }

          animateNumber(stat, targetNumber, suffix);
        });
      }
    }

    window.addEventListener("scroll", checkStatsPosition);
    checkStatsPosition();
  }

  function setupProjectClickEffect() {
    projectCards.forEach(function (card) {
      card.addEventListener("mouseenter", function () {
        card.classList.add("is-hovered");
      });

      card.addEventListener("mouseleave", function () {
        card.classList.remove("is-hovered");
      });
    });
  }

  function setupContactCopy() {
    const emailLink = document.querySelector('a[href^="mailto:"]');

    if (!emailLink) {
      return;
    }

    emailLink.addEventListener("click", function () {
      const emailText = emailLink.textContent.trim();

      if (!navigator.clipboard) {
        return;
      }

      navigator.clipboard.writeText(emailText).catch(function () {
        return;
      });
    });
  }

  function updateOnScroll() {
    updateHeaderStyle();
    updateActiveMenu();
    revealOnScroll();
  }

  window.addEventListener("scroll", updateOnScroll, {
    passive: true
  });

  window.addEventListener("resize", function () {
    updateActiveMenu();
    revealOnScroll();
  });

  setupRevealItems();
  setupShortsStatsAnimation();
  setupProjectClickEffect();
  setupContactCopy();
  updateHeaderStyle();
  updateActiveMenu();

  if (backToTopLink) {
    backToTopLink.addEventListener("click", function (event) {
      event.preventDefault();
      scrollToSection("#home");
    });
  }

  console.log("Portfolio site loaded");
});
