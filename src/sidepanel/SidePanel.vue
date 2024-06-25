<script setup lang="ts">

import '@/assets/index.css'
import { Tabs, TabsContent, TabsTrigger, TabsList } from '@/components/ui/tabs';
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card';

import { ref, onMounted } from 'vue'
import Map from '@/components/Map.vue';
import WorkTable from '@/components/WorkTable.vue';
const countSync = ref(0)
const link = ref('https://github.com/guocaoyi/create-chrome-ext')
const jobs = ref([])
const tabs = ref("job-list")
const center = ref(undefined)
function convertToTabArray(tabData) {
  return Object.entries(tabData).map(([tabId, data]) => ({
    tabId: parseInt(tabId, 10),  // Convert tabId to integer
    ...data
  }));
}
const updateJobs = () => {
  chrome.storage.session.get(['tabData'], (result) => {
    let tabData = result.tabData || {};
    jobs.value = convertToTabArray(tabData)
  })
}
chrome.runtime.onMessage.addListener((request)=>{
  
  if (request.type==='updateJob'){
    console.log("getUpdate")
    updateJobs()
  }
})

onMounted(() => {
  chrome.storage.sync.get(['count'], (result) => {
    countSync.value = result.count ?? 0
  })

  updateJobs()

  chrome.runtime.onMessage.addListener((request) => {
    if (request.type === 'COUNT') {
      countSync.value = request?.count ?? 0
    }

  })
})

interface Coords {
  lat: number;
  lng: number;
}

const setCenter = (tabId: number, coords: Coords): void => {
  chrome.tabs.update(tabId, { active: true })
  center.value = coords;
  tabs.value = 'map';
}
</script>

<template>
  <main>
    <Tabs default-value="job-list" v-model="tabs" class="w-[100%]">
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
            <Map v-model:jobs="jobs" :center></Map>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="job-list">
        <Card>
          <CardHeader>
            <CardTitle>工作列表</CardTitle>
          </CardHeader>
          <CardContent class="space-y-2">
            <WorkTable v-model:jobs="jobs" @set-center="setCenter"></WorkTable>
          </CardContent>

        </Card>
      </TabsContent>

    </Tabs>
  </main>
</template>
