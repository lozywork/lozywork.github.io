import { onMounted, readonly } from 'vue';
import { useState } from '#app';
import { toIsoDate } from '~/utils/timeline';

// The prerendered page carries the build date in its payload, so hydration renders the same
// values; after mount the visitor's own date takes over as a normal reactive update.
export function useToday() {
  const today = useState<string>('today', () => toIsoDate(new Date()));
  onMounted(() => {
    today.value = toIsoDate(new Date());
  });
  return readonly(today);
}
