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
      <TableRow v-for="job in jobs" :key="job.id">
        <TableCell>{{ job.name }}</TableCell>
        <TableCell><Button size=icon>
            <Locate />
          </Button></TableCell>
        <TableCell><Button size=icon @click="removeJobById(job.id)">
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
const jobs = defineModel('jobs')
function removeJobById(jobId) {
  jobs.value = jobs.value.filter(job => job.id !== jobId);
}

</script>

<style></style>