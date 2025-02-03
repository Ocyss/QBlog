<script setup lang="tsx">
import UIcon from '#ui/components/Icon.vue'

interface Project {
  title: string
  description: string
  tech: string[]
  link: string
  demo?: string
  docs?: string
  avatar?: string
  actions?: {
    name: string
    link: string
    icon: string
  }[]
}

const props = defineProps<{
  url?: string
  project?: Project
  override?: Partial<Project>
}>()

const project = ref<Project>()
if (props.project) {
  project.value = props.project
}
else if (props.url) {
  const repoUrl = props.url.replace('https://github.com/', '')
  const { data } = await useAsyncData(`repo-${repoUrl}`, () => {
    const Authorization = `token ${useRuntimeConfig().githubToken}`
    return Promise.all([
      $fetch<any>(`https://api.github.com/repos/${repoUrl}`, { headers: { Authorization } }),
      $fetch<any>(`https://api.github.com/repos/${repoUrl}/languages`, { headers: { Authorization } }),
    ])
  })

  // console.log(data.value)

  if (data.value) {
    const [repo, languages] = data.value
    project.value = {
      title: (repo?.name as string) || '',
      description: (repo?.description as string) || '暂无描述',
      tech: Object.keys(languages).slice(0, 5),
      link: props.url,
      avatar: repo?.owner?.type !== 'User' ? repo?.owner?.avatar_url as string : undefined,
      actions: repo?.homepage
        ? [{
            name: 'Pages',
            link: repo.homepage,
            icon: 'i-heroicons-globe-alt',
          }]
        : undefined,
    }
  }
}

if (props.override) {
  if (props.override.actions) {
    const actions = [...(project.value?.actions || []), ...props.override.actions]
    project.value = {
      ...project.value as Project,
      ...props.override,
      actions,
    }
  }
  else {
    project.value = { ...project.value as Project, ...props.override }
  }
}

function ActionLink({ name, link, icon }: { name: string, link: string, icon: string }) {
  return (
    <a
      href={link}
      class="flex items-center gap-2 text-gray-700 hover:text-gray-900 dark:text-gray-600 dark:hover:text-white"
      target="_blank"
    >
      <UIcon name={icon} class="size-4" />
      <span>{name}</span>
    </a>
  )
}
</script>

<template>
  <div
    v-if="project"
    :key="project.title"
    class="not-prose rounded-lg text-left bg-[var(--ui-bg)] flex flex-col p-6 shadow-sm hover:scale-105 transition-transform duration-300 dark:bg-[var(--ui-bg)]"
  >
    <h3 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
      <img v-if="project.avatar" :src="project.avatar" alt="avatar" class="size-6 rounded-full">
      {{ project.title }}
    </h3>
    <p class="mb-4 text-gray-600 dark:text-gray-400 text-sm line-clamp-3 flex-1">
      {{ project.description }}
    </p>

    <div class="mb-4 flex flex-wrap gap-2 select-none text-xs">
      <span
        v-for="tech in project.tech"
        :key="tech"
        class="rounded-full bg-gray-100
        dark:bg-gray-700 px-3 py-1 text-gray-700
        dark:text-gray-300 hover:bg-gray-200
        dark:hover:bg-gray-600"
      >
        {{ tech }}
      </span>
    </div>

    <div class="flex gap-3 text-sm">
      <ActionLink
        name="Code"
        :link="project.link"
        icon="mdi:github"
      />
      <ActionLink
        v-if="project.demo"
        name="Demo"
        :link="project.demo"
        icon="mdi:open-in-new"
      />
      <ActionLink
        v-if="project.docs"
        name="Docs"
        :link="project.docs"
        icon="i-heroicons-book-open"
      />
      <ActionLink
        v-for="action in project.actions"
        :key="action.name"
        :name="action.name"
        :link="action.link"
        :icon="action.icon"
      />
    </div>
  </div>
</template>
