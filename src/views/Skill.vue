<template>
  <div class="skill">
    <div class="experience">
      <div class="personal-skills">
        <h2 class="heading-primary">
          Kỹ Năng Cá Nhân
        </h2>
        <div class="text-inner">
          <p>
            Được mọi người đánh giá là hoà đồng và dễ mến, tính tình vui vẻ, sẵn
            sàng giúp đỡ mọi người trong lúc gặp khó khăn.
            <br />
            Những lúc rãnh thường ngồi tìm hiểu, nạp thêm những kiến thức mới
            vào đầu.
          </p>
          <ul>
            <li>Khả năng làm việc độc lập tốt</li>
            <li>Làm việc nhóm, phân chia công việc</li>
            <li>Chiệu áp lực tốt</li>
            <li>Học hỏi nhanh</li>
          </ul>
          <div class="clearfix">
            <ProgressBar
              v-for="(item, index) in $store.state.personalSkills"
              :key="index"
              :title="item.title"
              :value="item.value"
            ></ProgressBar>
          </div>
        </div>
      </div>
      <div class="advanced-skills">
        <h2 class="heading-primary">
          Kỹ Năng Chuyên Môn
        </h2>
        <div class="text-inner">
          <p>
            Trong 5 năm, tôi đã thiết kế và phát triển các trang web.
          </p>
          <div class="clearfix">
            <h3 class="heading-secondary">Front-end</h3>
            <div class="clearfix">
              <ProgressBar
                v-for="(item, index) in $store.state.frontendSkills"
                :key="index"
                :title="item.title"
                :value="item.value"
              ></ProgressBar>
            </div>
            <hr />
            <div class="d-flex flex-wrap margin">
              <div
                v-for="(item, index) in $store.state.frontendTagsSkills"
                :key="index"
              >
                <Tag :tag="item.text" :icon="item.icon" />
              </div>
            </div>
          </div>
          <div class="clearfix">
            <h3 class="heading-secondary">Thiết Kế</h3>
            <div class="clearfix">
              <ProgressBar
                v-for="(item, index) in $store.state.designSkills"
                :key="index"
                :title="item.title"
                :value="item.value"
              ></ProgressBar>
            </div>
            <hr />
            <div class="d-flex flex-wrap margin">
              <div
                v-for="(item, index) in $store.state.designTagsSkills"
                :key="index"
              >
                <Tag :tag="item.text" :icon="item.icon" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProgressBar from "@/components/ProgressBar.vue";
import Tag from "@/components/Tag.vue";
export default {
  name: "Skill",
  components: {
    ProgressBar,
    Tag
  }
};
</script>

<style lang="sass" scoped>
.personal-skills
  margin-bottom: 60px
@media (max-width: 320px)
  hr
    margin: 10px 0
</style>
