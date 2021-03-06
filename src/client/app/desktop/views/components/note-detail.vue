<template>
<div class="mk-note-detail" :title="title">
	<button
		class="read-more"
		v-if="p.reply && p.reply.replyId && conversation.length == 0"
		:title="$t('title')"
		@click="fetchConversation"
		:disabled="conversationFetching"
	>
		<template v-if="!conversationFetching"><fa icon="ellipsis-v"/></template>
		<template v-if="conversationFetching"><fa icon="spinner .pulse"/></template>
	</button>
	<div class="conversation">
		<x-sub v-for="note in conversation" :key="note.id" :note="note"/>
	</div>
	<div class="reply-to" v-if="p.reply">
		<x-sub :note="p.reply"/>
	</div>
	<div class="renote" v-if="isRenote">
		<p>
			<mk-avatar class="avatar" :user="note.user"/>
			<fa icon="retweet"/>
			<router-link class="name" :href="note.user | userPage">{{ note.user | userName }}</router-link>
			<span>{{ this.$t('reposted-by').substr(0, this.$t('reposted-by').indexOf('{')) }}</span>
			<a class="name" :href="note.user | userPage" v-user-preview="note.userId">{{ note.user | userName }}</a>
			<span>{{ this.$t('reposted-by').substr(this.$t('reposted-by').indexOf('}') + 1) }}</span>
			<mk-time :time="note.createdAt"/>
		</p>
	</div>
	<article>
		<mk-avatar class="avatar" :user="p.user"/>
		<header>
			<router-link class="name" :to="p.user | userPage" v-user-preview="p.user.id">{{ p.user | userName }}</router-link>
			<span class="username"><mk-acct :user="p.user"/></span>
			<router-link class="time" :to="p | notePage">
				<mk-time :time="p.createdAt"/>
			</router-link>
		</header>
		<div class="body">
			<p v-if="p.cw != null" class="cw">
				<span class="text" v-if="p.cw != ''">{{ p.cw }}</span>
				<mk-cw-button v-model="showContent"/>
			</p>
			<div class="content" v-show="p.cw == null || showContent">
				<div class="text">
					<span v-if="p.isHidden" style="opacity: 0.5">{{ $t('private') }}</span>
					<span v-if="p.deletedAt" style="opacity: 0.5">{{ $t('deleted') }}</span>
					<misskey-flavored-markdown v-if="p.text" :text="p.text" :i="$store.state.i" :customEmojis="p.emojis" />
				</div>
				<div class="files" v-if="p.files.length > 0">
					<mk-media-list :media-list="p.files" :raw="true"/>
				</div>
				<mk-poll v-if="p.poll" :note="p"/>
				<mk-url-preview v-for="url in urls" :url="url" :key="url" :detail="true"/>
				<a class="location" v-if="p.geo" :href="`https://maps.google.com/maps?q=${p.geo.coordinates[1]},${p.geo.coordinates[0]}`" target="_blank"><fa icon="map-marker-alt"/> {{ $t('location') }}</a>
				<div class="map" v-if="p.geo" ref="map"></div>
				<div class="renote" v-if="p.renote">
					<mk-note-preview :note="p.renote"/>
				</div>
			</div>
		</div>
		<footer>
			<span class="app" v-if="note.app && $store.state.settings.showVia">via <b>{{ note.app.name }}</b></span>
			<mk-reactions-viewer :note="p"/>
			<button class="replyButton" @click="reply" :title="$t('reply')">
				<template v-if="p.reply"><fa icon="reply-all"/></template>
				<template v-else><fa icon="reply"/></template>
				<p class="count" v-if="p.repliesCount > 0">{{ p.repliesCount }}</p>
			</button>
			<button class="renoteButton" @click="renote" :title="$t('renote')">
				<fa icon="retweet"/><p class="count" v-if="p.renoteCount > 0">{{ p.renoteCount }}</p>
			</button>
			<button class="reactionButton" :class="{ reacted: p.myReaction != null }" @click="react" ref="reactButton" :title="$t('add-reaction')">
				<fa icon="plus"/><p class="count" v-if="p.reactions_count > 0">{{ p.reactions_count }}</p>
			</button>
			<button @click="menu" ref="menuButton">
				<fa icon="ellipsis-h"/>
			</button>
		</footer>
	</article>
	<div class="replies" v-if="!compact">
		<x-sub v-for="note in replies" :key="note.id" :note="note"/>
	</div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import i18n from '../../../i18n';
import parse from '../../../../../mfm/parse';

import MkPostFormWindow from './post-form-window.vue';
import MkRenoteFormWindow from './renote-form-window.vue';
import MkNoteMenu from '../../../common/views/components/note-menu.vue';
import MkReactionPicker from '../../../common/views/components/reaction-picker.vue';
import XSub from './note.sub.vue';
import { sum } from '../../../../../prelude/array';
import noteSubscriber from '../../../common/scripts/note-subscriber';

