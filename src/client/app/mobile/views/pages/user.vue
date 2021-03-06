<template>
<mk-ui>
	<template slot="header" v-if="!fetching"><img :src="user.avatarUrl" alt="">{{ user | userName }}</template>
	<main v-if="!fetching">
		<div class="is-suspended" v-if="user.isSuspended"><p><fa icon="exclamation-triangle"/> {{ $t('is-suspended') }}</p></div>
		<div class="is-remote" v-if="user.host != null"><p><fa icon="exclamation-triangle"/> {{ $t('@.is-remote-user') }}<a :href="user.url || user.uri" target="_blank">{{ $t('@.view-on-remote') }}</a></p></div>
		<header>
			<div class="banner" :style="style"></div>
			<div class="body">
				<div class="top">
					<a class="avatar">
						<img :src="user.avatarUrl" alt="avatar"/>
					</a>
					<button class="menu" ref="menu" @click="menu"><fa icon="ellipsis-h"/></button>
					<mk-follow-button v-if="$store.getters.isSignedIn && $store.state.i.id != user.id" :user="user"/>
				</div>
				<div class="title">
					<h1>{{ user | userName }}</h1>
					<span class="username"><mk-acct :user="user" :detail="true" /></span>
					<span class="followed" v-if="user.isFollowed">{{ $t('follows-you') }}</span>
				</div>
				<div class="description">
					<misskey-flavored-markdown v-if="user.description" :text="user.description" :i="$store.state.i"/>
				</div>
				<div class="info">
					<p class="location" v-if="user.host === null && user.profile.location">
						<fa icon="map-marker"/>{{ user.profile.location }}
					</p>
					<p class="birthday" v-if="user.host === null && user.profile.birthday">
						<fa icon="birthday-cake"/>{{ user.profile.birthday.replace('-', '年').replace('-', '月') + '日' }} ({{ $t('years-old', { age }) }})
					</p>
				</div>
				<div class="status">
					<a>
						<b>{{ user.notesCount | number }}</b>
						<i>{{ $t('notes') }}</i>
					</a>
					<a :href="user | userPage('following')">
						<b>{{ user.followingCount | number }}</b>
						<i>{{ $t('following') }}</i>
					</a>
					<a :href="user | userPage('followers')">
						<b>{{ user.followersCount | number }}</b>
						<i>{{ $t('followers') }}</i>
					</a>
				</div>
			</div>
		</header>
		<nav>
			<div class="nav-container">
				<a :data-active="page == 'home'" @click="page = 'home'"><fa icon="home"/> {{ $t('overview') }}</a>
				<a :data-active="page == 'notes'" @click="page = 'notes'"><fa :icon="['far', 'comment-alt']"/> {{ $t('timeline') }}</a>
				<a :data-active="page == 'media'" @click="page = 'media'"><fa icon="image"/> {{ $t('media') }}</a>
			</div>
		</nav>
		<div class="body">
			<x-home v-if="page == 'home'" :user="user"/>
			<mk-user-timeline v-if="page == 'notes'" :user="user" key="tl"/>
			<mk-user-timeline v-if="page == 'media'" :user="user" :with-media="true" key="media"/>
		</div>
	</main>
</mk-ui>
</template>

<script lang="ts">
import Vue from 'vue';
import i18n from '../../../i18n';
import * as age from 's-age';
import parseAcct from '../../../../../misc/acct/parse';
import Progress from '../../../common/scripts/loading';
import Menu from '../../../common/views/components/menu.vue';
import XHome from './user/home.vue';

