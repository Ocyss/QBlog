<script setup>
useSeoMeta({
  titleTemplate: title => (!title ? '💘  Ocyss Blog' : `${title} 💘 Ocyss Blog`),
  description: '一只普通且业余的编程爱好者所写的博客',
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
