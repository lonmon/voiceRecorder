<template>
  <div class="record-buttons">
    <button @click="clickLoopPlayback">
      <span class="icon-spinner11" :class="{'notActive':isNotLoopPlayback}"></span>
    </button>
    <button @click="clickPlay" :class="{'notActive':notHaveResource}">
      <span class="icon-play3" v-if="isNotPlay"></span>
      <span class="icon-stop2" v-else></span>
    </button>
    <button>
      <span class="icon-mic" @click="runOrPause" ref="mic" :class="{'notActive':cannotRecord}"></span>
    </button>
    <button>
      <span class="icon-undo2" @click="undo" :class="{'notActive':cannotUndo}"></span>
    </button>
    <button>
      <span class="icon-redo2" @click="redo" :class="{'notActive':cannotRedo}"></span>
    </button>
  </div>
</template>

<script>
export default {
  name: "RecordButtons",
  data() {
    return {
      notHaveResource: true,
      isNotLoopPlayback: true,
      isNotPlay: true,
      cannotUndo: true,
      cannotRedo: true,
      cannotRecord: false,
      tempState: [],
      pausePlay: false
    };
  },
  props: {
    recording: {
      type: Boolean,
      default: false
    },
    haveResource: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentVersionInStore() {
      return this.$store.state.currentVersion;
    }
  },
  watch: {
    haveResource: {
      handler(val, oldval) {
        console.log("当前haveResource：" + val);
        this.notHaveResource = !val;
        console.log("this.notHaveResource ", this.notHaveResource);
      }
    },
    isNotPlay(val, oldval) {
      if (val === true && oldval === false) {
        this.reSetOtherButton("play");
      }
      if (val === false && oldval === true) {
        this.changeOtherButton("play");
      }
    },
    currentVersionInStore(val, oldval) {
      console.log("当前版本:" + val);

      if (val === this.$store.state.historyArr.length - 1) {
        this.cannotRedo = true;
      } else {
        this.cannotRedo = false;
      }
      if (val === 0) {
        this.cannotUndo = true;
      } else {
        this.cannotUndo = false;
      }
    }
  },
  methods: {
    redo() {
      if (this.cannotRedo) {
        return null;
      } else {
        this.$store.commit("foreVersion");
        this.$emit("getCurrentRecorders");
      }
    },
    undo() {
      if (this.cannotUndo) {
        return null;
      } else {
        this.$store.commit("backVersion");
        this.$emit("getCurrentRecorders", "toBackVersion");
      }
    },
    clickPlay() {
      if (this.notHaveResource || this.recording) {
        return null;
      }
      if (this.isNotLoopPlayback) {
        // 如果没有循环播放

        if (this.isNotPlay) {
          this.isNotPlay = !this.isNotPlay; //先执行
          if (this.pausePlay) {
            this.$emit("resumePlay", () => {
              this.$emit("stopPlay");
              this.isNotPlay = true;
            });
          } else {
            this.$emit("play", () => {
              this.$emit("stopPlay");
              this.isNotPlay = true;
            });
          }
        } else {
          this.$emit("pausePlay");
          this.pausePlay = true;
          this.isNotPlay = !this.isNotPlay; //先执行
        }
      }
    },
    clickLoopPlayback() {
      this.isNotLoopPlayback = !this.isNotLoopPlayback;
    },
    runOrPause() {
      if (!this.isNotPlay) {
        return null;
      }

      if (this.recording === false) {
        this.$refs.mic.style.color = "red";
        this.$refs.mic.style.border = "solid 2px red";
        this.changeOtherButton("Record");
      } else {
        this.$refs.mic.style.color = "rgb(61, 159, 234)";
        this.$refs.mic.style.border = "solid 2px rgb(61, 159, 234)";
        this.reSetOtherButton("Record");
      }
      this.$emit("runOrPause", () => {
        this.notHaveResource = false;
      });
    },
    changeOtherButton(s) {
      // 先  状态暂存  之后恢复
      this.tempState = [];

      if (s === "Record") {
        this.tempState.push(this.notHaveResource);
        this.notHaveResource = true;
      }
      if (s === "play") {
        this.tempState.push(this.cannotRecord);
        this.cannotRecord = true;
      }

      this.tempState.push(
        this.isNotLoopPlayback,
        this.cannotUndo,
        this.cannotRedo
      );
      this.isNotLoopPlayback = this.cannotUndo = this.cannotRedo = true;
    },
    reSetOtherButton(s) {
      if (s === "Record") {
        this.notHaveResource = this.tempState[0];
      }
      if (s === "play") {
        this.cannotRecord = this.tempState[0];
      }
      this.isNotLoopPlayback = this.tempState[1];
      this.cannotUndo = this.tempState[2];
      this.cannotRedo = this.tempState[3];
    }
  }
};
</script>

<style scoped>
.record-buttons {
  height: 60px;
}
button {
  width: 56px;
  height: 56px;
  font-size: 24px;
  color: #fff;
}
button:nth-child(3) {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 0 30px;
  color: rgb(61, 159, 234);
  background: #fff;
  border-radius: 50%;
}
button:nth-child(3) span {
  border: solid 2px rgb(61, 159, 234);
  padding: 12px;
  border-radius: 50%;
}
.notActive {
  opacity: 0.5;
}
</style>