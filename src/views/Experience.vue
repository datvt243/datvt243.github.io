<template>
  <div class="experience">
    <h2 class="heading-primary">
      Kinh Nghiệm Làm Việc
    </h2>
    <ul class="timeline-list">
      <li v-for="(item, index) in $store.state.experience" :key="index">
        <ExperienceItem :experience="item"></ExperienceItem>
      </li>
    </ul>
  </div>
</template>

<script>
import ExperienceItem from "@/components/ExperienceItem.vue";
export default {
  name: "Experience",
  components: {
    ExperienceItem
  }
};
</script>

<style lang="sass" scoped>
.heading-primary
  margin-bottom: 40px
.text-inner
  margin-bottom: 10px
@media (max-width: 576px)
  .heading-primary
    font-size: 22px
    margin-bottom: 30px
</style>
