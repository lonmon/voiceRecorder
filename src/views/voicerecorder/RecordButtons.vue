<template>
  <div class="record-buttons">
    <button @click="clickLoopPlayback">
      <span class="icon-spinner11" :class="{'notActive':notShowLoopPlayback}"></span>
    </button>
    <button @click="clickPlay" :class="{'notActive':notShowResource }">
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
      isNotLoopPlayback: true,
      notShowResource: true,
      notShowLoopPlayback: true,
      isNotPlay: true,
      cannotUndo: true,
      cannotRedo: true,
      cannotRecord: false,
      tempState: [],
      pausePlay: false,
      recording: false,
      pause: false
    };
  },
  props: {
    // recording: {
    //   type: Boolean,
    //   default: false
    // },
    haveResource: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentVersionInStore() {
      return this.$store.state.currentVersion;
    },
    notHaveResource() {
      this.notShowResource = !this.haveResource;
      return !this.haveResource;
      console.log(!this.haveResource);
    }
  },
  watch: {
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

        // console.log("this.isNotPlay", this.isNotPlay, this.pausePlay);

        if (this.isNotPlay) {
          this.isNotPlay = false; //先执行
          if (this.pausePlay) {
            console.log("emitle ma ");

            this.$emit("resumePlay", () => {
              this.$emit("stopPlay");
              this.isNotPlay = true;
              this.pausePlay = false;
            });
          } else {
            this.$emit("play", () => {
              this.$emit("stopPlay");
              this.isNotPlay = true;
              this.pausePlay = false;
            });
          }
        } else {
          this.$emit("pausePlay");
          this.pausePlay = true;
          this.isNotPlay = true; //先执行
        }
      } else {
        //循环播放的时候
        if (this.isNotPlay) {
          this.isNotPlay = false; //先执行
          if (this.pausePlay) {
            this.pausePlay = false;
            this.LoopPlayback("pausePlay");
          } else {
            this.LoopPlayback();
          }
        } else {
          this.$emit("pausePlay");
          this.pausePlay = true;
          this.isNotPlay = true;
        }
      }
    },
    LoopPlayback(s) {
      if (this.isNotLoopPlayback) {
        this.$emit("stopPlay");
        this.isNotPlay = true;
        this.pausePlay = false;
        return null;
      }
      if (s === "pausePlay") {
        this.$emit("resumePlay", () => {
          this.$emit("stopPlay");
          this.LoopPlayback();
        });
      } else {
        this.$emit("play", () => {
          this.$emit("stopPlay");
          this.LoopPlayback();
        });
      }
    },

    clickLoopPlayback() {
      if (!this.isNotPlay || this.recording) {
        return null;
      }
      this.isNotLoopPlayback = !this.isNotLoopPlayback;
      this.notShowLoopPlayback = !this.notShowLoopPlayback;
    },
    runOrPause() {
      if (!this.isNotPlay) {
        return null;
      }
      // 修改UI
      if (this.recording === false) {
        this.$refs.mic.style.color = "red";
        this.$refs.mic.style.border = "solid 2px red";
        this.changeOtherButton("Record");
      } else {
        this.$refs.mic.style.color = "rgb(61, 159, 234)";
        this.$refs.mic.style.border = "solid 2px rgb(61, 159, 234)";
        this.reSetOtherButton("Record");
      }

      this.recording = !this.recording;
      this.$emit("showOrHide", this.recording);

      // 正在录音
      if (this.recording) {
        if (this.pause) {
          this.$emit("resume");
        } else {
          this.$emit("start");
        }

        // 暂停录音
      } else {
        console.log("暂停录音");
        this.$emit("pause");
        this.pause = true;
        // this.notHaveResource = false;
        console.log(this.notHaveResource);
      }
    },
    changeOtherButton(s) {
      // 先  状态暂存  之后恢复
      this.tempState = [];

      if (s === "Record") {
        this.tempState.push(this.notShowResource);
        this.notShowResource = true;
      }
      if (s === "play") {
        this.tempState.push(this.cannotRecord);
        this.cannotRecord = true;
      }

      this.tempState.push(
        this.notShowLoopPlayback,
        this.cannotUndo,
        this.cannotRedo
      );
      this.notShowLoopPlayback = this.cannotUndo = this.cannotRedo = true;
    },
    reSetOtherButton(s) {
      if (s === "Record") {
        this.notShowResource = this.tempState[0];
      }
      if (s === "play") {
        this.cannotRecord = this.tempState[0];
      }
      this.notShowLoopPlayback = this.tempState[1];
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