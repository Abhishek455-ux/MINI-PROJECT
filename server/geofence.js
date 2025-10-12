let geofence = { lat: 19.0760, lng: 72.8777, radius: 500 }; // Example: Mumbai, 500m

function setGeofence(lat, lng, radius) {
    geofence = { lat, lng, radius };
}

function checkLocationAndMarkAttendance() {
    navigator.geolocation.getCurrentPosition(pos => {
        const { latitude, longitude } = pos.coords;
        const distance = getDistanceFromLatLonInMeters(latitude, longitude, geofence.lat, geofence.lng);
        if (distance > geofence.radius) {
            showWarning("You are outside the allowed area. Attendance not marked.");
            return;
        }
        markAttendance();
    });
}

function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
    // Haversine formula
    const R = 6371000;
    const dLat = (lat2-lat1) * Math.PI/180;
    const dLon = (lon2-lon1) * Math.PI/180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}
