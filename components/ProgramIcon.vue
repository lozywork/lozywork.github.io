<script setup lang="ts">
import { computed } from 'vue';
import type { IconName, ProgramTone } from '~/data/site';

const props = defineProps<{ icon: IconName; tone: ProgramTone; chip?: boolean }>();

// Chips draw the same 64-unit icon at 18 px, so their strokes are twice as thick.
const scale = computed(() => (props.chip ? 2 : 1));
const width = computed(() => (props.icon === 'waveform' ? 3 : 2.5) * scale.value);
const cap = computed(() => (props.icon === 'play' ? undefined : 'round'));
const join = computed(() => (props.icon === 'waveform' ? undefined : 'round'));
</script>

<template>
  <svg
    viewBox="0 0 64 64"
    fill="none"
    :stroke="`url(#g-${tone})`"
    :stroke-width="width"
    :stroke-linecap="cap"
    :stroke-linejoin="join"
    aria-hidden="true"
  >
    <template v-if="icon === 'timeline'">
      <rect
        x="6"
        y="14"
        width="30"
        height="9"
        rx="3"
      />
      <rect
        x="20"
        y="28"
        width="38"
        height="9"
        rx="3"
      />
      <rect
        x="10"
        y="42"
        width="24"
        height="9"
        rx="3"
      />
      <path d="M44 7v51" />
    </template>
    <path
      v-else-if="icon === 'waveform'"
      d="M8 28v8M15 22v20M22 14v36M29 24v16M36 7v50M43 18v28M50 26v12M57 30v4"
    />
    <template v-else-if="icon === 'faders'">
      <path d="M14 7v27M14 42v15M32 7v9M32 24v33M50 7v19M50 34v23" />
      <rect
        x="7"
        y="34"
        width="14"
        height="8"
        rx="2.5"
      />
      <rect
        x="25"
        y="16"
        width="14"
        height="8"
        rx="2.5"
      />
      <rect
        x="43"
        y="26"
        width="14"
        height="8"
        rx="2.5"
      />
    </template>
    <template v-else-if="icon === 'cube'">
      <path d="M32 7 54 19.5v25L32 57 10 44.5v-25Z" />
      <path d="M10 19.5 32 32l22-12.5M32 32v25" />
    </template>
    <template v-else-if="icon === 'play'">
      <rect
        x="7"
        y="13"
        width="50"
        height="38"
        rx="7"
      />
      <path d="M27 24v16l13-8Z" />
    </template>
    <template v-else-if="icon === 'pen'">
      <path d="M10 46C18 14 46 14 54 46" />
      <path
        d="M10 46 18 14M54 46 46 14"
        :stroke-width="1.5 * scale"
      />
      <rect
        x="6"
        y="42"
        width="8"
        height="8"
        rx="1.5"
      />
      <rect
        x="50"
        y="42"
        width="8"
        height="8"
        rx="1.5"
      />
      <circle
        cx="18"
        cy="14"
        r="3"
      />
      <circle
        cx="46"
        cy="14"
        r="3"
      />
    </template>
    <template v-else-if="icon === 'browser'">
      <rect
        x="6"
        y="10"
        width="52"
        height="44"
        rx="6"
      />
      <path d="M6 21h52" />
      <circle
        cx="12.5"
        cy="15.5"
        r=".8"
      />
      <circle
        cx="17.5"
        cy="15.5"
        r=".8"
      />
      <circle
        cx="22.5"
        cy="15.5"
        r=".8"
      />
      <rect
        x="13"
        y="28"
        width="18"
        height="18"
        rx="2"
      />
      <path d="M37 30h14M37 37h14M37 44h9" />
    </template>
    <path
      v-else-if="icon === 'code'"
      d="M21 18 7 32l14 14M43 18l14 14-14 14M37 10 27 54"
    />
  </svg>
</template>
