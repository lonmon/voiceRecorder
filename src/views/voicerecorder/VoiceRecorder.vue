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
      :recorder="recorder"
      @getCurrentRecorders="getCurrentRecorders"
      @toolbarShowOrHide="toolbarShowOrHide"
      @controlVersion="controlVersion"
    />
    <timer />
    <toolbar class="toolbar" ref="toolbar" @popupShow="popupShow" />
    <popup class="popup" ref="popup" :recorder="recorder" />
  </div>
</template>

<script>
import lodash from "lodash";
import Recorder from "js-audio-recorder";

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
      recorder: {},
      inBackVersion: false,
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
    controlVersion(s) {
      this.$store.commit(s, this.recorders);
    },
    getCurrentRecorders() {
      console.log(
        this.$store.state.historyArr[this.$store.state.currentVersion]
      );
      this.recorders = lodash.cloneDeep(
        this.$store.state.historyArr[this.$store.state.currentVersion]
      );

      // 如果选择的不存在，就变成最下面的那个
      const temp = this.recorders.find(item => {
        return item.id === this.recorder.id;
      });
      if (temp) {
        this.recorder = temp;
        console.log(this.recorder.duration);
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
      console.log("新加了一个 ", this.recorder);
    },

    // 修改  select
    changeSelect(recorder) {
      if (!this.recording) {
        this.recorder = recorder;
      }
    },

    //====================================================================底部toolbar显示
    toolbarShowOrHide(recording) {
      const toolvar = this.$refs.toolbar.$el;
      if (recording) {
        toolvar.style.display = "none";
      } else {
        toolvar.style.display = "block";
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
        // console.log(val);
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