import Vue from "vue";
import VueRouter from "vue-router";

const VoiceRecorder = () => import("../views/voicerecorder/VoiceRecorder.vue");
const HowToRecord = () => import("../views/HowToRecord.vue");
const About = () => import("../views/About.vue");
const Disclaimer = () => import("../views/Disclaimer.vue");
const Feedback = () => import("../views/Feedback.vue");

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "VoiceRecorder",
    component: VoiceRecorder,
  },
  {
    path: "/how-to-record",
    name: "HowToRecord",
    component: HowToRecord,
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/disclaimer",
    name: "Disclaimer",
    component: Disclaimer,
  },
  {
    path: "/feedback",
    name: "Feedback",
    component: Feedback,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
