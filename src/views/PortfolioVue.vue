<template>
  <div class="portfolio-vue">
    <h2 class="heading-primary">
      Project Vue Simple
    </h2>
    <div class="clearfix">
      <ul class="row margin">
        <li
          class="col-sm-12 col-md-6"
          v-for="(item, index) in $store.state.portfolioVue"
          :key="index"
        >
          <div class="portfolio">
            <div class="portfolio-card">
              <a :href="item.to" target="_blank" class="portfolio-link">
                <div class="portfolio-heading">
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <span>
                      {{ item.heading }}
                    </span>
                    <span class="ico">
                      <BaseIconExternalLink />
                    </span>
                  </div>
                </div>
                <div class="portfolio-image">
                  <img src="@/assets/vuejs.jpg" :alt="item.heading" />
                </div>
              </a>
            </div>
            <ul class="portfolio-tags">
              <li v-for="(tag, tagIndex) in item.tags" :key="tagIndex">
                <span class="tag">{{ tag }}</span>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "PortfolioVue"
};
</script>

<style lang="sass" scoped>
.ico
  line-height: 0
.portfolio-card
  &:not(:last-child)
      margin-bottom: 10px
</style>
