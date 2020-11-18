<template>
  <div class="progress-bar">
    <div class="d-flex justify-content-between align-items-center">
      <p class="title">
        {{ title }}
      </p>
      <p class="value text-green">{{ value }}%</p>
    </div>
    <div class="line">
      <span class="active" :style="{ width: value + '%' }"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProgressBar",
  props: {
    title: {
      type: String,
      default: "ProgressBar"
    },
    value: {
      type: Number,
      default: 90
    }
  }
};
</script>

<style lang="sass" scoped>
.progress-bar
  overflow: hidden
  position: relative
  &:not(:last-child)
    margin-bottom: 20px
  .title
    font-weight: 700
    color: #fff
    letter-spacing: .05em
    line-height: 1.4
    text-transform: lowercase
  .line
    position: relative
    display: block
    width: 100%
    height: 6px
    background-color: #555
    border-radius: 2px
    .active
      position: absolute
      top: 0
      left: 0
      height: 100%
      z-index: 10
      background-color: #42b983
</style>
