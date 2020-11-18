<template>
  <div class="person-wrapper">
    <div class="person-widget">
      <PersonInfo></PersonInfo>
    </div>
    <div class="person-widget">
      <PersonContact></PersonContact>
      <hr class="hr" />
      <Social></Social>
    </div>
  </div>
</template>

<script>
import PersonInfo from "./PersonInfo.vue";
import PersonContact from "./PersonContact.vue";
import Social from "@/components/Social.vue";
export default {
  name: "PersonWrapper",
  components: {
    PersonInfo,
    PersonContact,
    Social
  },
  data() {
    return {};
  }
};
</script>

<style lang="sass" scoped>
.person
  &-wrapper
    position: relative
    width: 300px
    max-width: 100%
    padding: 50px 0
    margin:
      left: auto
      right: auto
  &-widget
    &:not(:last-child)
      margin-bottom: 30px
      padding-bottom: 30px
      border-bottom: 1px solid rgba(255,255,255,.1)
  @media (max-width: 576px)
    &-wrapper
      width: 240px
  @media (max-width: 320px)
    &-wrapper
      width: 200px
      padding: 10px 0
</style>
