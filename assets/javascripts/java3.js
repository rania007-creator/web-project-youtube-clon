
const videoCardContainer = document.querySelector(".video-wrapper");/*Selects the container
 where video cards will be appended.*/

 //base URLS for youtube API
const api_key = "AIzaSyByG90n8Tp_AxAU9c0oZ14LT3GoozIE0Ms";
const search_http = "https://www.googleapis.com/youtube/v3/search?";
const video_http = "https://www.googleapis.com/youtube/v3/videos?";
const channel_http = "https://www.googleapis.com/youtube/v3/channels?";

const topics = [
  "data science", "digital logic design", "Flutter development", "Java programming",
  "React JS", "UI UX design", "DSA tutorials", "web technologies", "software engineering", "Python programming"
];
//select random topics
const selectedTopic = topics[Math.floor(Math.random() * topics.length)];
loadVideosByTopic(selectedTopic);

function loadVideosByTopic(query) {
  videoCardContainer.innerHTML = "";
  //send a get request to api
  fetch(                           
    search_http +
    new URLSearchParams({//URL query string to an object
      part: "snippet",
      maxResults: 20,
      q: query,
      type: "video",
      regionCode: "PK",
      key: api_key
    })
  )
    .then(res => res.json())
//received youtube data api as a json object
    .then(data => {
      if (!data.items) {
        console.error("No search results:", data);
        return;
      }
      data.items.forEach(item => {
        const videoId = item.id.videoId;
        if (videoId) {
          getVideoDetails(videoId, item.snippet);
        }
      });
    })
    .catch(err => console.error("Search error:", err));
}

function getVideoDetails(videoId, snippet) {
  fetch(
    video_http +
    new URLSearchParams({
      part: "contentDetails,statistics,player", // ✅ Added "player" part
      id: videoId,
      key: api_key
    })
  )
    .then(res => res.json())
    .then(videoData => {
      if (videoData.items && videoData.items.length > 0) {  //fetching video data 
        const video = {
          id: videoId,
          snippet: snippet,
          ...videoData.items[0]
        };
        getChannelIcon(video); // ⬅️ will call makeVideoCard later
      }
    })
    .catch(err => console.error("Video detail error:", err));
}

function getChannelIcon(video_data) {
  fetch(                //fetching channel data
    channel_http +
    new URLSearchParams({
      part: "snippet",
      id: video_data.snippet.channelId,
      key: api_key
    })
  )
    .then(res => res.json())
    //setting channel icons
    .then(data => {
      if (data.items && data.items.length > 0) {
        video_data.channelThumbnail = data.items[0].snippet.thumbnails.default.url;
        makeVideoCard(video_data);
      }
    })
    .catch(err => console.error("Channel icon error:", err));
}
const playVideo = (videoId) => {
  //saves the video id in browser message
  sessionStorage.setItem("videoId", videoId);
  window.location.href = "video-page.html";
};

//creates the actual html card for each video
function makeVideoCard(data) {
  const videoCard = document.createElement("div");
  videoCard.classList.add("col");

  const views = data.statistics?.viewCount || "0";
  const formattedViews = formatViews(views);
  const publishedTime = timeAgo(data.snippet.publishedAt);

  videoCard.innerHTML = `
  <div class="video position-relative">
    <div class="video-content">
      <img src="${data.snippet.thumbnails.high.url}" alt="thumbnail" class="thumbnail">
      <div class="video-menu position-absolute top-0 end-0 p-1">
        <i class="ri-more-2-fill text-white fs-5 three-dot-menu" style="cursor: pointer;"></i>
        <div class="video-options bg-dark text-white p-2 rounded shadow d-none">
          <div class="option-item" data-action="download" data-url="${data.snippet.thumbnails.high.url}">Download</div>
          <div class="option-item" data-action="watch later">Watch Later</div>
          <div class="option-item" data-action="subscribe">Subscribe</div>
          <div class="option-item" data-action="don't recommend">Don't Recommend Channel</div>
        </div>
      </div>
    </div>
    <div class="video-details d-flex align-items-start">
      <div class="channel-logo">
        <img src="${data.channelThumbnail}" alt="channel icon" class="channel-icon">
      </div>
      <div class="detail flex-grow-1">
        <h3 class="title">${data.snippet.title}</h3>
        <div class="channel-name">${data.snippet.channelTitle}</div>
        <div class="views-time text-secondary" style="font-size: 0.8em;">
          ${formattedViews} • ${publishedTime}
        </div>
      </div>
    </div>
  </div>
`;

videoCard.addEventListener("click", () => {
  const videoId = data.id;
  if (videoId) {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
  }
});

  videoCardContainer.appendChild(videoCard);
}
//raw view count to human readable strings
function formatViews(num) {
  num = parseInt(num, 10);
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M views";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K views";
  return num + " views";
}
//video publish date into time ago string

