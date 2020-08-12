<template>
  <div class="comment">
    <div class="comment-wrap" ref="wrapper">
      <div ref="list">
        <div class="box" v-for="(item, key) in list" :key="key">
          <span class="list_item">
            <span v-if="item.nick !== ''" class="nick" :style="randomColor(item.color)">{{item.nick}}</span>
            <span>{{item.text}}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import smoothscroll from "smoothscroll-polyfill";
import { debounce, isScrollBottom } from "../utils/utils";
smoothscroll.polyfill(); // 移动端scrollTo behavior: "smooth"动画失效的polyfill
export default {
  name: "barrage",
  props: {
    barrage: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      list: [
        {
          nick: "公告:",
          text: "欢迎来到汇童易直播间！目前直播间支持拼团商品购买，拼团成功后工厂会投产发货，直播间严禁出现违法违规行为，目前仅支持鞋类童装品类。若有上述情况请及时举报。让我们维护直播和谐宁静的氛围。",
          color: 'rgb(170, 30, 220)'
        }
      ],
      wrapperDom: null,
      listDom: null,
      wrapperHeight: 0
    };
  },
  mounted() {
    this.initDom();
  },
  watch: {
    'barrage': {
      deep: true,
      handler(newVal,oldVal) {
        this.queue(newVal)
      }
    }
  },
  methods: {
    initDom() {
      this.wrapperDom = this.$refs.wrapper;
      this.listDom = this.$refs.list;
      this.wrapperHeight = this.wrapperDom.offsetHeight;
    },
    addTimeOut(opt) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          this.addComment(opt);
          resolve();
        }, 500);
      });
    },
    // 队列添加消息
    async queue(data) {
      let r = Math.floor(Math.random()*255);
      let g = Math.floor(Math.random()*255);
      let b = Math.floor(Math.random()*255);
      const opt = {
        nick: data.nick,
        text: data.text,
        color: `rgb(${r}, ${g}, ${b})`
      }
      await this.addTimeOut(opt);
    },
    addScroll() {
      debounce(this.listScroll, 200);
      this.isBindScrolled = true;
    },
    listScroll() {
      const ele = this.wrapperDom;
      const isBottom = isScrollBottom(ele, ele.clientHeight);
    },
    // 添加评论 如果超过30条就将前30条删除
    addComment(data) {
      if (this.list.length >= 30) {
        this.list.splice(0, 30);
      }
      this.list.push(data);
      this.$nextTick(() => {
        this.renderComment();
      });
    },
    // 渲染评论
    renderComment() {
      const listHight = this.listDom.offsetHeight;
      const diff = listHight - this.wrapperHeight; // 列表高度与容器高度差值
      const top = this.wrapperDom.scrollTop; // 列表滚动高度
      if (diff > 0) {
        if (this.isBindScrolled) {
          this.isBindScrolled = false;
          this.wrapperDom.removeEventListener("scroll", this.addScroll);
        }
        this.wrapperDom.scrollTo({
          top: diff + 10,
          left: 0,
          behavior: "smooth"
        });
        this.restNums = 0;
      }
    },

    randomColor(color) {
      return {
        color: color
      }
    }
  }
};
</script>

<style lang="scss" scope>
* {
  padding: 0;
  margin: 0;
}
.comment-wrap {
  width: 65%;
  max-height: 200px;
  overflow-y: scroll;
  position: absolute;
  bottom: 85px;
  left: 12px;
  &::-webkit-scrollbar {
    display: none;
  }
  .box {
    display: flex;
    &:not(:first-child) {
      margin-top: 5px;
    }
    .list_item {
      padding: 5px 10px;
      background-color: rgba(0, 0, 0, 0.5);
      font-size: 12px;
      color: #ffffff;
      border-radius: 5px;
      .nick {
        margin-right: 5px;
      }
    }
  }
}
</style>