<template>
<mk-ui>
	<span slot="header"><span style="margin-right:4px;"><fa icon="star"/></span>{{ $t('title') }}</span>

	<main>
		<template v-for="favorite in favorites">
			<mk-note-detail class="post" :note="favorite.note" :key="favorite.note.id"/>
		</template>
		<a v-if="existMore" @click="more">{{ $t('@.load-more') }}</a>
	</main>
</mk-ui>
</template>

<script lang="ts">
import Vue from 'vue';
import i18n from '../../../i18n';
import Progress from '../../../common/scripts/loading';

export default Vue.extend({
	i18n: i18n('mobile/views/pages/favorites.vue'),
	data() {
		return {
			fetching: true,
			favorites: [],
			existMore: false,
			moreFetching: false
		};
	},
	created() {
		this.fetch();
	},
	mounted() {
		document.title = `${this.$root.instanceName} | %i18n:@notifications%`;
	},
	methods: {
		fetch() {
			Progress.start();
			this.fetching = true;

			this.$root.api('i/favorites', {
				limit: 11
			}).then(favorites => {
				if (favorites.length == 11) {
					this.existMore = true;
					favorites.pop();
				}

				this.favorites = favorites;
				this.fetching = false;

				Progress.done();
			});
		},
		more() {
			this.moreFetching = true;
			this.$root.api('i/favorites', {
				limit: 11,
				untilId: this.favorites[this.favorites.length - 1].id
			}).then(favorites => {
				if (favorites.length == 11) {
					this.existMore = true;
					favorites.pop();
				} else {
					this.existMore = false;
				}

				this.favorites = this.favorites.concat(favorites);
				this.moreFetching = false;
			});
		}
	}
});
</script>

<style lang="stylus" scoped>


main
	width 100%
	max-width 680px
	margin 0 auto
	padding 8px

	> .post
		margin-bottom 8px

	@media (min-width 500px)
		padding 16px

		> .post
			margin-bottom 16px

	@media (min-width 600px)
		padding 32px

</style>
