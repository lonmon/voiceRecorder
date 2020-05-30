<template>
  <div class="timeline">
    <div class="timeline_header">
      <button class="add_a_new" @click="addANew">
        <i class="fa fa-plus-square fa-lg" aria-hidden="true"></i>Add a new layer
      </button>
      <div class="control_buttons">
        <button>
          <i class="fa fa-fast-backward" aria-hidden="true"></i>
        </button>
        <button>
          <i class="fa fa-backward" aria-hidden="true"></i>
        </button>
        <button>
          <i class="fa fa-forward" aria-hidden="true"></i>
        </button>
        <button>
          <i class="fa fa-fast-forward" aria-hidden="true"></i>
        </button>
        <button>
          <i class="fa fa-search-minus" aria-hidden="true"></i>
        </button>
        <button>
          <i class="fa fa-search-plus" aria-hidden="true"></i>
        </button>
      </div>
    </div>
    <div class="timeline_content">
      <!-- 竖线 -->
      <div class="timeline_cursor"></div>
      <!-- 蓝筐 -->
      <div class="timeline_scale"></div>
      <!-- 白布 -->
      <div v-for="item in recorders" :key="item.id">
        <div class="timeline_layers">
          <div class="timeline_layers_buttons">
            <button v-if="item.id===recorder.id">SELECTED</button>
            <button v-else class="btnunselected" @click="select(item)">SELECT</button>
            <volume class="volume" ref="volume" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Volume from "../../components/Volume";
export default {
  name: "TimeLine",
  components: {
    Volume
  },
  props: {
    recorders: {
      type: Array,
      default() {
        return [];
      }
    },
    recorder: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  // props: ["recorders", "selected"],
  // props: { recorders: Object, selected: String },

  methods: {
    addANew() {
      this.$emit("addANew");
    },
    select(recorder) {
      this.$emit("select", recorder);
    }
  }
};
</script>

<style scoped>
.timeline {
  margin: 60px 0 40px;
}
.timeline_header {
  position: relative;
  height: 36px;
  margin-bottom: 20px;
}

/* =======================add a new layer  button ======================*/
.add_a_new {
  height: 36px;
  line-height: 36px;
  padding: 0 12px;

  color: #fff;
  font-size: 14px;
  border-radius: 3px;
  background-color: rgba(0, 0, 0, 0.15);
}
.add_a_new:hover {
  background: rgba(0, 0, 0, 0.2);
}
.fa-plus-square {
  margin-right: 10px;
}

/* =================right  buttons ===========================*/
.control_buttons {
  position: absolute;
  right: 0;
  bottom: 0;
}
.control_buttons button {
  background: rgb(247, 247, 253);
  margin-left: 1px;
  /* opacity: 0.5; */
}
.control_buttons :nth-child(4),
.control_buttons :last-child {
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
}
.control_buttons > :nth-child(1),
.control_buttons > :nth-child(5) {
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  margin-left: 6px;
}
.control_buttons > :nth-child(3) {
  margin-left: 2px;
}
.control_buttons i {
  color: rgb(53, 54, 59);
  font-size: 11px;
  margin: 7px 10px;
}
/* ==================================================== */
.timeline_content {
  position: relative;
}

/* =======================那一条竖线 =================*/
.timeline_cursor {
  position: absolute;
  width: 2px;
  height: 100%;
  left: 0;
  right: 0;
  margin: 0 auto;
  background: rgb(255, 174, 0);
}

.timeline_cursor::before {
  content: "";
  position: absolute;
  left: -4px;
  top: -6px;
  width: 0;
  height: 0;
  border-top: solid 8px rgb(255, 174, 0);
  border-left: solid 5px transparent;
  border-right: solid 5px transparent;
  border-bottom: solid 8px transparent;
}
.timeline_cursor::after {
  content: "";
  position: absolute;
  left: -4px;
  bottom: -6px;
  width: 0;
  height: 0;
  border-bottom: solid 8px rgb(255, 174, 0);
  border-left: solid 5px transparent;
  border-right: solid 5px transparent;
  border-top: solid 8px transparent;
}
.timeline_scale {
  height: 20px;
  background: rgb(61, 159, 234);
  border-radius: 2px;
}

/* =============layers========================= */
.timeline_layers {
  height: 91px;
  margin-top: 6px;
  background: #fff;
  text-align: left;
  border-radius: 3px;
}
.timeline_layers_buttons {
  display: flex;
  align-items: center;
  padding: 4px;
}
.timeline_layers_buttons button {
  height: 20px;
  border-radius: 3px;
  padding: 0 8px;
  margin-right: 4px;
  font-size: 10px;
  font-weight: 400;
  color: #fff;
  background: rgb(61, 159, 234);
}

/* ==================================================== */
.btnunselected {
  opacity: 0.5;
}
</style>