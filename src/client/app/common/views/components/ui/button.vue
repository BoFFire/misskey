<template>
<component class="dmtdnykelhudezerjlfpbhgovrgnqqgr"
	:is="link ? 'a' : 'button'"
	:class="[styl, { inline, primary }]"
	:type="type"
	@click="$emit('click')"
>
	<slot></slot>
</component>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
	inject: {
		horizonGrouped: {
			default: false
		}
	},
	props: {
		type: {
			type: String,
			required: false
		},
		primary: {
			type: Boolean,
			required: false,
			default: false
		},
		inline: {
			type: Boolean,
			required: false,
			default(): boolean {
				return this.horizonGrouped;
			}
		},
		link: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	data() {
		return {
			styl: 'fill'
		};
	}
});
</script>

<style lang="stylus" scoped>
.dmtdnykelhudezerjlfpbhgovrgnqqgr
	display block
	width 100%
	margin 0
	padding 8px 10px
	text-align center
	font-weight normal
	font-size 16px
	border none
	border-radius 6px
	outline none
	box-shadow none
	text-decoration none
	user-select none

	*
		pointer-events none

	&:focus
		&:after
			content ""
			pointer-events none
			position absolute
			top -5px
			right -5px
			bottom -5px
			left -5px
			border 2px solid var(--primaryAlpha03)
			border-radius 10px

	&:not(.inline) + .dmtdnykelhudezerjlfpbhgovrgnqqgr
		margin-top 16px

	&.inline
		display inline-block
		width auto

	&.primary
		font-weight bold

	&.fill
		color var(--text)
		background var(--buttonBg)

		&:hover
			background var(--buttonHoverBg)

		&:active
			background var(--buttonActiveBg)

		&.primary
			color var(--primaryForeground)
			background var(--primary)

			&:hover
				background var(--primaryLighten5)

			&:active
				background var(--primaryDarken5)

	&:not(.fill)
		color var(--primary)
		background none

		&:hover
			color var(--primaryDarken5)

		&:active
			background var(--primaryAlpha03)

</style>
