<script setup lang="ts">
const tag = useRoute().params.slug
</script>

<template>
  <div>
    <h1>标签: {{ tag }}</h1>
  </div>
</template>
