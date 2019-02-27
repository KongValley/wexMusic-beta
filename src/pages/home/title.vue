<template>
	<div class="c-title">
		<div class="c-title__text">🔥 {{text}}</div>
		<slot></slot>
	</div>
</template>

<script>
export default {
  name: "c_title",
  props: {
    text: String,
    default: ""
  }
}
</script>

<style lang="scss" scoped>
@import "~_s/common/var";
@import "~_s/mixins/mixin";
@include b(title,c) {
	width: 100%;
	border-bottom: 3px solid #2196f3;
	@include e(text) {
		font-size: 20px;
		font-family: 'Robot';
		height: 40px;
		line-height: 40px;
		display: inline-block;
		padding: 0 10px;
		color: #2196f3;
	}
}
</style>