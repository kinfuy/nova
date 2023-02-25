import type { ExtractPropTypes } from 'vue';
import type Icon from './IconSvg.vue';

export const iconProps = {
  rotate: Number,
  spin: Boolean,
  size: {
    type: Number,
    default: 16,
  },
  color: String,
};

export type IconProps = ExtractPropTypes<typeof iconProps>;

export type IconInstanceType = InstanceType<typeof Icon>;
