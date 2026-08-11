let playlist = window.PLAYLIST || [];
let index = playlist.findIndex(s => s.youtubeId) >= 0 ? playlist.findIndex(s => s.youtubeId) : 0;
let player = null;
let ready = false;
let timer = null;

const $ = id => document.getElementById(id);
const title = $("title"), artist = $("artist"), duration = $("duration"), elapsed = $("elapsed");
const seek = $("seek"), playBtn = $("play"), hint = $("hint"), songList = $("songList");

function fmt(sec){ if(!Number.isFinite(sec)) return "—"; sec=Math.max(0,Math.floor(sec)); return `${Math.floor(sec/60)}:${String(sec%60).padStart(2,"0")}`; }

function renderList(){
  songList.innerHTML = playlist.map((s,i)=>`
    <div class="song ${i===index?"active":""}" data-i="${i}">
      <div class="num">${String(i+1).padStart(2,"0")}</div>
      <div><div class="song-title">${escapeHtml(s.title)}</div><div class="song-artist">${escapeHtml(s.artist)}</div></div>
    </div>`).join("");
  document.querySelectorAll(".song").forEach(el=>el.onclick=()=>selectSong(Number(el.dataset.i)));
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}

function updateMeta(){
  const s=playlist[index]; if(!s) return;
  title.textContent=s.title; artist.textContent=s.artist + (s.album ? " · " + s.album : "");
  $("art").textContent = "♥";
  renderList();
}

function searchSong(s){
  const q=encodeURIComponent(`${s.title} ${s.artist} Tamil`);
  window.open(`https://www.youtube.com/results?search_query=${q}`,"_blank","noopener");
}

function loadCurrent(auto=false){
  const s=playlist[index]; if(!s) return;
  updateMeta();
  if(!s.youtubeId){
    hint.textContent="This song needs a YouTube video ID — opening search.";
    searchSong(s);
    return;
  }
  if(!ready || !player) return;
  player.loadVideoById({videoId:s.youtubeId});
  if(!auto) player.pauseVideo();
  hint.textContent="Playing through YouTube";
}

function selectSong(i){
  index=i; updateMeta();
  closeDrawer();
  const s=playlist[index];
  if(s.youtubeId && ready){ player.loadVideoById({videoId:s.youtubeId}); }
  else { searchSong(s); }
}

function next(){ index=(index+1)%playlist.length; selectSong(index); }
function prev(){ index=(index-1+playlist.length)%playlist.length; selectSong(index); }

$("play").onclick=()=>{
  const s=playlist[index];
  if(!s.youtubeId){ searchSong(s); return; }
  if(!ready){ hint.textContent="Loading YouTube player…"; return; }
  const state=player.getPlayerState();
  if(state===1){player.pauseVideo();} else {player.playVideo();}
};
$("next").onclick=next; $("prev").onclick=prev;

seek.oninput=()=>{
  if(player && ready){ const d=player.getDuration()||0; player.seekTo((Number(seek.value)/100)*d,true); }
};

function openDrawer(){$("drawer").classList.add("open");$("scrim").classList.add("show");$("drawer").setAttribute("aria-hidden","false")}
function closeDrawer(){$("drawer").classList.remove("open");$("scrim").classList.remove("show");$("drawer").setAttribute("aria-hidden","true")}
$("playlistBtn").onclick=openDrawer; $("closeDrawer").onclick=closeDrawer; $("scrim").onclick=closeDrawer;

function onYouTubeIframeAPIReady(){
  player=new YT.Player("player",{
    width:200,height:200,
    videoId: playlist[index]?.youtubeId || "",
    playerVars:{playsinline:1,controls:0,rel:0},
    events:{
      onReady:()=>{ready=true; updateMeta(); hint.textContent="Tap play to start";},
      onStateChange:e=>{
        if(e.data===YT.PlayerState.PLAYING){
          playBtn.textContent="Ⅱ"; hint.textContent="Playing through YouTube";
        } else if(e.data===YT.PlayerState.PAUSED){
          playBtn.textContent="▶";
        } else if(e.data===YT.PlayerState.ENDED){
          next();
        }
      }
    }
  });
}

setInterval(()=>{
  if(player && ready){
    const d=player.getDuration()||0, c=player.getCurrentTime()||0;
    elapsed.textContent=fmt(c); duration.textContent=fmt(d);
    seek.value=d?((c/d)*100):0;
  }
},500);

const tag=document.createElement("script");
tag.src="https://www.youtube.com/iframe_api";
document.head.appendChild(tag);
updateMeta();
