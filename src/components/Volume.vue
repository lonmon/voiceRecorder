<template>
  <div class="volume" @click.stop="clickVolume" @mousedown="move" ref="volume">
    <div class="icon">
      <span v-if="volumeSize===100" class="icon-volume-high"></span>
      <span v-else-if="volumeSize>=50&&volumeSize<100" class="icon-volume-medium"></span>
      <span v-else-if="volumeSize>0&&volumeSize<50" class="icon-volume-low"></span>
      <span v-else class="icon-volume-mute"></span>
    </div>
    <div class="volume_path" ref="volume_path">
      <div class="volume_bar" ref="volume_bar"></div>
    </div>
  </div>
</template>

<script>
import { getElementLeft } from "../common/utils";

export default {
  name: "Volume",
  data() {
    return { volumeSize: 100, lastVolumeSize: 100 };
  },
  mounted() {
    // this.$nextTick(() => {
    // document.addEventListener("click", () => {
    //   this.$refs.volume_path.style.display = "";
    // });
    // });
  },
  updated() {
    document.addEventListener("click", () => {
      if (this.$refs.volume_path) {
        this.$refs.volume_path.style.display = "";
      }
    });
  },
  methods: {
    move(e) {
      document.onmousemove = e => {
        this.changeVolumeSize(e, "move");
      };
      document.onmouseup = e => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },

    clickVolume(e) {
      this.changeVolumeSize(e, "click");
    },

    changeVolumeSize(e, type) {
      this.$refs.volume_path.style.display = "block";
      if (type === "move") {
        this.lastVolumeSize = this.volumeSize;
      }
      let position = e.clientX - getElementLeft(this.$refs.volume_path);

      if (position <= 0) {
        if (type === "click") {
          if (this.volumeSize === 0) {
            this.volumeSize = this.lastVolumeSize;
            this.$refs.volume_bar.style.left = this.lastVolumeSize + "%";
            return null;
          }
          this.lastVolumeSize = this.volumeSize;
        }
        this.volumeSize = 0;
      } else if (position >= 60) {
        this.volumeSize = 100;
      } else {
        this.volumeSize = (position * 100) / 60;
      }
      this.$refs.volume_bar.style.left = this.volumeSize + "%";
    }
  }
};
</script>

<style scoped>
.volume {
  position: relative;
  display: flex;
  align-items: center;
  height: 20px;
  line-height: 20px;
  padding: 0 7px;
  font-size: 12px;
  border-radius: 3px;
  cursor: pointer;
  background: rgb(176, 106, 179);
}
.icon {
  width: 13px;
}

.volume_path {
  display: none;
  position: relative;
  margin: 0 8px 0 13px;
  width: 60px;
  height: 4px;
  border-radius: 2px;
  background: #fff;
}
.volume:hover .volume_path {
  display: block;
}

.volume_bar {
  position: absolute;
  bottom: 0;
  top: 0;
  left: 100%;
  width: 12px;
  height: 12px;
  margin: auto 0;

  background: #fff;
  border-radius: 50%;
  transition: left 0.05s linear 0s;
  transform: translateX(-6px);
}
</style>


