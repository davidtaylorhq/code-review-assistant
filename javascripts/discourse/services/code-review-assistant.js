import Service from "@ember/service";

export default Service.extend({
  active: false,
  currentUrl: null,
  lastOpenedUrl: null,
  activeWindow: null,

  open(url) {
    this.set("active", true);
    if (this.activeWindow && !this.activeWindow.closed) {
      this.activeWindow.location.href = url;
    } else {
      this.activeWindow = window.open(url, "GitHubCommit");
    }
    this.lastOpenedUrl = url;
  },

  urlChanged(url) {
    if (this.activeWindow && this.activeWindow.closed) {
      this.set("active", false);
    }
    if (this.active && url && url !== this.lastOpenedUrl) {
      this.open(url);
    }
    this.currentUrl = url;
  },

  toggleActive() {
    this.set("active", !this.active);
    if (this.active) {
      this.open(this.currentUrl);
    } else if (this.activeWindow) {
      this.activeWindow.close();
    }
  },
});
