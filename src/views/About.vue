<template>
  <div id="about">
    <h1 class="page_title">The best online voice recording tool</h1>
    <div class="content">
      <p>Our main goal is to create the best online sound recording tool. Therefore, using this tool, you will regularly see the emergence of new cool functionality. We sincerely hope that you like what we do.</p>
    </div>
    <h3 class="page_title">Recording features</h3>
    <image-list :img-list="imgList" />
  </div>
</template>

<script>
import ImageList from "../components/ImageList";

export default {
  name: "About",
  components: {
    ImageList
  },
  data() {
    return {
      imgList: [
        {
          url: require("../assets/img/a1.png"),
          title: "Free online voice recorder",
          detail:
            "You do not need to download and install any program on your computer. You can do it online and it's absolutely free."
        },
        {
          url: require("../assets/img/a2.png"),
          title: "Ability to move by record",
          detail:
            "You can navigate through the recording by using your mouse. There are also several convenient buttons for this."
        },
        {
          url: require("../assets/img/a3.png"),
          title: "Support for layers (tracks)",
          detail:
            "You can record several audio tracks that will be superimposed. This is very useful when you need to create a complex record."
        },
        {
          url: require("../assets/img/a4.png"),
          title: "Undo and redo actions",
          detail:
            "When you have deleted something you need or recorded an unsuccessful fragment, you can cancel this action."
        },
        {
          url: require("../assets/img/a5.png"),
          title: "Download in MP3 format",
          detail:
            "Since the most common audio format is MP3, we hope that it will be convenient for you to download the summary record in it."
        },
        {
          url: require("../assets/img/a6.png"),
          title: "Possibility to share the recording",
          detail:
            "In addition to downloading, you can also share a record by getting a unique link to it. We will store it on our servers."
        }
      ]
    };
  }
};
</script>

<style scoped>
</style>