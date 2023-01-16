<template>
  <div class="p-4">
    <GrowCard :loading="loading" class="enter-y" />
    <SiteAnalysis class="!my-4 enter-y" :loading="loading" />

    <div class="md:flex enter-y">
      <PerformNodePie class="md:w-1/2 md:!mx-4 md:!my-0 !my-4 w-full" :loading="loading" />
      <HealthNodePie class="md:w-1/2 w-full" :loading="loading" />
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import GrowCard from './components/GrowCard.vue';
  import SiteAnalysis from './components/SiteAnalysis.vue';
  import PerformNodePie from './components/PerformNodePie.vue';
  import HealthNodePie from './components/HealthNodePie.vue';

  export default defineComponent({
    components: {
      GrowCard,
      SiteAnalysis,
      PerformNodePie,
      HealthNodePie,
    },
    setup() {
      const loading = ref(true);

      setTimeout(() => {
        loading.value = false;
      }, 1500);
      return { loading };
    },
  });
</script>
