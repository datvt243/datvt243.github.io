<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

const router = useRoute()
const category = ref(router.query?.category || '');
const page = ref(router.query?.page || 1);
const perPage = ref(router.query?.['per-page'] || 20);

watch(() => router.query, query => {
  category.value = query?.category || '';
  page.value = query?.page || 1;
  perPage.value = query?.['per-page'] || 20;
});

provide('query', {
  category,
  page,
  perPage
})

</script>

<template>
  <main class="grow p-0 layout-blog">
    <UContainer>
      <EditorPanel>
        <template #sidebar>
          <PostCategories />
        </template>
        <slot/>
      </EditorPanel>
    </UContainer>
  </main>
</template>
