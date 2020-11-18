<template>
  <div class="site-wrapper">
    <div class="container h-100">
      <div class="row h-100 overflow-hidden">
        <div class="col-auto col-sm-auto col-md-5 p-0 site-left h-100">
          <div class="site-header">
            <div class="site-nav">
              <div class="bg-site h-100">
                <div class="row justify-content-between flex-column h-100">
                  <div class="col-auto">
                    <Hamburger></Hamburger>
                  </div>
                  <div class="col">
                    <NavPrimary></NavPrimary>
                  </div>
                  <div class="col-auto">
                    <DownloadCV></DownloadCV>
                  </div>
                </div>
              </div>
            </div>
            <div class="site-person d-none d-md-block">
              <div class="bg-site h-100">
                <div class="d-flex flex-column justify-content-between h-100">
                  <div class="column">
                    <PersonWrapper></PersonWrapper>
                  </div>
                  <div class="column">
                    <p class="copyright">
                      2020 &copy; copyright by me
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col col-sm col-md-7 p-0 site-right h-100">
          <div class="site-page h-100">
            <div class="bg-site h-100">
              <div class="site-overflow h-100">
                <transition name="transition-router">
                  <router-view></router-view>
                </transition>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Hamburger from "@/components/Hamburger.vue";
import NavPrimary from "@/components/NavPrimary.vue";
import DownloadCV from "@/components/DownloadCV.vue";
import PersonWrapper from "@/components/person/PersonWrapper.vue";

export default {
  name: "Default",
  components: {
    Hamburger,
    NavPrimary,
    DownloadCV,
    PersonWrapper
  }
};
</script>

<style lang="sass" scoped>
$padding: 40px
.site
  &-wrapper
    height: 100vh
    padding:
      top: 4vh
      bottom: 4vh
  &-header
    display: flex
    height: 100%
  &-left
    position: relative
    z-index: 1
  &-nav
    $val: 60px
    flex: 0 0 #{$val}
    max-width: #{$val}
    padding:
      top: #{$padding}
      bottom: #{$padding}
  &-person
    flex-grow: 1
    width: 1%
    border: 5px solid #333
  &-page
    padding:
      top: #{$padding}
      bottom: #{$padding}
    .bg-site
      padding: 30px 20px 30px 30px
  &-overflow
    overflow-y: auto
    padding-right: 15px
  @media (max-width: 767px)
    &-wrapper
      padding: 10px
    &-nav
      border-right: 1px solid #42b983
    &-nav, &-page
      padding:
        top: 0
        bottom: 0
    &-page
      .bg-site
        padding: 20px 10px 20px 15px
  @media (max-width: 576px)
    &-nav
      $val: 50px
      flex: 0 0 #{$val}
      max-width: #{$val}
</style>
