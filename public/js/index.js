const socket = io();

console.log("hey");

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
        console.log(position)
      const {longitude, latitude} = position.coords;
      socket.emit("send-location", { latitude, longitude});
    },
    (error) => {
      console.log(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
}

const map = L.map('map').setView([0,0], 15);

const markers = {};

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Mady by Mahtv Bansal using <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

socket.on("receive-location", (data) => {
    const {id, longitude, latitude} = data;
    console.log(longitude, latitude)
    map.setView([latitude, longitude]);

    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    }
    else {
        markers[id] = L.marker([latitude, longitude]).addTo(map)
    }
})
console.log(markers)
socket.on("user-disconnected", (id)=> {
    console.log('vndkfnk')
    console.log(id)
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})
