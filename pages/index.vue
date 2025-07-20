<template>
  <div>
    <Header />
    <div class="content-body mx-auto flex min-h-screen max-w-4xl flex-col px-8 pb-20 gap-24">
      <Introduction />
      <!--<div class="h-[600px] overflow-scroll no-scrollbar cursor-pointer">
        
      </div>-->
      <Timeline />

      <Film />
      <Music />
      <Contact />
      <Lozy />
    </div>
  </div>
</template>

<style lang="scss">
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}
</style>