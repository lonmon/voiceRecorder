<template>
  <div class="record-buttons">
    <button @click="clickLoopPlayback">
      <span class="icon-spinner11" :class="{'notActive':notShowLoopPlayback}"></span>
    </button>
    <button @click="clickPlay" :class="{'notActive':notHaveResource }">
      <span class="icon-stop2" v-if="this.recorder.isplaying"></span>
      <span class="icon-play3" v-else></span>
    </button>
    <button @click="runOrPause">
      <span
        class="icon-mic"
        ref="mic"
        :class="{'notActive':cannotRecord,'isrecording':isrecording }"
      ></span>
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
import lodash from "lodash";

export default {
  name: "RecordButtons",
  data() {
    return {
      playIsPause: false,
      notHaveResource: true,
      isrecording: false,
      isNotLoopPlayback: true,
      notShowResource: true,
      notShowLoopPlayback: true,
      isNotPlay: true,
      cannotUndo: true,
      cannotRedo: true,
      cannotRecord: false,

      tempState: [],
      recording: false
    };
  },
  props: {
    recorder: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {
    currentVersionInStore() {
      return this.$store.state.currentVersion;
    }
  },
  watch: {
    //播放监听
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
        this.$emit("controlVersion", "foreVersion");
        this.$emit("getCurrentRecorders");
      }
    },
    undo() {
      if (this.cannotUndo) {
        return null;
      } else {
        this.$emit("controlVersion", "backVersion");
        this.$emit("getCurrentRecorders");
      }
    },
    clickPlay() {
      if (this.notHaveResource || this.recording) {
        return null;
      }
      if (this.isNotLoopPlayback) {
        // 如果没有循环播放

        // console.log("this.isNotPlay", this.isNotPlay, this.pausePlay);

        if (this.recorder.isplaying) {
          if (this.playIsPause) {
            this.$emit("resumePlay", () => {
              this.$emit("stopPlay");
              this.playIsPause = false;
            });
          } else {
            this.$emit("pausePlay");
            this.playIsPause = true;
          }
        } else {
          this.play(() => {
            this.$emit("stopPlay");
            this.playIsPause = false;
          });
        }
      } else {
        //循环播放的时候
        if (this.isNotPlay) {
          if (this.playIsPause) {
            this.playIsPause = false;
            this.LoopPlayback("playIsPause");
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
        this.notShowLoopPlayback,
        this.cannotUndo,
        this.cannotRedo
      );
      this.notShowLoopPlayback = this.cannotUndo = this.cannotRedo = true;
    },
    reSetOtherButton(s) {
      if (s === "Record") {
        this.notHaveResource = this.tempState[0];
      }
      if (s === "play") {
        this.cannotRecord = this.tempState[0];
      }
      this.notShowLoopPlayback = this.tempState[1];
      this.cannotUndo = this.tempState[2];
      this.cannotRedo = this.tempState[3];
    },

    // =====================================================================Recorder中的方法调用
    start() {
      this.recorder.start().then(
        () => {
          console.log("开始录音");
          // 开始录音
        },
        error => {
          // 出错了
          console.log(`${error.name} : ${error.message}`);
        }
      );
    },
    resume() {
      console.log("继续录音", this.recorder);

      this.recorder.resume();
    },
    stop() {
      this.recorder.stop();
      console.log("stop", this.recorder.duration);
    },
    pause() {
      this.recorder.pause();
      // this.ispause = true;
      this.$emit("controlVersion", "addversion");

      // console.log("pause", this.recorder.ispause);
    },
    //=========================================================================播放相关的方法===================================
    runOrPause() {
      this.isrecording = !this.isrecording;
      if (this.recorder.isplaying) {
        return null;
      }
      // 修改其他的button
      if (this.isrecording) {
        this.changeOtherButton("Record");
      } else {
        this.reSetOtherButton("Record");
      }

      this.$emit("toolbarShowOrHide", this.isrecording);

      // 在录音->暂停/继续
      if (this.recorder.isrecording) {
        if (this.recorder.ispause) {
          this.resume();
        } else {
          console.log("暂停录音");
          this.pause();
          this.notHaveResource = false;
          // console.log(this.notHaveResource);
        }
        // 没在录音就开始录音
      } else {
        this.start();
      }
    },
    play(fn) {
      console.log("运行play");
      this.resouse = lodash.cloneDeep(this.recorder); //为什么不行？？？？？？
      // this.resouse = this.recorder; //为什么不行？？？？？？
      this.resouse.onstopplay = () => {
        console.log("onstopplay", {
          ispause: this.recorder.ispause,
          isplaying: this.recorder.isplaying,
          isrecording: this.recorder.isrecording
        });
      };
      this.resouse.onplayend = () => {
        console.log("运行结束", {
          ispause: this.recorder.ispause,
          isplaying: this.recorder.isplaying,
          isrecording: this.recorder.isrecording
        });
        fn();
      };
      this.resouse.onplay = () => {};

      console.log("Play前", {
        ispause: this.recorder.ispause,
        isplaying: this.recorder.isplaying,
        isrecording: this.recorder.isrecording
      });
      this.resouse.play();
      console.log("Play后", {
        ispause: this.recorder.ispause,
        isplaying: this.recorder.isplaying,
        isrecording: this.recorder.isrecording
      });
    },
    pausePlay() {
      console.log("暂停播放", this.resouse.duration);
      this.resouse.pausePlay();
    },
    resumePlay(fn) {
      console.log("继续播放");
      this.resouse.onplayend = fn;
      this.resouse.resumePlay();
    },
    stopPlay() {
      console.log("结束播放");
      this.resouse.stopPlay();
    },
    getPlayTime() {
      console.log(this.resouse.getPlayTime());
    }
  },
  updated() {
    this.notHaveResource = this.recorder.duration === 0;
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
.isrecording {
  color: red;
  border: solid 2px red !important;
}
</style>