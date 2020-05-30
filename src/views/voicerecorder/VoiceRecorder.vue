<template>
  <div id="voice_recorder">
    <time-line
      :recorders="recorders"
      :selected="selected"
      @addANew="addANew"
      @select="changeSelect"
      ref="timeLine"
    />
    <record-buttons
      :haveResource="haveResource"
      :recording="recording"
      @runOrPause="runOrPause"
      @getCurrentRecorders="getCurrentRecorders"
      @stop="stop"
      @pause="pause"
      @play="play"
      @pausePlay="pausePlay"
      @stopPlay="stopPlay"
    />
    <timer />
    <toolbar class="toolbar" ref="toolbar" @popupShow="popupShow" />
    <popup class="popup" ref="popup" :selectedRecorder="selectedRecorder" />
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
      selectedRecorder: {},
      inBackVersion: false,
      haveResource: false
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
        return item.recorderId === this.selected;
      });
      if (temp) {
        this.selectedRecorder = temp;
      } else {
        this.changeSelect(this.recorders[this.recorders.length - 1].recorderId);
      }
    },
    // add a new layer
    addANew() {
      const recorderId = id();
      const recorder = new Recorder({
        sampleBits: 16, // 采样位数，支持 8 或 16，默认是16
        sampleRate: 16000, // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
        numChannels: 1
      });

      this.selectedRecorder = {
        recorderId,
        recorder
      };
      this.selected = recorderId;
      this.recorders.push(this.selectedRecorder);
      this.$store.commit("addversion", this.recorders);
    },
    // 修改  select
    changeSelect(id) {
      if (!this.recording) {
        this.selected = id;
      }
      this.selectedRecorder = this.recorders.find(item => {
        return item.recorderId === this.selected;
      });
    },
    runOrPause(callback) {
      this.recording = !this.recording;
      this.showOrHide();

      // 正在录音
      if (this.recording) {
        if (this.selectedRecorder.recorder.ispause) {
          console.log("继续录音");
          this.resume();
        } else {
          console.log("开始录音");
          this.start();
        }
        // 暂停录音
      } else {
        console.log("暂停录音");
        this.pause();
        this.$store.commit("addversion", this.recorders);
        callback();
      }
    },
    //====================================================================底部toolbar显示
    showOrHide() {
      if (!this.recording) {
        this.$refs.toolbar.$el.style.display = "block";
      } else {
        this.$refs.toolbar.$el.style.display = "none";
      }
    },
    popupShow() {
      this.$refs.popup.$el.style.display = "block";
    },
    // =====================================================================Recorder中的方法调用
    start() {
      this.selectedRecorder.recorder.start().then(
        () => {
          this.startFlag = true;
          // 开始录音
        },
        error => {
          // 出错了
          console.log(`${error.name} : ${error.message}`);
        }
      );
    },
    resume() {
      this.selectedRecorder.recorder.resume();
    },
    stop() {
      this.selectedRecorder.recorder.stop();
      console.log("stop", this.selectedRecorder.recorder.duration);
    },
    pause() {
      this.selectedRecorder.recorder.pause();
      console.log("pause", this.selectedRecorder.recorder);
    },
    //=========================================================================播放相关的方法
    play(fn) {
      console.log("运行play");

      Player.addPlayEnd(fn);
      const temp = lodash.cloneDeep(this.selectedRecorder.recorder); //为什么不行？？？？？？
      console.log("Play前", this.selectedRecorder.recorder, temp);
      Player.play(temp.getWAV().buffer);
      console.log("Play后", this.selectedRecorder.recorder, temp);
    },
    pausePlay() {
      Player.pausePlay();
      console.log("pausePlay", this.selectedRecorder.recorder.duration);
    },
    resumePlay() {
      Player.resumePlay();
    },
    stopPlay() {
      console.log("stopPlay");
      Player.stopPlay();
    },
    getPlayTime() {
      console.log(Player.getPlayTime());
    }
  },
  watch: {
    selectedRecorder: {
      // deep: true,
      handler(val, oldval) {
        console.log("selec watch");
        this.haveResource = val.recorder.duration != 0;
        console.log(this.haveResource);
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