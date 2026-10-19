<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { site } from '~/data/site';
import { reducedMotion } from '~/utils/motion';

const hero = ref<HTMLElement | null>(null);
const photo = ref<HTMLImageElement | null>(null);
const track = ref<HTMLElement | null>(null);

let stop: (() => void) | undefined;

onMounted(() => {
  if (reducedMotion()) return;
  const section = hero.value!;
  const img = photo.value!;
  const marquee = track.value!;

  let sy = window.scrollY;
  let iy = sy * 0.15;
  let w = 0;
  let raf = 0;
  const measure = () => {
    w = (marquee.firstElementChild as HTMLElement).offsetWidth;
  };
  const onScroll = () => {
    sy = window.scrollY;
  };
  const frame = () => {
    if (sy < section.offsetHeight + 200) {
      iy += (sy * 0.15 - iy) * 0.08;
      img.style.transform = `translate3d(0, ${iy.toFixed(2)}px, 0)`;
      if (w) marquee.style.transform = `translate3d(${-(sy % w)}px, 0, 0)`;
    }
    raf = requestAnimationFrame(frame);
  };

  measure();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', measure);
  document.fonts?.ready.then(measure);
  raf = requestAnimationFrame(frame);

  stop = () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', measure);
  };
});

onBeforeUnmount(() => stop?.());
</script>