function timeAgo(dateString) {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 }
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
}

const searchHistoryContainer = document.getElementById("searchHistory");

function loadSearchHistory() {
  const saved = JSON.parse(localStorage.getItem("yt-search-history")) || [];
  searchHistoryContainer.innerHTML = "";
  saved.forEach(term => {
    const item = document.createElement("div");
    item.className = "dropdown-item d-flex justify-content-between align-items-center";
    item.innerHTML = `
      <span class="search-text">${term}</span>
      <span class="remove-btn ms-2 text-danger" style="cursor:pointer">&times;</span>
    `;
    item.querySelector(".search-text").addEventListener("click", () => {
      searchInput.value = term;
      loadVideosByTopic(term);
      dropdownMenu.classList.remove("show");
    });
    item.querySelector(".remove-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      removeSearchTerm(term);
    });
    searchHistoryContainer.appendChild(item);
  });
}

function saveSearchTerm(term) {
  let saved = JSON.parse(localStorage.getItem("yt-search-history")) || [];
  if (!saved.includes(term)) {
    saved.unshift(term);
    if (saved.length > 10) saved.pop();
    localStorage.setItem("yt-search-history", JSON.stringify(saved));
    loadSearchHistory();
  }
}

function removeSearchTerm(term) {
  let saved = JSON.parse(localStorage.getItem("yt-search-history")) || [];
  saved = saved.filter(item => item !== term);
  localStorage.setItem("yt-search-history", JSON.stringify(saved));
  loadSearchHistory();
}

const searchInput = document.getElementById("searchInput");
const dropdownMenu = document.getElementById("searchHistory");

searchInput.addEventListener("focus", () => {
  loadSearchHistory();
  dropdownMenu.classList.add("show");
});

document.addEventListener("click", (e) => {
  if (!dropdownMenu.contains(e.target) && e.target !== searchInput) {
    dropdownMenu.classList.remove("show");
  }
});
// responsive search bar toggle for smaller screens (<= 575.98px)
  const searchCol2 = document.querySelector(".header .col-2");
  const searchBtn = document.getElementById("searchBtn");

  if (window.innerWidth <= 575.98 && searchCol2 && searchBtn && searchInput) {
    searchBtn.addEventListener("click", (e) => {
      if (!searchCol2.classList.contains("show-search")) {
        e.preventDefault();
        searchCol2.classList.add("show-search");
        searchInput.focus();
        return;
      }
    });
  }
document.addEventListener("DOMContentLoaded", () => {
  const searchCol2 = document.querySelector(".header .col-2");
  const searchBtn = document.getElementById("searchBtn");

  if (window.innerWidth <= 575.98 && searchCol2 && searchBtn && searchInput) {
    searchBtn.addEventListener("click", (e) => {
      if (!searchCol2.classList.contains("show-search")) {
        e.preventDefault();
        searchCol2.classList.add("show-search");
        searchInput.focus();
        return;
      }
    });
  }
//search button
  if (searchBtn && searchInput) {
    searchBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query !== "") {
        loadVideosByTopic(query);
        saveSearchTerm(query);
      }
    });

    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();//default behavior (like submitting a form or reloading the page).
        const query = searchInput.value.trim();//removes leading/trailing spaces.
        if (query !== "") {
          loadVideosByTopic(query);
          saveSearchTerm(query);
        }
      }
    });
  }

  document.querySelectorAll(".tag").forEach(tag => {
    tag.addEventListener("click", () => {
      const topic = tag.textContent.trim();
      if (topic !== "") {
        loadVideosByTopic(topic);
      }
    });
  });

  loadSearchHistory();
});


