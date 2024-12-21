<script setup>
useSeoMeta({
  titleTemplate: title => (!title ? 'Ocyss\'s Blog' : `${title} - Ocyss Blog`),
  description: '一只普通且业余的编程爱好者所写的博客',
})
</script>

<template>
  <UApp>
    <ImagePreview>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </ImagePreview>
  </UApp>
</template>
