<template>
  <div class="image_list">
    <div v-for="(item,index) in imgList" :key="index" class="image_item">
      <img :src="item.url" />
      <h4>{{item.title}}</h4>
      <div>{{item.detail}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ImageList",
  components: {},
  props: {
    imgList: {
      type: Array,
      default() {
        return [];
      }
    }
  }
};
</script>

<style scoped>
.image_list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  padding: 20px;
}
.image_item {
  width: 33.33%;
  padding: 0 10px;
  margin-bottom: 60px;
}
img {
  border: solid 2px #fff;
  border-radius: 50%;
}
h4 {
  margin: 10px 0;
  font-size: 14px;
  font-weight: 400;
}
.image_item div {
  font-weight: 200;
  line-height: 18px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}
</style>>
</style>