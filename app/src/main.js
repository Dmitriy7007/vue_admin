var Vue = require("vue");
const axios = require("axios/dist/browser/axios.cjs");

new Vue({
  el: "#app",
  data: {
    pageList: [],
    newPageName: "",
  },
  methods: {
    createPage() {
      axios
        .post("./api/createNewHtmlPage.php", { name: this.newPageName })
        .then(() => this.updatePageList());
    },
    updatePageList() {
      axios.get("./api/api.php").then((response) => {
        this.pageList = response.data;
      });
    },
    deletePage(page) {
      axios.post("./api/deletePage.php", { name: page }).then(() => {
        this.updatePageList();
      });
    },
  },
  created() {
    this.updatePageList();
  },
});
