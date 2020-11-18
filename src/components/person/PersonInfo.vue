<template>
  <div class="person-info">
    <figure class="avatar">
      <img src="@/assets/avatar.jpg" :alt="$store.state.personInfo.name" />
    </figure>
    <h1 class="name">
      {{ $store.state.personInfo.name }}
    </h1>
    <p class="job text-green">
      {{ $store.state.personInfo.job }}
    </p>
    <div class="d-flex justify-content-center align-items-center">
      <div class="column sex">
        {{ $store.state.personInfo.sex }}
        <!-- <BaseIconMars classname="is-medium" /> -->
      </div>
      <div class="column">
        |
      </div>
      <div class="column">
        <span class="old">
          {{ $store.state.personInfo.birthday }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PersonInfo"
};
</script>

<style lang="sass" scope>
.person
  &-info
    text-align: center
    width: 80%
    margin:
      left: auto
      right: auto
    .avatar
      position: relative
      overflow: hidden
      border-radius: 50%
      width: 100%
      height: 0
      line-height: 0
      padding-bottom: 100%
      margin:
        left: auto
        right: auto
        bottom: 20px
      img
        position: absolute
        width: 100%
        top: 0
        left: 0
        border: 3px solid #42b983
        border-radius: 50%
    .name
      text-transform: uppercase
      color: #fff
      font-size: 30px
      letter-spacing: .05em
    .job
      display: block
      font:
        size: 20px
        weight: 400
      letter-spacing: .05em
    .old, .sex
      font-size: 14px
  @media (max-width: 991px)
    &-info
      .name
        font-size: 24px
      .job
        font-size: 16px
  @media (max-width: 320px)
    &-info
      width: 90%
</style>
