<template>
  <div class="m-auto flex gap-8">
    <div class="flex flex-col gap-1">
      <div class="flex text-[#848484] w-fit mx-auto">
        <Icon
          name="fe:play"
          class="text-[#848484] h-7 w-7"
        />
      </div>
      {{ project.item }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useCurrentProjectStore } from '~/stores/project';

const project = useCurrentProjectStore();
</script>