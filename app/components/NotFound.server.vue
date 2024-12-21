<script setup lang="ts">
function goHome() {
  navigateTo('/')
}
</script>

<template>
  <div class="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center">
    <div class="text-9xl font-bold mb-4 animate-bounce-slow">
      4😵4
    </div>
    <h2 class="text-2xl font-medium mb-4">
      糟糕！这里什么都没有...
    </h2>
    <p class="text-gray-500 mb-8 max-w-md">
      可能是迷路了，或者内容被外星人偷走了。让我们回到首页吧！
    </p>
    <UButton
      color="neutral"
      size="xl"
      trailing-icon="i-lucide-lab:house-roof"
      @click="goHome"
    >
      带我回家
    </UButton>
  </div>
</template>

<style scoped>
.animate-bounce-slow {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(-5%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
</style>
