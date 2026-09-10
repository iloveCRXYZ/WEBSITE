const LINKS = {
  discord:      "https://discord.com/users/1262858645197164665",
  youtubeMusic1:"https://music.youtube.com/playlist?list=PLLCN5vtbAvaxm1YhUd5-BSyqwdIW0XdCK&si=qC-nB_XnoNo0U3dh",
  youtubeMusic2:"https://music.youtube.com/playlist?list=PLLCN5vtbAvawKBYv6VHi3EI56_6d6t7m6&si=6Wqcu-MhuhMI8kNp",
  youtube:      "https://www.youtube.com/@00CRXYZ",
  spotify:      "https://open.spotify.com/user/31ivq4ir5groo4woiqxqfrgs63ly?si=8a7bcc7c910e4a5f",
  github:       "https://github.com/iloveCRXYZ",
  twitch:       "https://www.twitch.tv/ilovecrxyz",
  steam:        "https://steamcommunity.com/profiles/76561199518238305/"
};

document.addEventListener("DOMContentLoaded", () => {
  const techGrid = document.querySelector(".tech-grid");
  if (techGrid) {
    const categories = [
      {
        title: "Coding Languages",
        items: ["C++", "Python", "JavaScript", "CSS", "HTML5", "TypeScript" , "Java" ]
      },
      {
        title: "Databases",
        items: ["MySQL" , "Supabase" , "MongoDB"]
      },
      {
        title: "IDE",
        items: ["Vs Studio" , "Notepad++" , "Vim"]
      },
      {
        title: "Tools",
        items: [ "Node.js", "Cloudflare", "Unity", "Blender", "Git", "VirtualBox" , "XAMPP"  ]
      },
      {
        title: "Frameworks",
        items: [ "Angular", "Expo", "React Native"]
      },
      {
        title: "Operating Systems",
        items: ["Linux", "Kali Linux", "Windows"]
      }
    ];
    const techItems = [...techGrid.querySelectorAll(":scope > .tech-item")];

    techGrid.replaceChildren(...categories.map(({ title, items }) => {
      const category = document.createElement("div");
      category.className = "tech-category";

      const heading = document.createElement("div");
      heading.className = "tech-category-title";
      heading.textContent = title;

      const categoryGrid = document.createElement("div");
      categoryGrid.className = "tech-category-grid";
      items.forEach((name) => {
        const item = techItems.find((techItem) =>
          techItem.querySelector(".tech-label")?.textContent.trim() === name
        );
        if (item) categoryGrid.append(item);
      });

      category.append(heading, categoryGrid);
      return category;
    }));
  }

  document.querySelectorAll("[data-link]").forEach((el) => {
    const key = el.getAttribute("data-link");
    const url = LINKS[key];
    if (!url) return;

    el.style.cursor = "pointer";
    el.setAttribute("role", "link");
    el.setAttribute("tabindex", "0");

    const open = () => window.open(url, "_blank", "noopener");
    el.addEventListener("click", open);
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });
  });

  const player = document.querySelector(".player");
  const audio = player?.querySelector("[data-player-audio]");
  const playBtn = player?.querySelector("[data-action='play-pause']");
  const previousBtn = player?.querySelector("[data-action='previous-track']");
  const nextBtn = player?.querySelector("[data-action='next-track']");
  const title = player?.querySelector(".player-title");
  const art = player?.querySelector(".player-art");
  const artImage = player?.querySelector(".player-art-image");
  const currentTime = player?.querySelector("[data-player-current]");
  const duration = player?.querySelector("[data-player-duration]");
  const progressBar = player?.querySelector(".bar");
  const playlistButton = player?.querySelector("[data-action='toggle-playlist']");
  const playlist = player?.parentElement?.querySelector("[data-player-playlist]");

  if (player && audio && playBtn && title && art && artImage) {
    const tracks = [
      {
        title: "Death Metal",
        audio: "assets/sounds/DᐳEᐳAᐳTᐳHᐳMᐳEᐳTᐳAᐳL.mp3",
        art: "assets/logos/DᐳEᐳAᐳTᐳHᐳMᐳEᐳTᐳAᐳL.jpg"
      },
      {
        title: "Summer Bummer (Lights On)",
        audio: "assets/sounds/RhyRhy - Summer Bummer (Lights On).mp3",
        art: "assets/logos/Summer Bummer (Lights On).jpg"
      },
      {
        title: "Целоваться (Hardtekk)",
        audio: "assets/sounds/Целоваться (Hardtekk).mp3",
        art: "assets/logos/Целоваться (Hardtekk)jpg.jpg"
      },
      {
        title: "Did It First",
        audio: "assets/sounds/Ice Spice, Central Cee - Did It First.mp3",
        art: "assets/logos/Did It First.jpg"
      },
      {
        title: "ETA",
        audio: "assets/sounds/NEMZZZ - ETA (FEAT. LUCIANO).mp3",
        art: "assets/logos/ETA.jpg"
      }
    ];
    let trackIndex = 0;

    const renderPlaylist = () => {
      if (!playlist) return;
      playlist.replaceChildren(...tracks.map((track, index) => {
        const item = document.createElement("button");
        item.type = "button";
        item.className = "playlist-item";
        item.dataset.trackIndex = index;
        item.innerHTML = `<img src="${track.art}" alt=""><span>${track.title}</span>`;
        item.addEventListener("click", () => {
          loadTrack(index, true);
          playlist.hidden = true;
          playlistButton?.setAttribute("aria-expanded", "false");
        });
        return item;
      }));
    };

    const updatePlaylistSelection = () => {
      playlist?.querySelectorAll(".playlist-item").forEach((item) => {
        item.classList.toggle("is-current", Number(item.dataset.trackIndex) === trackIndex);
      });
    };

    const formatTime = (seconds) => {
      if (!Number.isFinite(seconds)) return "0:00";
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, "0");
      return `${minutes}:${remainingSeconds}`;
    };

    const updatePlayIcon = () => {
      playBtn.querySelector("svg").innerHTML = audio.paused
        ? '<path d="M6 4l14 8-14 8V4z"/>'
        : '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
      playBtn.setAttribute("aria-label", audio.paused ? "Play" : "Pause");
    };

    const loadTrack = (index, shouldPlay = false) => {
      trackIndex = (index + tracks.length) % tracks.length;
      const track = tracks[trackIndex];
      title.textContent = track.title;
      audio.src = track.audio;
      audio.load();
      artImage.onload = () => art.classList.add("has-image");
      artImage.onerror = () => art.classList.remove("has-image");
      artImage.src = track.art;
      if (currentTime) currentTime.textContent = "0:00";
      if (duration) duration.textContent = "0:00";
      if (progressBar) progressBar.style.setProperty("--progress", "0%");
      updatePlaylistSelection();
      if (shouldPlay) audio.play().catch(() => {});
      updatePlayIcon();
    };

    playBtn.addEventListener("click", () => {
      if (audio.paused) audio.play().catch(() => {});
      else audio.pause();
    });
    const skipTrack = (event, direction) => {
      event.preventDefault();
      audio.pause();
      loadTrack(trackIndex + direction, true);
    };
    previousBtn?.addEventListener("click", (event) => skipTrack(event, -1));
    nextBtn?.addEventListener("click", (event) => skipTrack(event, 1));
    playlistButton?.addEventListener("click", () => {
      if (!playlist) return;
      playlist.hidden = !playlist.hidden;
      playlistButton.setAttribute("aria-expanded", String(!playlist.hidden));
    });
    audio.addEventListener("play", updatePlayIcon);
    audio.addEventListener("pause", updatePlayIcon);
    audio.addEventListener("loadedmetadata", () => {
      if (duration) duration.textContent = formatTime(audio.duration);
    });
    audio.addEventListener("timeupdate", () => {
      if (currentTime) currentTime.textContent = formatTime(audio.currentTime);
      if (progressBar && audio.duration) {
        progressBar.style.setProperty("--progress", `${(audio.currentTime / audio.duration) * 100}%`);
      }
    });
    audio.addEventListener("ended", () => loadTrack(trackIndex + 1, true));
    renderPlaylist();
    loadTrack(Math.floor(Math.random() * tracks.length), true);
  }
});
