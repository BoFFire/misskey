<template>
<div class="mkw-post-form">
	<template v-if="props.design == 0">
		<p class="title"><fa icon="pencil-alt"/>{{ $t('title') }}</p>
	</template>
	<textarea :disabled="posting" v-model="text" @keydown="onKeydown" :placeholder="placeholder"></textarea>
	<button @click="post" :disabled="posting">{{ $t('note') }}</button>
</div>
</template>

<script lang="ts">
import define from '../../../common/define-widget';
import i18n from '../../../i18n';

export default define({
	name: 'post-form',
	props: () => ({
		design: 0
	})
}).extend({
	i18n: i18n('desktop/views/widgets/post-form.vue'),
	data() {
		return {
			posting: false,
			text: ''
		};
	},
	computed: {
		placeholder(): string {
			const xs = [
				this.$t('@.note-placeholders.a'),
				this.$t('@.note-placeholders.b'),
				this.$t('@.note-placeholders.c'),
				this.$t('@.note-placeholders.d'),
				this.$t('@.note-placeholders.e'),
				this.$t('@.note-placeholders.f')
			];
			return xs[Math.floor(Math.random() * xs.length)];
		}
	},
	methods: {
		func() {
			if (this.props.design == 1) {
				this.props.design = 0;
			} else {
				this.props.design++;
			}
			this.save();
		},
		onKeydown(e) {
			if ((e.which == 10 || e.which == 13) && (e.ctrlKey || e.metaKey) && !this.posting && this.text) this.post();
		},
		post() {
			this.posting = true;

			this.$root.api('notes/create', {
				text: this.text
			}).then(data => {
				this.clear();
			}).catch(err => {
				alert('Something happened');
			}).then(() => {
				this.posting = false;
			});
		},
		clear() {
			this.text = '';
		}
	}
});
</script>

<style lang="stylus" scoped>


.mkw-post-form
	background #fff
	overflow hidden
	border solid 1px rgba(#000, 0.075)
	border-radius 6px

	> .title
		z-index 1
		margin 0
		padding 0 16px
		line-height 42px
		font-size 0.9em
		font-weight bold
		color #888
		box-shadow 0 1px rgba(#000, 0.07)

		> [data-icon]
			margin-right 4px

	> textarea
		display block
		width 100%
		max-width 100%
		min-width 100%
		padding 16px
		margin-bottom 28px + 16px
		border none
		border-bottom solid 1px #eee

	> button
		display block
		position absolute
		bottom 8px
		right 8px
		margin 0
		padding 0 10px
		height 28px
		color var(--primaryForeground)
		background var(--primary) !important
		outline none
		border none
		border-radius 4px
		transition background 0.1s ease
		cursor pointer

		&:hover
			background var(--primaryLighten10) !important

		&:active
			background var(--primaryDarken10) !important
			transition background 0s ease

</style>
