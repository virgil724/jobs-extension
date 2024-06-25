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



</script>

<template>
  <main>
    {{ jobs }}
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
