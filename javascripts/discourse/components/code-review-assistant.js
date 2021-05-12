import Component from "@ember/component";
import discourseComputed from "discourse-common/utils/decorators";
import { inject as service } from "@ember/service";
import { observes } from "discourse-common/utils/decorators";

export default Component.extend({
  codeReviewAssistant: service(),

  @observes("commitUrl")
  urlChanged() {
    this.codeReviewAssistant.urlChanged(this.commitUrl);
  },

  didInsertElement() {
    this.codeReviewAssistant.urlChanged(this.commitUrl);
  },

  @discourseComputed("model")
  githubRepoName(model) {
    if (
      model &&
      model.category &&
      model.category.custom_fields &&
      model.category.custom_fields["GitHub Repo Name"]
    ) {
      return model.category.custom_fields["GitHub Repo Name"];
    } else {
      return null;
    }
  },

  @discourseComputed("githubRepoName")
  shouldDisplay(repoName) {
    return !!repoName;
  },

  @discourseComputed("model.postStream.posts.[]", "shouldDisplay")
  commitUrl(posts, shouldDisplay) {
    if (!shouldDisplay) {
      return;
    }

    if (posts[0]) {
      const matches = posts[0].cooked.match(
        /<a href="(https:\/\/github\.com\/.*?)".*>(<small>)?GitHub(<\/small>)?<\/a>/
      );

      if (matches) {
        return matches[1];
      }
    }
  },

  actions: {
    toggleActive() {
      this.codeReviewAssistant.toggleActive();
    },
  },
});
