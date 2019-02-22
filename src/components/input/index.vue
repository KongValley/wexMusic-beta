
<template>
  <div>
    <label class="c-input" :class="labelClass">
      <input placeholder=" " :value="value"
         @change="$emit('change', $event.target.value)"
         @input="$emit('input', $event.target.value)"
         @focus="$emit('focus', $event.target.value)"
         @blur="$emit('blur', $event.target.value)"
      >
      <textarea v-if="type === 'textarea'"></textarea>
      <span>{{label}}</span>
    </label>
  </div>
</template>

<script>
import { oneOfList } from '_u'
export default {
  name: "c_input",
  data() {
    return {};
  },
  props: {
    label: {
      type: String,
      default: '标题'
    },
    type: {
      type: String,
      default: 'input',
      validator:(val)=>oneOfList(val,['input','textarea'])
    },
    value: {
      type: String
    }
  },
  computed: {
    labelClass() {
      return {
        'is-empty': this.value.length === 0
      }
    }
  }
};
</script>

<style lang="scss">
@import "~_s/common/var";
@import "~_s/mixins/mixin";
@include b(input,c) {
  position: relative;
  display: inline-block;
  padding-top: 6px;
  font-size: 18px;
  line-height: 1.5;
  overflow: hidden;
  
  /* Input, Textarea
  -------------------------- */
  & > input,& > textarea {
    width: $--input-content-width;
    height: inherit;
    margin: 0;
    color: $--input-font-color;
    box-sizing: border-box;
    border:$--input-default-border-width $--input-default-border-style $--input-border-color;
    border-radius: $--input-default-border-radius;
    padding: $--input-content-padding;
    box-shadow: none;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    caret-color: $--input-caret-color;
    background-color: transparent;
    transition: border 0.2s, box-shadow 0.2s;
  }

  & > input,
  & > textarea {
    border-top-color: transparent;
  }
  
  /* Span
  -------------------------- */

  & > input + span,
  & > textarea + span {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    border-color: $--input-border-color;
    width: $--input-content-width;
    max-height: 100%;
    color: $--input-font-color;
    font-size: $--input-label-font-size;
    line-height: $--input-label-line-height;
    transition: color 0.2s, font-size 0.2s, line-height 0.2s;
  }

  & > input + span::before,
  & > input + span::after,
  & > textarea + span::before,
  & > textarea + span::after {
    content: "";
    display: block;
    box-sizing: border-box;
    margin-top: 6px;
    border-top: $--input-default-border-width $--input-default-border-style $--input-border-color;
    min-width: 10px;
    height: 8px;
    pointer-events: none;
    box-shadow: inset 0 1px transparent;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  & > input + span::before,
  & > textarea + span::before {
    margin-right: 4px;
    border-left: solid 1px transparent;
    border-radius: $--input-default-border-radius 0;
  }

  & > input + span::after,
  & > textarea + span::after {
    flex-grow: 1;
    margin-left: 4px;
    border-right: solid 1px transparent;
    border-radius: 0 $--input-default-border-radius;
  }

  /* Hover 代替 active
  -------------------------- */

  & > input:hover,
  & > textarea:hover {
    border-color: $--input-active-border-color;
    border-top-color: transparent;
    box-shadow: inset 1px 0 $--input-active-color, inset -1px 0 $--input-active-color, inset 0 -1px $--input-active-color;
    outline: none;
  }

  & > input:hover+ span,
  & > textarea:hover + span {
    color: $--input-active-color;
  }

  & > input:hover + span::before,
  & > input:hover + span::after,
  & > textarea:hover + span::before,
  & > textarea:hover + span::after {
    border-top-color: $--input-active-border-color !important;
    box-shadow: inset 0 1px $--input-active-color;
  }

  @include when(empty) {
    &> input:not(:hover),
    & > textarea:not(:hover) {
      border-top-color: $--input-border-color;
    }

    & > input:not(:hover) + span,
    & > textarea:not(:hover) + span {
      font-size: inherit;
      line-height: $--input-default-active-line-height;
    }

    & > input:not(:hover) + span::before,
    & > textarea:not(:hover) + span::before,
    & > input:not(:hover)+ span::after,
    & > textarea:not(:hover) + span::after {
      border-top-color: transparent;
    }
  }

}
</style>