export default Vue.extend({
	i18n: i18n('desktop/views/components/note-detail.vue'),
	components: {
		XSub
	},

	mixins: [noteSubscriber('note')],

	props: {
		note: {
			type: Object,
			required: true
		},
		compact: {
			default: false
		}
	},

	data() {
		return {
			showContent: false,
			conversation: [],
			conversationFetching: false,
			replies: []
		};
	},

	computed: {
		isRenote(): boolean {
			return (this.note.renote &&
				this.note.text == null &&
				this.note.fileIds.length == 0 &&
				this.note.poll == null);
		},

		p(): any {
			return this.isRenote ? this.note.renote : this.note;
		},

		reactionsCount(): number {
			return this.p.reactionCounts
				? sum(Object.values(this.p.reactionCounts))
				: 0;
		},

		title(): string {
			return new Date(this.p.createdAt).toLocaleString();
		},

		urls(): string[] {
			if (this.p.text) {
				const ast = parse(this.p.text);
				return ast
					.filter(t => (t.type == 'url' || t.type == 'link') && !t.silent)
					.map(t => t.url);
			} else {
				return null;
			}
		}
	},

	mounted() {
		// Get replies
		if (!this.compact) {
			this.$root.api('notes/replies', {
				noteId: this.p.id,
				limit: 8
			}).then(replies => {
				this.replies = replies;
			});
		}

		// Draw map
		if (this.p.geo) {
			const shouldShowMap = this.$store.getters.isSignedIn ? this.$store.state.settings.showMaps : true;
			if (shouldShowMap) {
				this.$root.os.getGoogleMaps().then(maps => {
					const uluru = new maps.LatLng(this.p.geo.coordinates[1], this.p.geo.coordinates[0]);
					const map = new maps.Map(this.$refs.map, {
						center: uluru,
						zoom: 15
					});
					new maps.Marker({
						position: uluru,
						map: map
					});
				});
			}
		}
	},

	methods: {
		fetchConversation() {
			this.conversationFetching = true;

			// Fetch conversation
			this.$root.api('notes/conversation', {
				noteId: this.p.replyId
			}).then(conversation => {
				this.conversationFetching = false;
				this.conversation = conversation.reverse();
			});
		},

		reply() {
			this.$root.new(MkPostFormWindow, {
				reply: this.p
			});
		},

		renote() {
			this.$root.new(MkRenoteFormWindow, {
				note: this.p
			});
		},

		react() {
			this.$root.new(MkReactionPicker, {
				source: this.$refs.reactButton,
				note: this.p
			});
		},

		menu() {
			this.$root.new(MkNoteMenu, {
				source: this.$refs.menuButton,
				note: this.p
			});
		}
	}
});
</script>

<style lang="stylus" scoped>
.mk-note-detail
	overflow hidden
	text-align left
	background var(--face)
	box-shadow var(--shadow)
	border-radius var(--round)

	> .read-more
		display block
		margin 0
		padding 10px 0
		width 100%
		font-size 1em
		text-align center
		color #999
		cursor pointer
		background var(--subNoteBg)
		outline none
		border none
		border-bottom solid 1px var(--faceDivider)
		border-radius var(--round) var(--round) 0 0

		&:hover
			box-shadow 0 0 0 100px inset rgba(0, 0, 0, 0.05)

		&:active
			box-shadow 0 0 0 100px inset rgba(0, 0, 0, 0.1)

		&:disabled
			cursor wait

	> .conversation
		> *
			border-bottom 1px solid var(--faceDivider)

	> .renote
		color var(--renoteText)
		background linear-gradient(to bottom, var(--renoteGradient) 0%, var(--face) 100%)

		> p
			margin 0
			padding 16px 32px

			.avatar
				display inline-block
				width 28px
				height 28px
				margin 0 8px 0 0
				border-radius 6px

			[data-icon]
				margin-right 4px

			.name
				font-weight bold

		& + article
			padding-top 8px

	> .reply-to
		border-bottom 1px solid var(--faceDivider)

	> article
		padding 28px 32px 18px 32px

		&:after
			content ""
			display block
			clear both

		&:hover
			> footer > button
				color var(--noteActionsHighlighted)

		> .avatar
			width 60px
			height 60px
			border-radius 8px

		> header
			position absolute
			top 28px
			left 108px
			width calc(100% - 108px)

			> .name
				display inline-block
				margin 0
				line-height 24px
				color var(--noteHeaderName)
				font-size 18px
				font-weight 700
				text-align left
				text-decoration none

				&:hover
					text-decoration underline

			> .username
				display block
				text-align left
				margin 0
				color var(--noteHeaderAcct)

			> .time
				position absolute
				top 0
				right 32px
				font-size 1em
				color var(--noteHeaderInfo)

		> .body
			padding 8px 0

			> .cw
				cursor default
				display block
				margin 0
				padding 0
				overflow-wrap break-word
				color var(--noteText)

				> .text
					margin-right 8px

			> .content
				> .text
					cursor default
					display block
					margin 0
					padding 0
					overflow-wrap break-word
					font-size 1.5em
					color var(--noteText)

				> .renote
					margin 8px 0

					> *
						padding 16px
						border dashed 1px var(--quoteBorder)
						border-radius 8px

				> .location
					margin 4px 0
					font-size 12px
					color #ccc

				> .map
					width 100%
					height 300px

					&:empty
						display none

				> .mk-url-preview
					margin-top 8px

		> footer
			font-size 1.2em

			> .app
				display block
				font-size 0.8em
				margin-left 0.5em
				color var(--noteHeaderInfo)

			> button
				margin 0 28px 0 0
				padding 8px
				background transparent
				border none
				font-size 1em
				color var(--noteActions)
				cursor pointer

				&:hover
					color var(--noteActionsHover)

				&.replyButton:hover
					color var(--noteActionsReplyHover)

				&.renoteButton:hover
					color var(--noteActionsRenoteHover)

				&.reactionButton:hover
					color var(--noteActionsReactionHover)

				> .count
					display inline
					margin 0 0 0 8px
					color #999

				&.reacted, &.reacted:hover
					color var(--noteActionsReactionHover)

	> .replies
		> *
			border-top 1px solid var(--faceDivider)

</style>
