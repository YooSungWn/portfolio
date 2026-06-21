document.addEventListener("DOMContentLoaded", function () {
const YOUTUBE_STATS_API = "";
const BOARDNET_METRICS_API = "";
const BOARDNET_SITE_URL = "/boardnet/";

const header = document.querySelector(".site-header");
const navLinks = document.querySelectorAll(".menu a");
const hashLinks = document.querySelectorAll("a[data-nav]");
const sections = document.querySelectorAll(".page-section, main[id]");
const projectCards = document.querySelectorAll(".project-card");
const shortsCards = document.querySelectorAll(".shorts-card");
const skillCards = document.querySelectorAll(".skill-card");

const boardnetStatus = document.querySelector("#boardnetStatus");
const boardnetViews = document.querySelector("#boardnetViews");
const boardnetLikes = document.querySelector("#boardnetLikes");
const youtubeUpdated = document.querySelector("#youtubeUpdated");

function getHeaderHeight() {
if (header) {
return header.offsetHeight;
}

```
return 0;
```

}

function scrollToSection(targetId) {
const target = document.querySelector(targetId);

```
if (!target) {
  return;
}

const headerHeight = getHeaderHeight();
const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 18;

window.scrollTo({
  top: Math.max(targetPosition, 0),
  behavior: "smooth"
});
```

}

function updateHeaderStyle() {
if (!header) {
return;
}

```
if (window.scrollY > 20) {
  header.classList.add("is-scrolled");
} else {
  header.classList.remove("is-scrolled");
}
```

}

function updateActiveMenu() {
const headerHeight = getHeaderHeight();
const currentPosition = window.scrollY + headerHeight + 120;
let activeId = "home";

```
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
```

}

hashLinks.forEach(function (link) {
link.addEventListener("click", function (event) {
const href = link.getAttribute("href");

```
  if (!href || !href.startsWith("#")) {
    return;
  }

  const target = document.querySelector(href);

  if (!target) {
    return;
  }

  event.preventDefault();
  scrollToSection(href);
});
```

});

function revealOnScroll() {
const revealItems = document.querySelectorAll(".reveal-item");

```
revealItems.forEach(function (item) {
  const itemTop = item.getBoundingClientRect().top;
  const windowHeight = window.innerHeight;

  if (itemTop < windowHeight - 80) {
    item.classList.add("is-visible");
  }
});
```

}

function setupRevealItems() {
projectCards.forEach(function (card) {
card.classList.add("reveal-item");
});

```
shortsCards.forEach(function (card) {
  card.classList.add("reveal-item");
});

skillCards.forEach(function (card) {
  card.classList.add("reveal-item");
});

revealOnScroll();
```

}

function formatNumber(value) {
const number = Number(value);

```
if (Number.isNaN(number)) {
  return value;
}

return number.toLocaleString("ko-KR");
```

}

function updateShortsCard(card, video) {
if (!card || !video) {
return;
}

```
const title = card.querySelector("h3");
const description = card.querySelector(".shorts-body p");
const image = card.querySelector(".shorts-thumb img");
const link = card.querySelector(".inline-link");
const views = card.querySelector('[data-stat="views"]');
const likes = card.querySelector('[data-stat="likes"]');
const comments = card.querySelector('[data-stat="comments"]');

if (title && video.title) {
  title.textContent = video.title;
}

if (description && video.description) {
  description.textContent = video.description;
}

if (image && video.thumbnail) {
  image.src = video.thumbnail;
}

if (link && video.url) {
  link.href = video.url;
}

if (views && video.views !== undefined) {
  views.textContent = formatNumber(video.views);
}

if (likes && video.likes !== undefined) {
  likes.textContent = formatNumber(video.likes);
}

if (comments && video.comments !== undefined) {
  comments.textContent = formatNumber(video.comments);
}
```

}

async function loadYouTubeStats() {
if (!YOUTUBE_STATS_API) {
return;
}

```
try {
  const response = await fetch(YOUTUBE_STATS_API, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("YouTube API response error");
  }

  const videos = await response.json();

  shortsCards.forEach(function (card) {
    const videoId = card.dataset.videoId;

    const matchedVideo = videos.find(function (video) {
      return video.id === videoId;
    });

    updateShortsCard(card, matchedVideo);
  });

  if (youtubeUpdated) {
    youtubeUpdated.textContent = "유튜브 통계: 방금 업데이트됨";
  }
} catch (error) {
  if (youtubeUpdated) {
    youtubeUpdated.textContent = "유튜브 통계: 불러오기 실패";
  }

  console.log("YouTube 통계 불러오기 실패", error);
}
```

}

async function checkBoardNetStatus() {
if (!boardnetStatus) {
return;
}

```
try {
  const response = await fetch(BOARDNET_SITE_URL, {
    cache: "no-store"
  });

  if (response.ok) {
    boardnetStatus.textContent = "온라인";
  } else {
    boardnetStatus.textContent = "확인 필요";
  }
} catch (error) {
  boardnetStatus.textContent = "오프라인";
}
```

}

async function loadBoardNetMetrics() {
if (!BOARDNET_METRICS_API) {
if (boardnetViews) {
boardnetViews.textContent = "연동 전";
}

```
  if (boardnetLikes) {
    boardnetLikes.textContent = "연동 전";
  }

  return;
}

try {
  const response = await fetch(BOARDNET_METRICS_API, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("BoardNet metrics response error");
  }

  const data = await response.json();

  if (boardnetViews && data.views !== undefined) {
    boardnetViews.textContent = formatNumber(data.views);
  }

  if (boardnetLikes && data.likes !== undefined) {
    boardnetLikes.textContent = formatNumber(data.likes);
  }
} catch (error) {
  if (boardnetViews) {
    boardnetViews.textContent = "불러오기 실패";
  }

  if (boardnetLikes) {
    boardnetLikes.textContent = "불러오기 실패";
  }

  console.log("BoardNet 통계 불러오기 실패", error);
}
```

}

function setupCardHover() {
projectCards.forEach(function (card) {
card.addEventListener("mouseenter", function () {
card.classList.add("is-hovered");
});

```
  card.addEventListener("mouseleave", function () {
    card.classList.remove("is-hovered");
  });
});
```

}

function setupImageFallback() {
const imageBlocks = document.querySelectorAll(".minimal-scene, .project-image, .shorts-thumb, .profile-image");

```
imageBlocks.forEach(function (block) {
  const image = block.querySelector("img");

  if (!image) {
    return;
  }

  image.addEventListener("error", function () {
    image.style.display = "none";
  });
});
```

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
setupCardHover();
setupImageFallback();
updateHeaderStyle();
updateActiveMenu();

checkBoardNetStatus();
loadBoardNetMetrics();
loadYouTubeStats();

console.log("Portfolio site loaded");
});
