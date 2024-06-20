<script setup lang="ts">

import '@/assets/index.css'
import { Tabs, TabsContent, TabsTrigger, TabsList } from '@/components/ui/tabs';
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card';

import { ref, onMounted } from 'vue'
import Map from '@/components/Map.vue';
import WorkTable from '@/components/WorkTable.vue';
const countSync = ref(0)
const link = ref('https://github.com/guocaoyi/create-chrome-ext')

onMounted(() => {
  chrome.storage.sync.get(['count'], (result) => {
    countSync.value = result.count ?? 0
  })

  chrome.runtime.onMessage.addListener((request) => {
    if (request.type === 'COUNT') {
      countSync.value = request?.count ?? 0
    }
  })
})

const jobs = ref([{ "id": 1, "name": "Analyst Programmer", "lat": 30.108216, "lng": 104.677091, "address": "59477 Mockingbird Drive" },
{ "id": 2, "name": "VP Product Management", "lat": 14.4437531, "lng": 102.8514837, "address": "5 Myrtle Alley" },
{ "id": 3, "name": "Computer Systems Analyst II", "lat": 38.944858, "lng": 106.639241, "address": "94560 Glacier Hill Circle" },
{ "id": 4, "name": "Payment Adjustment Coordinator", "lat": 5.8520355, "lng": -55.2038278, "address": "96 Mayer Drive" },
{ "id": 5, "name": "Geological Engineer", "lat": 5.5156762, "lng": 100.4188073, "address": "9 Roth Park" },
{ "id": 6, "name": "Marketing Manager", "lat": -6.6816357, "lng": -78.522826, "address": "8 Superior Point" },
{ "id": 7, "name": "Analyst Programmer", "lat": 53.5483785, "lng": 10.078217, "address": "34556 Kedzie Parkway" },
{ "id": 8, "name": "Chemical Engineer", "lat": 50.8446443, "lng": 5.6735818, "address": "4922 Straubel Circle" },
{ "id": 9, "name": "Sales Representative", "lat": 40.6073164, "lng": 46.7807131, "address": "1 Sycamore Terrace" },
{ "id": 10, "name": "Statistician I", "lat": -31.5327537, "lng": 27.7080133, "address": "40 Lakewood Park" },
{ "id": 11, "name": "Senior Financial Analyst", "lat": -20.6984299, "lng": -44.8256777, "address": "85977 Esch Center" },
{ "id": 12, "name": "Geological Engineer", "lat": -9.8867238, "lng": 124.2477171, "address": "8081 Twin Pines Place" },
{ "id": 13, "name": "Design Engineer", "lat": 41.782855, "lng": -8.5011003, "address": "0 Main Place" },
{ "id": 14, "name": "Chief Design Engineer", "lat": 35.664323, "lng": 117.251195, "address": "0599 Brickson Park Terrace" },
{ "id": 15, "name": "Analyst Programmer", "lat": 40.657978, "lng": 109.840313, "address": "12 Declaration Way" },
{ "id": 16, "name": "Administrative Officer", "lat": 35.991705, "lng": 36.3938121, "address": "49073 East Parkway" },
{ "id": 17, "name": "Systems Administrator III", "lat": -23.6443472, "lng": -47.5720968, "address": "52 Mendota Pass" },
{ "id": 18, "name": "Financial Analyst", "lat": 3.6711541, "lng": 98.6270628, "address": "82919 Harbort Pass" },
{ "id": 19, "name": "Associate Professor", "lat": 8.5657243, "lng": -82.7387601, "address": "0327 Linden Pass" },
{ "id": 20, "name": "Physical Therapy Assistant", "lat": 49.7002226, "lng": 5.9670927, "address": "89226 Coolidge Court" },
{ "id": 21, "name": "Director of Sales", "lat": -18.1203773, "lng": -63.9615665, "address": "81 Oakridge Road" },
{ "id": 22, "name": "Community Outreach Specialist", "lat": 11.1869803, "lng": -60.7301511, "address": "8486 Kingsford Way" },
{ "id": 23, "name": "Civil Engineer", "lat": -22.523123, "lng": -55.7242526, "address": "57043 5th Crossing" },
{ "id": 24, "name": "Programmer Analyst IV", "lat": -6.8958354, "lng": 107.6039392, "address": "25 Mosinee Road" },
{ "id": 25, "name": "Financial Analyst", "lat": 13.1529217, "lng": 10.6351404, "address": "3 Evergreen Place" },
{ "id": 26, "name": "Senior Quality Engineer", "lat": 22.324743, "lng": 114.211039, "address": "843 Bluejay Street" },
{ "id": 27, "name": "VP Accounting", "lat": -8.7149312, "lng": 116.3426552, "address": "2839 Shelley Court" },
{ "id": 28, "name": "Tax Accountant", "lat": 4.6690872, "lng": -74.1386906, "address": "75864 Ridgeway Parkway" },
{ "id": 29, "name": "VP Accounting", "lat": 16.4329878, "lng": 121.1113259, "address": "933 Derek Avenue" },
{ "id": 30, "name": "Research Associate", "lat": 63.4741556, "lng": 30.0475103, "address": "269 Canary Point" }])

</script>

<template>
  <main>

    <Tabs default-value="job-list" class="w-[100%]">
      <TabsList class="grid w-full grid-cols-2">
        <TabsTrigger value="job-list">
          工作列表
        </TabsTrigger>
        <TabsTrigger value="map">
          地圖
        </TabsTrigger>
      </TabsList>

      <TabsContent value="map">
        <Card>
          <CardContent :style="{ height: '90vh', padding: '5px' }">
            <Map v-model:jobs="jobs"></Map>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="job-list">
        <Card>
          <CardHeader>
            <CardTitle>工作列表</CardTitle>
          </CardHeader>
          <CardContent class="space-y-2">
            <WorkTable v-model:jobs='jobs'></WorkTable>
          </CardContent>

        </Card>
      </TabsContent>

    </Tabs>
  </main>
</template>
