<script setup lang="ts">
const navigation = await useNavigation()
</script>

<template>
  <nav class="flex items-center space-x-4">
    <template
      v-for="item in navigation"
      :key="item.path"
    >
      <UDropdownMenu
        v-if="item.nav"
        :items="[
          [{
            label: item.title,
            icon: item.icon,
            to: item.path,
          }],
          item.nav,
        ]"
        arrow
      >
        <UButton
          class="group flex items-center space-x-1 px-3 py-1.5 rounded-full u-float-btn transition-colors"
          trailing-icon="i-iconamoon:arrow-down-2"
          size="xs"
          :icon="item.icon"
          :ui="{
            trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-300',
          }"
        >
          {{ item.title }}
        </UButton>
      </UDropdownMenu>
      <UButton
        v-else
        class="group flex items-center space-x-1 px-3 py-1.5 rounded-full u-float-btn transition-colors h-8"
        size="xs"
        :to="item.path"
        :icon="item.icon"
      >
        {{ item.title }}
      </UButton>
    </template>
    <!-- <UNavigationMenu :items="navigationMenu" class="justify-center" /> -->
  </nav>
</template>
