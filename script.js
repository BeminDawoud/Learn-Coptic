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
    const response = await fetch("lessons.json");

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
                        alt="${getTitle(lesson.file)}">
                </div>
            `;
    } else {
      preview = `
                <div class="preview">

                    <video
                        muted
                        preload="metadata">

                        <source
                            src="data/${lesson.file}"
                            type="video/mp4">

                    </video>

                </div>
            `;
    }

    card.innerHTML = `

            ${preview}

            <div class="lesson-info">

                <div class="lesson-title">

                    ${getTitle(lesson.file)}

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
    Open Lesson
==================================================*/

function openLesson(lesson) {
  viewer.classList.remove("hidden");

  viewerTitle.textContent = getTitle(lesson.file);

  viewerBody.innerHTML = "";

  const type = getFileType(lesson.file);

  if (type === "image") {
    const img = document.createElement("img");

    img.src = `data/${lesson.file}`;

    viewerBody.appendChild(img);
  } else {
    const video = document.createElement("video");

    video.src = `data/${lesson.file}`;

    video.controls = true;

    video.autoplay = true;

    video.style.width = "100%";

    viewerBody.appendChild(video);
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
    getTitle(lesson.file).toLowerCase().includes(text),
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
