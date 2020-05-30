<template>
  <div class="popup" ref="popup">
    <div>
      <span>Get a link to the record</span>
      <button>www</button>
    </div>
    <div @click.stop="MP3Click">
      <span>Download MP3 file</span>
      <button ref="MP3">MP3</button>
    </div>
    <i ref="i" class="i"></i>
  </div>
</template>

<script>
import convertToMp3 from "../../common/convertToMp3";

export default {
  name: "Popup",
  data() {
    return {
      isDownloading: false
    };
  },
  props: {
    selectedRecorder: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  mounted() {
    this.$nextTick(() => {
      document.addEventListener("click", () => {
        if (this.$refs.popup) {
          this.$refs.popup.style.display = "";
        }
      });
    });
  },
  methods: {
    MP3Click() {
      this.$refs.MP3.innerHTML = "PROCESSING";
      this.getMP3File();
      this.$refs.MP3.innerHTML = "MP3";
    },
    getMP3File() {
      const mp3 = convertToMp3(this.selectedRecorder.recorder);
      const url = window.URL.createObjectURL(mp3);
      const a = document.createElement("a");
      a.download = "a_mp3_from_recorder";
      a.style.display = "none";
      a.href = url;
      // 触发点击
      this.$refs.i.appendChild(a);
      a.click();
      // 然后移除
      this.$refs.i.removeChild(a);
    },
    stopbub() {
      return null;
    }
  }
};
</script>

<style scoped>
.popup {
  display: none;
  position: fixed;
  width: 280px;
  left: 0;
  right: 0;
  bottom: 72px;
  margin: 0 auto;
  border-radius: 5px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}
.popup::after {
  content: "";
  position: absolute;
  width: 14px;
  height: 14px;
  background: #fff;
  bottom: -7px;
  box-shadow: -2px 2px 2px rgba(0, 0, 0, 0.4);
  transform: rotateZ(-45deg);
}
.popup div {
  height: 20px;
  padding: 12px;
  box-sizing: content-box;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
}
.popup div:hover {
  background: rgba(0, 0, 0, 0.05);
}
.popup > div:nth-child(1) {
  border-bottom: solid 1px #ccc;
}
button {
  padding: 3px 6px;
  color: #fff;
  font-weight: 400;
  border-radius: 3px;
}
div:nth-child(1) > button {
  background: rgb(76, 175, 80);
}
div:nth-child(2) > button {
  background: rgb(61, 159, 234);
}
span {
  color: #000;
}

i {
  display: none;
}
</style>