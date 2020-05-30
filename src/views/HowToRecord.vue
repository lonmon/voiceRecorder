<template>
  <div id="how-to-record">
    <h1 class="page_title">How to record sound with a microphone?</h1>
    <div class="content">
      <p>We have tried to make the tool as clear as possible and easy to use. Therefore, you should not have any difficulty with recording sound or voice. But below we described some steps that you will need to do.</p>
    </div>
    <h3 class="page_title">A few steps to record sound</h3>
    <image-list :img-list="imgList" />
  </div>
</template>

<script>
import ImageList from "../components/ImageList";
export default {
  name: "HowToRecord",
  components: { ImageList },
  data() {
    return {
      imgList: [
        {
          url: require("../assets/img/h1.png"),
          title: "Press the record button",
          detail:
            "First click on the button with the microphone icon. It is in the center of the screen."
        },
        {
          url: require("../assets/img/h2.png"),
          title: "Allow access to the microphone",
          detail:
            "Then give access to your microphone, since it is initially closed by the browser."
        },
        {
          url: require("../assets/img/h3.png"),
          title: "Record the desired sound",
          detail:
            "Record the sound you want with your microphone. It will be displayed on the timeline."
        },
        {
          url: require("../assets/img/h4.png"),
          title: "Stop recording",
          detail:
            "When you have finished, click on the same button you pressed to start recording to stop it."
        },
        {
          url: require("../assets/img/h5.png"),
          title: "Listen to the result or re-record",
          detail:
            "Now you can listen to the record, re-record it completely or partially, or continue recording."
        },
        {
          url: require("../assets/img/h6.png"),
          title: "Download or share",
          detail:
            "The final record can be downloaded as an MP3 file or you can get an unique link to it."
        }
      ]
    };
  }
};
</script>

<style scoped>
</style>