<script setup lang="ts">
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// https://cescobaz.com/2023/06/14/setup-leaflet-with-svelte-and-vite/
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerIconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";


import { ref, defineProps, onMounted, onUnmounted, watch, computed } from 'vue'
import { WorkDetail } from "@/contentScript/104";
export interface NWorkDetail extends WorkDetail {
  tabId: number
  coords: { lat: number, lng: number }
}
const jobs = defineModel('jobs', { type: Array<NWorkDetail>, required: true })
const { center } = defineProps(['center'])
const computeCenter = computed(() => {
  if (center) {
    return center
  } else {
    // Calculate the center from jobs
    if (jobs.value.length === 0) {
      return { lat: 0, lng: 0 } // Default center if no jobs
    }
    // 有時候ContentScript 會抓不到東西 造成這邊job.coords.lat undefined
    // 問題未知

    const sumLat = jobs.value.reduce((sum, job) => sum + job.coords.lat, 0)
    const sumLng = jobs.value.reduce((sum, job) => sum + job.coords.lng, 0)
    const count = jobs.value.length

    return {
      lat: sumLat / count,
      lng: sumLng / count
    }
  }
})
const markers = ref<Array<L.Marker>>([]);

function handlePopupButtonClick(jobId: number) {
  chrome.tabs.update(jobId, { active: true })
  // Add your logic here
}

const createMarker = (job: NWorkDetail) => {
  const { lat, lng } = job.coords || { lat: 0, lng: 0 }
  const marker = L.marker([lat, lng]).addTo(map);
  const popupContent = L.DomUtil.create('div');
  popupContent.innerHTML = `
    <b>${job.jobTitle}</b><br>${job.addr}<br>
    <button id="popupButton_${job.tabId}">Select Job</button>
  `;
  // @ts-ignore
  L.DomEvent.on(popupContent.querySelector(`#popupButton_${job.tabId}`), 'click', () => {
    handlePopupButtonClick(job.tabId);
  });

  marker.bindPopup(popupContent);

  return marker;
};

const updateMarkers = (newJobs: Array<NWorkDetail>, oldJobs: Array<NWorkDetail>) => {
  // Remove old markers
  console.log(oldJobs)
  oldJobs.forEach((oldJob) => {
    if (!newJobs.some(newJob => newJob.tabId === oldJob.tabId)) {
      const marker = markers.value.find(marker => marker.getLatLng().lat === oldJob.coords.lat && marker.getLatLng().lng === oldJob.coords.lng);
      if (marker) {
        //@ts-ignore
        map.removeLayer(marker);
        markers.value = markers.value.filter(m => m !== marker);
      }
    }
  });

  // Add new markers
  newJobs.forEach((newJob) => {
    if (!oldJobs.some(oldJob => oldJob.tabId === newJob.tabId)) {
      const marker = createMarker(newJob);
      markers.value.push(marker);
    }
  });
};

let map: L.Map;


onMounted(() => {
  const initialCenter = computeCenter.value;


  map = L.map("map").setView([initialCenter.lat, initialCenter.lng], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "© OpenStreetMap",
  }).addTo(map);
  setTimeout(() => map.invalidateSize(), 100)
  L.Icon.Default.prototype.options.iconUrl = markerIconUrl;
  L.Icon.Default.prototype.options.iconRetinaUrl = markerIconRetinaUrl;
  L.Icon.Default.prototype.options.shadowUrl = markerShadowUrl;
  L.Icon.Default.imagePath = ""; // necessary to avoid Leaflet adds some prefix to image path.
  // Initialize markers
  if (jobs.value) {
    jobs.value.forEach(job => {
      const marker = createMarker(job);
      markers.value.push(marker);
    });
  }
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
