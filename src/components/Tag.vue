<template>
  <span class="tag">
    <span class="icon" v-if="icon != ''">
      <component :is="icon" />
    </span>
    <span class="text">
      {{ tag }}
    </span>
  </span>
</template>

<script>
export default {
  name: "Tag",
  props: {
    icon: {
      type: String,
      default: ""
    },
    tag: {
      type: String,
      default: "tagname"
    }
  }
};
</script>

<style lang="sass" scoped>
.tag
  display: inline-block
  padding: 7px 10px
  line-height: 1
  border: 1px solid #42b983
  border-radius: 4px
  font-size: 14px
  .icon
    margin-right: 5px
  .icon, .text
    display: inline-block
    vertical-align: middle
  @media (max-width: 576px)
    font-size: 12px
    padding: 4px 10px
</style>
