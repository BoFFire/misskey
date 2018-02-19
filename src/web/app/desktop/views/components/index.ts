import Vue from 'vue';

import ui from './ui.vue';
import uiHeader from './ui-header.vue';
import uiHeaderAccount from './ui-header-account.vue';
import uiHeaderClock from './ui-header-clock.vue';
import uiHeaderNav from './ui-header-nav.vue';
import uiHeaderNotifications from './ui-header-notifications.vue';
import uiHeaderPostButton from './ui-header-post-button.vue';
import uiHeaderSearch from './ui-header-search.vue';
import uiNotification from './ui-notification.vue';
import home from './home.vue';
import timeline from './timeline.vue';
import posts from './posts.vue';
import postsPost from './posts-post.vue';
import postsPostSub from './posts-post-sub.vue';
import subPostContent from './sub-post-content.vue';
import window from './window.vue';
import postFormWindow from './post-form-window.vue';
import repostFormWindow from './repost-form-window.vue';
import analogClock from './analog-clock.vue';
import ellipsisIcon from './ellipsis-icon.vue';
import imagesImage from './images-image.vue';
import imagesImageDialog from './images-image-dialog.vue';
import notifications from './notifications.vue';
import postForm from './post-form.vue';
import repostForm from './repost-form.vue';
import followButton from './follow-button.vue';
import postPreview from './post-preview.vue';
import drive from './drive.vue';
import driveFile from './drive-file.vue';
import driveFolder from './drive-folder.vue';
import driveNavFolder from './drive-nav-folder.vue';
import postDetail from './post-detail.vue';
import settings from './settings.vue';
import calendar from './calendar.vue';
import wNav from './widgets/nav.vue';
import wCalendar from './widgets/calendar.vue';
import wPhotoStream from './widgets/photo-stream.vue';
import wSlideshow from './widgets/slideshow.vue';
import wTips from './widgets/tips.vue';
import wDonation from './widgets/donation.vue';
import wNotifications from './widgets/notifications.vue';
import wBroadcast from './widgets/broadcast.vue';
import wTimemachine from './widgets/timemachine.vue';

Vue.component('mk-ui', ui);
Vue.component('mk-ui-header', uiHeader);
Vue.component('mk-ui-header-account', uiHeaderAccount);
Vue.component('mk-ui-header-clock', uiHeaderClock);
Vue.component('mk-ui-header-nav', uiHeaderNav);
Vue.component('mk-ui-header-notifications', uiHeaderNotifications);
Vue.component('mk-ui-header-post-button', uiHeaderPostButton);
Vue.component('mk-ui-header-search', uiHeaderSearch);
Vue.component('mk-ui-notification', uiNotification);
Vue.component('mk-home', home);
Vue.component('mk-timeline', timeline);
Vue.component('mk-posts', posts);
Vue.component('mk-posts-post', postsPost);
Vue.component('mk-posts-post-sub', postsPostSub);
Vue.component('mk-sub-post-content', subPostContent);
Vue.component('mk-window', window);
Vue.component('mk-post-form-window', postFormWindow);
Vue.component('mk-repost-form-window', repostFormWindow);
Vue.component('mk-analog-clock', analogClock);
Vue.component('mk-ellipsis-icon', ellipsisIcon);
Vue.component('mk-images-image', imagesImage);
Vue.component('mk-images-image-dialog', imagesImageDialog);
Vue.component('mk-notifications', notifications);
Vue.component('mk-post-form', postForm);
Vue.component('mk-repost-form', repostForm);
Vue.component('mk-follow-button', followButton);
Vue.component('mk-post-preview', postPreview);
Vue.component('mk-drive', drive);
Vue.component('mk-drive-file', driveFile);
Vue.component('mk-drive-folder', driveFolder);
Vue.component('mk-drive-nav-folder', driveNavFolder);
Vue.component('mk-post-detail', postDetail);
Vue.component('mk-settings', settings);
Vue.component('mk-calendar', calendar);
Vue.component('mkw-nav', wNav);
Vue.component('mkw-calendar', wCalendar);
Vue.component('mkw-photo-stream', wPhotoStream);
Vue.component('mkw-slideshoe', wSlideshow);
Vue.component('mkw-tips', wTips);
Vue.component('mkw-donation', wDonation);
Vue.component('mkw-notifications', wNotifications);
Vue.component('mkw-broadcast', wBroadcast);
Vue.component('mkw-timemachine', wTimemachine);
