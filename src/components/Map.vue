<script setup>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ref, defineProps, onMounted, onUnmounted, watch } from 'vue'

const jobs = defineModel('jobs')

const markers = ref([]);

const createMarker = (job) => {
  const marker = L.marker([job.lat, job.lng]).addTo(map);
  marker.bindPopup(`<b>${job.name}</b><br>${job.address}`);
  return marker;
};

const updateMarkers = (newJobs, oldJobs) => {
  // Remove old markers
  oldJobs.forEach((oldJob) => {
    if (!newJobs.some(newJob => newJob.id === oldJob.id)) {
      const marker = markers.value.find(marker => marker.getLatLng().lat === oldJob.lat && marker.getLatLng().lng === oldJob.lng);
      if (marker) {
        map.removeLayer(marker);
        markers.value = markers.value.filter(m => m !== marker);
      }
    }
  });

  // Add new markers
  newJobs.forEach((newJob) => {
    if (!oldJobs.some(oldJob => oldJob.id === newJob.id)) {
      const marker = createMarker(newJob);
      markers.value.push(marker);
    }
  });
};

let map;
onMounted(() => {
  console.log(jobs)


  map = L.map("map").setView([51.505, -0.09], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "© OpenStreetMap",
  }).addTo(map);
  setTimeout(() => map.invalidateSize(), 100)
  // Initialize markers
  jobs.value.forEach(job => {
    const marker = createMarker(job);
    markers.value.push(marker);
  });

  watch(
    () => [...jobs.value],
    (newJobs, oldJobs) => {
      updateMarkers(newJobs, oldJobs);
    },
    { deep: true }
  );
});
onUnmounted(() => {
  console.log(map.getCenter())
})

</script>

<template>
  <div id="map"></div>
</template>

<style scoped>
#map {
  width: 100%;
  height: 100%;
  border: 3px green solid;

}
</style>
