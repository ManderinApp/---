import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBhyucLkaEKzzFirNoYuNHAMnbiDd8_vHg",
  authDomain: "spogady-map.firebaseapp.com",
  projectId: "spogady-map",
  storageBucket: "spogady-map.firebasestorage.app",
  messagingSenderId: "772600864295",
  appId: "1:772600864295:web:371f05287be64c04867802",
  measurementId: "G-TJC2YH0JVF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const map = L.map('map').setView([48.3794, 31.1656], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

map.on('click', async (e) => {
  const name = prompt("Введіть ваше ім’я:");
  const text = prompt("Поділіться своїм спогадом:");
  const timestamp = new Date().toISOString();

  if (name && text) {
    await addDoc(collection(db, "spogady"), {
      name,
      text,
      lat: e.latlng.lat,
      lng: e.latlng.lng,
      timestamp
    });
  }
});

onSnapshot(collection(db, "spogady"), (snapshot) => {
  snapshot.docChanges().forEach(change => {
    if (change.type === "added") {
      const data = change.doc.data();
      const date = new Date(data.timestamp).toLocaleString("uk-UA");
      const popup = `<b>${data.name}</b><br>${data.text}<br><small>${date}</small>`;
      L.marker([data.lat, data.lng]).addTo(map).bindPopup(popup);
    }
  });
});