<template>
  <section
    id="intro"
    ref="hero"
    class="hero"
    :data-marker="site.sections.intro.marker"
  >
    <div class="hero-media">
      <img
        id="heroImg"
        ref="photo"
        src="/lozy.webp"
        :alt="site.photoAlt"
        fetchpriority="high"
      >
    </div>

    <div class="hanger">
      <svg
        class="hanger-shape"
        viewBox="0 0 300 121"
        aria-hidden="true"
      >
        <g
          transform="translate(0.000000, -366.000000)"
          fill="#1f1f21"
        ><g transform="translate(149.816828, 426.633657) rotate(90.000000) translate(-149.816828, -426.633657) translate(89.816828, 276.816828)"><g transform="translate(60.000000, 149.816828) rotate(-90.000000) translate(-60.000000, -149.816828) translate(-89.816828, 89.816828)"><path d="M239.633657,0 C272.770742,1.0182436e-15 299.633657,26.862915 299.633657,60 C299.633657,93.137085 272.770742,120 239.633657,120 L0,120 L0,0 L239.633657,0 Z M239.633657,18.7755102 C216.866,18.7755102 198.409167,37.232343 198.409167,60 C198.409167,82.767657 216.866,101.22449 239.633657,101.22449 C262.401314,101.22449 280.858147,82.767657 280.858147,60 C280.858147,37.232343 262.401314,18.7755102 239.633657,18.7755102 Z" /></g></g></g>
      </svg>
      <p class="hanger-text">
        <span>Based in</span><span>{{ site.location }}</span>
      </p>
      <div
        class="globe"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.3"
        ><circle
          cx="12"
          cy="12"
          r="9"
        /><ellipse
          cx="12"
          cy="12"
          rx="4"
          ry="9"
        /><path d="M3 12h18M4.6 7.5h14.8M4.6 16.5h14.8" /></svg>
      </div>
    </div>

    <div
      class="hero-name"
      aria-hidden="true"
    >
      <div class="marquee">
        <div
          id="marquee"
          ref="track"
          class="marquee-track"
        >
          <span
            v-for="n in 3"
            :key="n"
          >{{ site.name }} –</span>
        </div>
      </div>
    </div>

    <div class="hero-copy">
      <h1>
        <span class="sr-only">{{ site.name }}, </span>
        <template
          v-for="(line, i) in site.headline"
          :key="i"
        >
          <template v-if="i > 0">
            {{ ' ' }}
          </template>
          <span class="hl">{{ line }}</span>
        </template>
      </h1>
      <p class="hero-sub">
        {{ site.sub }}
      </p>
      <p class="loc-inline">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.4"
          aria-hidden="true"
        ><circle
          cx="12"
          cy="12"
          r="9"
        /><ellipse
          cx="12"
          cy="12"
          rx="4"
          ry="9"
        /><path d="M3 12h18" /></svg>
        Based in {{ site.location }}
      </p>
      <div class="hero-cta">
        <a
          class="btn btn-ghost"
          href="#contact"
        >Contact</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative; height: 100svh; min-height: 640px; max-height: 1100px;
  overflow: hidden; display: flex; flex-direction: column; justify-content: flex-end;
}
.hero-media { position: absolute; inset: 0; }
.hero-media img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 32%; will-change: transform; }
.hero-media::after {
  content: ""; position: absolute; inset: 0;
  background:
    linear-gradient(to bottom, rgba(0, 0, 0, .45), rgba(0, 0, 0, 0) 18%),
    linear-gradient(to top, #181818 0%, rgba(24, 24, 24, 0) 36%),
    linear-gradient(to left, rgba(18, 18, 18, .9) 0%, rgba(18, 18, 18, .7) 28%, rgba(18, 18, 18, 0) 56%);
}
.hanger { position: absolute; z-index: 3; left: 0; top: 44%; width: 272px; height: 110px; transform: translateY(-50%); }
.hanger-shape { position: absolute; inset: 0; width: 100%; height: 100%; }
.hanger-text { position: absolute; left: 36px; top: 50%; transform: translateY(-50%); font-size: 1.0625rem; line-height: 1.25; }
.hanger-text span { display: block; }
.hanger-text span:first-child { color: var(--ink-2); }
.globe { position: absolute; left: 217px; top: 50%; width: 64px; height: 64px; margin: -32px 0 0 -32px; display: grid; place-items: center; }
.globe svg { width: 34px; height: 34px; transition: transform 1.2s var(--ease); }
.hanger:hover .globe svg { transform: rotate(360deg); }

.hero-copy { position: absolute; z-index: 3; right: clamp(24px, 3.5vw, 56px); top: 45%; transform: translateY(-50%); width: min(760px, 54vw); text-align: right; }
.hero h1 { font-size: clamp(2.5rem, 4.5vw, 4.5rem); line-height: 1.02; letter-spacing: -.032em; }
.hero h1 .hl { display: block; }
.hero-sub { margin-top: 22px; font-size: 1.25rem; line-height: 1.4; color: rgba(255, 255, 255, .86); }
.loc-inline { display: none; }
.hero-cta { display: none; }
.hero-name { position: relative; z-index: 2; margin-bottom: clamp(28px, 4vw, 64px); }
.marquee { overflow: hidden; user-select: none; }
.marquee-track { display: flex; width: max-content; will-change: transform; }
.marquee-track span {
  font-size: 12.5vw; line-height: 1.02; letter-spacing: -.02em; white-space: nowrap; padding-right: .22em;
  color: #fff;
}

@media (max-width: 760px) {
  .hanger { display: none; }
  .hero { max-height: none; }
  .hero-media img { object-position: 50% 22%; height: 78%; }
  .hero-media::after {
    background:
      linear-gradient(to bottom, rgba(0, 0, 0, .45), rgba(0, 0, 0, 0) 16%),
      linear-gradient(to top, #181818 0%, #181818 34%, rgba(24, 24, 24, .75) 46%, rgba(24, 24, 24, 0) 70%);
  }
  .hero-name { margin-bottom: 18px; }
  .marquee-track span { font-size: 17vw; }
  .hero-copy { position: relative; right: auto; top: auto; transform: none; width: auto; padding: 0 var(--edge) 36px; text-align: left; }
  .hero h1 { font-size: 2.375rem; line-height: 1.04; }
  .hero h1 .hl { display: inline; }
  .hero-sub { margin-top: 14px; font-size: 1.0625rem; }
  .loc-inline { display: flex; align-items: center; gap: 8px; margin-top: 10px; color: var(--ink-2); font-size: .9375rem; }
  .loc-inline svg { width: 17px; height: 17px; }
  .hero-cta { display: flex; gap: 10px; margin-top: 20px; }
  .hero-cta .btn { flex: 1; }
}
</style>
