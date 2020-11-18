<template>
  <nav class="nav-primary">
    <ul class="nav-menu">
      <li class="nav-item d-md-none">
        <router-link tag="a" class="nav-link link trans" to="/person">
          <div class="avatar-item">
            <img src="@/assets/avatar.jpg" alt="Võ Tấn Đạt" />
          </div>
        </router-link>
      </li>
      <li
        class="nav-item"
        v-for="(item, index) in $store.state.menuPrimary"
        :key="index"
      >
        <router-link tag="a" class="nav-link link trans" :to="item.to">
          <component class="is-large" :is="item.icon" />
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "NavPrimary"
};
</script>

<style lang="sass" scoped>
.avatar-item
  width: 40px
  height: 40px
  border-radius: 50%
  overflow: hidden
  margin:
    left: auto
    right: auto
    bottom: 10px
  border: 1px solid #42b983
.nav
  &-primary
    margin-top: 20px
    color: #888
  &-link
    display: block
    text-align: center
    color: #888
    padding: 5px 5px
    .icon-svg
      display: block
      font-size: 26px
      transition: transform .3s ease
    &.router-link-exact-active
      color: #42b983
      .icon-svg
        transform: scale(1.2)
      &:hover
        opacity: 1
  @media (max-width: 320px)
    &-link
      .icon-svg
        font-size: 22px
</style>
