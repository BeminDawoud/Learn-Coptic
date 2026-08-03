/*==================================================
    Learn Coptic
    script.js
==================================================*/

const lessonContainer = document.getElementById("lessonContainer");
const searchBox = document.getElementById("searchBox");

const viewer = document.getElementById("viewer");
const viewerTitle = document.getElementById("viewerTitle");
const viewerBody = document.getElementById("viewerBody");
const closeViewer = document.getElementById("closeViewer");

const scrollTopBtn = document.getElementById("scrollTopBtn");

let lessons = [];
let filteredLessons = [];
let currentIndex = -1;

/*==================================================
    Load lessons.json
==================================================*/

async function loadLessons() {
  try {
    const response = await fetch(`lessons.json?v=${Date.now()}`);

    lessons = await response.json();

    filteredLessons = [...lessons];

    renderLessons(filteredLessons);
  } catch (error) {
    lessonContainer.innerHTML = `
            <h2 style="text-align:center;color:red;">
                Failed to load lessons.json
            </h2>
        `;

    console.error(error);
  }
}

/*==================================================
    Determine File Type
==================================================*/

function getFileType(file) {
  const extension = file.split(".").pop().toLowerCase();

  if (["jpg", "jpeg", "png", "webp", "gif"].includes(extension)) return "image";

  if (["mp4", "webm", "ogg"].includes(extension)) return "video";

  return "unknown";
}

/*==================================================
    Remove Extension
==================================================*/

function getTitle(file) {
  return file.replace(/\.[^/.]+$/, "");
}

/*==================================================
    Get YouTube ID
==================================================*/

function getYouTubeID(url) {
  if (!url) return "";

  if (url.includes("youtu.be/")) {
    return url.split("youtu.be/")[1].split("?")[0];
  }

  if (url.includes("/shorts/")) {
    return url.split("/shorts/")[1].split("?")[0];
  }

  if (url.includes("watch?v=")) {
    return url.split("watch?v=")[1].split("&")[0];
  }

  return "";
}

/*==================================================
    Get YouTube Thumbnail
==================================================*/

function getThumbnail(url) {
  const id = getYouTubeID(url);

  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

/*==================================================
    Create Cards
==================================================*/

function renderLessons(list) {
  lessonContainer.innerHTML = "";

  list.forEach((lesson, index) => {
    const type = getFileType(lesson.file);

    const card = document.createElement("div");

    card.className = "lesson-card";

    let preview = "";

    if (type === "image") {
      preview = `
                <div class="preview">
                    <img
                        src="data/${lesson.file}"
                        alt="${lesson.title}">
                </div>
            `;
    } else {
      preview = `
        <div class="preview video-preview">

            <img
                src="${getThumbnail(lesson.videoLink)}"
                alt="${lesson.title}">

            <div class="play-overlay">
                ▶
            </div>

        </div>
    `;
    }

    card.innerHTML = `

            ${preview}

            <div class="lesson-info">

                <div class="lesson-title">

                    ${lesson.title}

                </div>

                <div class="lesson-type">

                    ${type === "video" ? "🎥 فيديو" : "🖼 صورة"}

                </div>

            </div>

        `;

    card.addEventListener("click", () => {
      currentIndex = index;

      openLesson(list[index]);
    });

    lessonContainer.appendChild(card);
  });
}

/*==================================================
    Get YouTube Embed Link
==================================================*/

function getEmbedLink(url) {
  if (!url) return "";

  // https://youtu.be/VIDEO_ID
  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  // https://youtube.com/shorts/VIDEO_ID
  if (url.includes("/shorts/")) {
    const id = url.split("/shorts/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  // https://www.youtube.com/watch?v=VIDEO_ID
  if (url.includes("watch?v=")) {
    const id = url.split("watch?v=")[1].split("&")[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  return url;
}

/*==================================================
    Open Lesson
==================================================*/

function openLesson(lesson) {
  viewer.classList.remove("hidden");

  viewerTitle.textContent = lesson.title;

  viewerBody.innerHTML = "";

  const extension = lesson.file.split(".").pop().toLowerCase();

  if (["jpg", "jpeg", "png", "webp", "gif"].includes(extension)) {
    const img = document.createElement("img");

    img.src = `data/${lesson.file}`;

    img.alt = lesson.title;

    viewerBody.appendChild(img);
  } else {
    const iframe = document.createElement("iframe");

    iframe.src = getEmbedLink(lesson.videoLink);

    iframe.width = "100%";

    iframe.height = "600";

    iframe.allowFullscreen = true;

    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";

    iframe.style.border = "none";

    iframe.style.borderRadius = "15px";

    viewerBody.appendChild(iframe);
  }
}
/*==================================================
    Close Viewer
==================================================*/

function closeLesson() {
  const video = viewerBody.querySelector("video");

  if (video) {
    video.pause();
    video.currentTime = 0;
  }

  viewer.classList.add("hidden");

  viewerBody.innerHTML = "";
}

/*==================================================
    Next Lesson
==================================================*/

function nextLesson() {
  if (currentIndex >= filteredLessons.length - 1) return;

  currentIndex++;

  openLesson(filteredLessons[currentIndex]);
}

/*==================================================
    Previous Lesson
==================================================*/

function previousLesson() {
  if (currentIndex <= 0) return;

  currentIndex--;

  openLesson(filteredLessons[currentIndex]);
}

/*==================================================
    Search
==================================================*/

searchBox.addEventListener("input", function () {
  const text = this.value.trim().toLowerCase();

  filteredLessons = lessons.filter((lesson) =>
    lesson.title.toLowerCase().includes(text),
  );

  renderLessons(filteredLessons);
});

/*==================================================
    Close Button
==================================================*/

closeViewer.addEventListener("click", closeLesson);

/*==================================================
    Click Outside Viewer
==================================================*/

viewer.addEventListener("click", function (e) {
  if (e.target === viewer) closeLesson();
});

/*==================================================
    Keyboard Shortcuts
==================================================*/

document.addEventListener("keydown", function (e) {
  if (viewer.classList.contains("hidden")) return;

  switch (e.key) {
    case "Escape":
      closeLesson();
      break;

    case "ArrowRight":
      previousLesson();
      break;

    case "ArrowLeft":
      nextLesson();
      break;
  }
});

/*==================================================
    Scroll To Top Button
==================================================*/

window.addEventListener("scroll", function () {
  if (window.scrollY > 300) scrollTopBtn.style.display = "block";
  else scrollTopBtn.style.display = "none";
});

scrollTopBtn.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

/*==================================================
    Start Website
==================================================*/

loadLessons();
