<template>
  <div class="about">
    <h2 class="heading-primary">
      Portfolio
    </h2>
    <div class="clearfix">
      <ul class="row margin">
        <li
          class="col-6 col-sm-12 col-md-6"
          v-for="(item, index) in $store.state.portfolioFreelancer"
          :key="index"
        >
          <PortfolioItem :heading="item.heading" :img="item.img" />
        </li>
      </ul>
      <hr class="hr" />
      <ul class="row margin">
        <li
          class="col-6 col-sm-12 col-md-6"
          v-for="(item, index) in $store.state.portfolioVietry"
          :key="index"
        >
          <PortfolioItem :heading="item.heading" :img="item.img" />
        </li>
      </ul>
      <hr class="hr" />
      <ul class="row margin">
        <li
          class="col-6 col-sm-12 col-md-6"
          v-for="(item, index) in $store.state.portfolioFastcoding"
          :key="index"
        >
          <PortfolioItem :heading="item.heading" :img="item.img" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import PortfolioItem from "@/components/PortfolioItem.vue";
export default {
  name: "Portfolio",
  components: {
    PortfolioItem
  }
};
</script>

<style lang="sass" scoped>
hr
  margin: 0 0 30px 0
@media (max-width: 576px)
  .row
    $val: 10
    margin:
      left: -#{$val}px
      right: -#{$val}px
    > *
      padding:
        left: #{$val}px
        right: #{$val}px
      margin-bottom: #{$val*2}px
  hr
    margin: 0 0 20px 0
</style>
