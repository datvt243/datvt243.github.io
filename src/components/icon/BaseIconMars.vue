<template>
  <BaseIcon
    :classname="classname"
    d="M372 64h-88c-6.6 0-12 5.4-12 12v8c0 6.6 5.4 12 12 12h45.4l-95.5 95.5C209.2 171.8 178 160 144 160 64.5 160 0 224.5 0 304s64.5 144 144 144 144-64.5 144-144c0-34-11.8-65.2-31.5-89.9l95.5-95.5V164c0 6.6 5.4 12 12 12h8c6.6 0 12-5.4 12-12V76c0-6.6-5.4-12-12-12zM144 416c-61.9 0-112-50-112-112 0-61.9 50-112 112-112 61.9 0 112 50 112 112 0 61.9-50 112-112 112z"
  />
</template>

<script>
import BaseIcon from "@/components/icon/BaseIcon.vue";
export default {
  name: "IconMars",
  components: {
    BaseIcon
  },
  props: {
    classname: {
      type: String,
      default: ""
    }
  }
};
</script>
