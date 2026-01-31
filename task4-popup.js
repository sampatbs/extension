chrome.storage.local.get(null, (data) => {
const list = document.getElementById("stats");
list.innerHTML = "";


if (!data || Object.keys(data).length === 0) {
list.innerHTML = "<li>No data yet</li>";
return;
}


Object.entries(data).forEach(([site, info]) => {
if (!info || typeof info.time !== "number") return;


const minutes = (info.time / 60000).toFixed(2);
const category = info.category || "Neutral";


const li = document.createElement("li");
li.textContent = `${site} - ${minutes} min (${category})`;
list.appendChild(li);
});
});