export default Vue.extend({
	i18n: i18n('mobile/views/pages/user.vue'),
	components: {
		XHome
	},
	data() {
		return {
			fetching: true,
			user: null,
			page: 'home'
		};
	},
	computed: {
		age(): number {
			return age(this.user.profile.birthday);
		},
		style(): any {
			if (this.user.bannerUrl == null) return {};
			return {
				backgroundColor: this.user.bannerColor && this.user.bannerColor.length == 3 ? `rgb(${ this.user.bannerColor.join(',') })` : null,
				backgroundImage: `url(${ this.user.bannerUrl })`
			};
		}
	},
	watch: {
		$route: 'fetch'
	},
	created() {
		this.fetch();
	},
	methods: {
		fetch() {
			Progress.start();

			this.$root.api('users/show', parseAcct(this.$route.params.user)).then(user => {
				this.user = user;
				this.fetching = false;

				Progress.done();
				document.title = `${Vue.filter('userName')(this.user)} | ${this.$root.instanceName}`;
			});
		},

		menu() {
			let menu = [{
				icon: this.user.isMuted ? '<fa icon="eye"/>' : '<fa icon="eye-slash"/>',
				text: this.user.isMuted ? this.$t('unmute') : this.$t('mute'),
				action: () => {
					if (this.user.isMuted) {
						this.$root.api('mute/delete', {
							userId: this.user.id
						}).then(() => {
							this.user.isMuted = false;
						}, () => {
							alert('error');
						});
					} else {
						this.$root.api('mute/create', {
							userId: this.user.id
						}).then(() => {
							this.user.isMuted = true;
						}, () => {
							alert('error');
						});
					}
				}
			}, {
				icon: this.user.isBlocking ? '<fa icon="user"/>' : '<fa icon="user-slash"/>',
				text: this.user.isBlocking ? this.$t('unblock') : this.$t('block'),
				action: () => {
					if (this.user.isBlocking) {
						this.$root.api('blocking/delete', {
							userId: this.user.id
						}).then(() => {
							this.user.isBlocking = false;
						}, () => {
							alert('error');
						});
					} else {
						this.$root.api('blocking/create', {
							userId: this.user.id
						}).then(() => {
							this.user.isBlocking = true;
						}, () => {
							alert('error');
						});
					}
				}
			}];

			this.$root.new(Menu, {
				source: this.$refs.menu,
				compact: true,
				items: menu
			});
		},
	}
});
</script>

<style lang="stylus" scoped>
main
	$bg = var(--face)

	> .is-suspended
	> .is-remote
		&.is-suspended
			color #570808
			background #ffdbdb

		&.is-remote
			color #573c08
			background #fff0db

		> p
			margin 0 auto
			padding 14px
			max-width 600px
			font-size 14px

			> a
				font-weight bold

			@media (max-width 500px)
				padding 12px
				font-size 12px

	> header
		background $bg

		> .banner
			padding-bottom 33.3%
			background-color rgba(0, 0, 0, 0.1)
			background-size cover
			background-position center

		> .body
			padding 12px
			margin 0 auto
			max-width 600px

			> .top
				display flex

				> .avatar
					display block
					width 25%
					height 40px

					> img
						display block
						position absolute
						left -2px
						bottom -2px
						width 100%
						background $bg
						border 3px solid $bg
						border-radius 6px

						@media (min-width 500px)
							left -4px
							bottom -4px
							border 4px solid $bg
							border-radius 12px

				> .menu
					margin 0 0 0 auto
					padding 8px
					margin-right 8px
					font-size 18px
					color var(--text)

				> .mk-follow-button
					margin 0

			> .title
				margin 8px 0

				> h1
					margin 0
					line-height 22px
					font-size 20px
					color var(--mobileUserPageName)

				> .username
					display inline-block
					line-height 20px
					font-size 16px
					font-weight bold
					color var(--mobileUserPageAcct)

				> .followed
					margin-left 8px
					padding 2px 4px
					font-size 12px
					color var(--mobileUserPageFollowedFg)
					background var(--mobileUserPageFollowedBg)
					border-radius 4px

			> .description
				margin 8px 0
				color var(--mobileUserPageDescription)

			> .info
				margin 8px 0

				> p
					display inline
					margin 0 16px 0 0
					color var(--text)

					> i
						margin-right 4px

			> .status
				> a
					color var(--text)

					&:not(:last-child)
						margin-right 16px

					> b
						margin-right 4px
						font-size 16px
						color var(--mobileUserPageStatusHighlight)

					> i
						font-size 14px

	> nav
		position -webkit-sticky
		position sticky
		top 47px
		box-shadow 0 4px 4px var(--mobileUserPageHeaderShadow)
		background-color $bg
		z-index 2

		> .nav-container
			display flex
			justify-content center
			margin 0 auto
			max-width 600px

			> a
				display block
				flex 1 1
				text-align center
				line-height 48px
				font-size 12px
				text-decoration none
				color var(--text)
				border-bottom solid 2px transparent

				@media (min-width 400px)
					line-height 52px
					font-size 14px

				&[data-active]
					font-weight bold
					color var(--primary)
					border-color var(--primary)

	> .body
		max-width 680px
		margin 0 auto
		padding 8px

		@media (min-width 500px)
			padding 16px

		@media (min-width 600px)
			padding 32px

</style>
