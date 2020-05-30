<template>
  <div id="voice_recorder">
    <time-line
      :recorders="recorders"
      :recorder="recorder"
      @addANew="addANew"
      @select="changeSelect"
      ref="timeLine"
    />
    <record-buttons
      :haveResource="haveResource"
      @getCurrentRecorders="getCurrentRecorders"
      @showOrHide="showOrHide"
      @start="start"
      @stop="stop"
      @pause="pause"
      @resume="resume"
      @play="play"
      @pausePlay="pausePlay"
      @stopPlay="stopPlay"
      @resumePlay="resumePlay"
    />
    <timer />
    <toolbar class="toolbar" ref="toolbar" @popupShow="popupShow" />
    <popup class="popup" ref="popup" :recorder="recorder" />
  </div>
</template>

<script>
import lodash from "lodash";
import Recorder from "js-audio-recorder";
import Player from "../../js-audio-recorder/src/player/player";

import { id } from "../../common/utils";

import TimeLine from "./TimeLine";
import RecordButtons from "./RecordButtons";
import Timer from "./Timer";
import Toolbar from "./Toolbar";
import Popup from "./Popup";

export default {
  name: "VioceRecorder",
  data() {
    return {
      recorders: [],
      selected: "",
      recording: false,
      recorder: {},
      inBackVersion: false,
      haveResource: false,
      resouse: {}
    };
  },
  components: {
    TimeLine,
    RecordButtons,
    Timer,
    Toolbar,
    Popup
  },
  methods: {
    getCurrentRecorders(s) {
      this.recorders = lodash.cloneDeep(
        this.$store.state.historyArr[this.$store.state.currentVersion]
      );

      // 如果选择的不存在，就变成最下面的那个
      const temp = this.recorders.find(item => {
        return item.id === this.recorder.id;
      });
      if (temp) {
        this.recorder = temp;
      } else {
        this.changeSelect(this.recorders[this.recorders.length - 1]);
      }
    },
    // add a new layer
    addANew() {
      const recorder = new Recorder({
        sampleBits: 16, // 采样位数，支持 8 或 16，默认是16
        sampleRate: 16000, // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
        numChannels: 1
      });
      recorder.id = id();
      this.recorder = recorder;
      this.recorders.push(this.recorder);
      this.$store.commit("addversion", this.recorders);
    },

    // 修改  select
    changeSelect(recorder) {
      if (!this.recording) {
        this.recorder = recorder;
      }
    },
    runOrPause(callback) {
      this.recording = !this.recording;
      this.showOrHide();

      // 正在录音
      if (this.recording) {
        if (this.recorder.ispause) {
          this.resume();
        } else {
          this.start();
        }
        // 暂停录音
      } else {
        console.log("暂停录音");
        this.pause();
        callback();
      }
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
      this.$store.commit("addversion", this.recorders);

      console.log("pause", this.recorder.ispause);
    },
    //=========================================================================播放相关的方法===================================
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
    },
    //====================================================================底部toolbar显示
    showOrHide(recording) {
      if (!recording) {
        this.$refs.toolbar.$el.style.display = "block";
      } else {
        this.$refs.toolbar.$el.style.display = "none";
      }
    },
    popupShow() {
      this.$refs.popup.$el.style.display = "block";
    }
  },
  watch: {
    recorder: {
      deep: true,
      handler(val, oldval) {
        this.haveResource = val.duration != 0;
        // console.log("haveresource watch", this.haveResource);

        // console.log(this.haveResource);
      }
    }
  },
  mounted() {
    this.addANew();
  }
};
</script>

<style scoped>
#voice_recorder {
  padding: 0 20px;
}
</style>