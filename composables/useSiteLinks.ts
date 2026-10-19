import { useState } from '#app';
import { site, type Project, type Tag } from '~/data/site';

export type ProjectFilter = 'all' | Tag;

export function shows(p: Project, f: ProjectFilter) {
  return f === 'all' || p.tags.includes(f);
}

export function useProjectView() {
  const current = useState<string>('project-current', () => site.projects[0].id);
  const filter = useState<ProjectFilter>('project-filter', () => 'all');
  const revealed = useState<{ n: number; focus: boolean }>('project-revealed', () => ({ n: 0, focus: false }));

  // focus: the jump came from the keyboard, so focus follows it; mouse and touch keep theirs.
  const reveal = (id: string, focus: boolean) => {
    const project = site.projects.find(p => p.id === id)!;
    if (!shows(project, filter.value)) filter.value = 'all';
    current.value = id;
    revealed.value = { n: revealed.value.n + 1, focus };
  };

  return { current, filter, revealed, reveal };
}

export function useProgramRing() {
  const request = useState<{ name: string; n: number; focus: boolean } | null>('program-ring', () => null);

  const ring = (name: string, focus: boolean) => {
    request.value = { name, n: (request.value?.n ?? 0) + 1, focus };
  };

  return { request, ring };
}
