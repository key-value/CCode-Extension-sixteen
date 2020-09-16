import Vue from "vue";
import AppComponent from "./App/App.vue";
import { Button, Card } from "element-ui";

Vue.component("app-component", AppComponent);
import "element-ui/lib/theme-chalk/index.css";
Vue.use(Button);
Vue.use(Card);

new Vue({
  el: "#app",
  render: createElement => {
    return createElement(AppComponent);
  }
});