const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');

// Show sidebar and only icons
menuToggle.addEventListener('click', () => {
  sidebar.classList.toggle('d-none');
  sidebar.classList.toggle('icon-only');
});

// Handle sidebar item click
document.querySelectorAll('.sidebar-item').forEach(item => {
  item.addEventListener('click', () => {
    const topic = item.getAttribute('data-topic');
    if (topic) {
      loadVideosByTopic(topic); // Already defined function
    }
  });
});
document.addEventListener("click", (e) => {
  // Toggle 3-dot menu
  if (e.target.classList.contains("three-dot-menu")) {
    const options = e.target.nextElementSibling;
    document.querySelectorAll(".video-options").forEach(opt => {
      if (opt !== options) opt.classList.add("d-none");
    });
    options.classList.toggle("d-none");
  }

  // Handle menu options
  if (e.target.classList.contains("option-item")) {
    const action = e.target.getAttribute("data-action");
    const videoUrl = e.target.getAttribute("data-url");

    if (action === "download" && videoUrl) {
      const a = document.createElement("a");
      a.href = videoUrl;
      a.download = "video-thumbnail.jpg";
      document.body.appendChild(a);
      a.click();
      a.remove();

      // Navigate to Downloads section
      document.querySelector('[data-topic="downloads"]').click();
    } else if (action === "watch later") {
      alert("Added to Watch Later");
    } else if (action === "subscribe") {
      alert("Subscribed!");
    } else if (action === "don't recommend") {
      alert("Channel will no longer be recommended.");
    }

    // Close all menus after action
    document.querySelectorAll(".video-options").forEach(opt => opt.classList.add("d-none"));
  }

  // Close menu if click outside
  if (!e.target.closest(".video-menu")) {
    document.querySelectorAll(".video-options").forEach(opt => opt.classList.add("d-none"));
  }
});
// ✅ Enable Voice Search using Web Speech API
const micBtn = document.querySelector(".mic");
const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (recognition && micBtn) {
    const speech = new recognition();
    speech.lang = "en-US";
    speech.continuous = false;
    speech.interimResults = false;

    micBtn.addEventListener("click", () => {
        speech.start();
    });

    speech.onstart = () => {
        console.log("Voice recognition started. Speak now.");
    };

    speech.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log("You said:", transcript);
        searchInput.value = transcript;
        loadVideosByTopic(transcript); // Call your existing function
        saveSearchTerm(transcript);    // Save in history
    };

    speech.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        alert("Microphone access denied or not supported.");
    };
} else {
    console.warn("Speech recognition not supported in this browser.");
}




document.querySelector(".user-icon")?.addEventListener("click", () => {
  const email = localStorage.getItem("userEmail");
  if (!email) {
    alert("Please login first.");
    return;
  }

  fetch(`http://localhost:4000/user/${email}`)
    .then((res) => res.json())
    .then((data) => {
      alert(`Name: ${data.name}\nEmail: ${data.email}`);
    })
    .catch(() => alert("Error fetching user details."));
});

document.querySelector(".user-icon")?.addEventListener("click", () => {
  const email = localStorage.getItem("userEmail");
  if (!email) {
    window.location.href = "/views/login.html";
    return;
  }
//signup
document.getElementById("signupForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const fullName = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value.trim();

  if (!fullName || !email || !password) {
    alert("Please fill all the fields.");
    return;
  }

  try {
    const response = await fetch("http://localhost:4000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: fullName,
        email,
        password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Signup failed.");
      return;
    }

    alert("Account created successfully!");
    // ✅ redirect only after successful response
    window.location.href = "/login";
  } catch (error) {
    alert("Network error. Please try again.");
  }
});

document.getElementById("togglePassword").addEventListener("click", function () {
  const passwordInput = document.getElementById("password");
  const type = passwordInput.type === "password" ? "text" : "password";
  passwordInput.type = type;
  this.textContent = type === "password" ? "Show" : "Hide";
});


  fetch(`http://localhost:4000/user/${email}`)
    .then(res => res.json())
    .then(data => {
      alert(`👤 Account Info\nName: ${data.name}\nEmail: ${data.email}`);
    });
});
