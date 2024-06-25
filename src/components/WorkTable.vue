<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>工作</TableHead>
        <TableHead>地點</TableHead>
        <TableHead>Remove</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="job in jobs" :key="job.tabId">
        <TableCell>{{ job.jobTitle }}</TableCell>
        <TableCell><Button @click="$emit('set-center', job.tabId, job.coords)" size=icon>
            <Locate />
          </Button></TableCell>
        <TableCell><Button size=icon @click="removeJobById(job.tabId)">
            <Trash2 />
          </Button></TableCell>
      </TableRow>

    </TableBody>
  </Table>
</template>

<script lang="ts" setup>
import { TableBody, Table, TableRow, TableCell, TableHead, TableHeader } from './ui/table';
import { Button } from './ui/button';
import { Trash2, Locate } from 'lucide-vue-next';
import { NWorkDetail } from './Map.vue';
const jobs = defineModel('jobs', { type: Array<NWorkDetail>, required: true })
const emit = defineEmits(['set-center'])
function removeJobById(jobId: number) {
  jobs.value = jobs.value.filter(job => job.tabId !== jobId);
  chrome.tabs.remove(jobId)
}

</script>

<style></style>