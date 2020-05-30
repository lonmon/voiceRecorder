<template>
  <div class="toolbar">
    <button class="downorshare" @click.stop="btnClick" ref="button">
      <i class="fa fa-check fa-lg" aria-hidden="true"></i>Download or share
    </button>
  </div>
</template>

<script>
export default {
  name: "Toolbar",
  methods: {
    btnClick() {
      this.$emit("popupShow");
    }
  }
};
</script>

<style scoped>
.toolbar {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #fff;
}
.downorshare {
  padding: 0 25px;
  height: 100%;
  color: #fff;
  font-size: 15px;
  background: rgb(76, 175, 80);
}
i {
  padding-right: 15px;
}
</style>