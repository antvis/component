import type { TagCfg } from '../tag/types';
import type { DisplayObjectConfig, MixAttrs, RectProps } from '../../types';

export type SwitchCfg = {
  x?: number;
  y?: number;
  size?: number;
  style?: MixAttrs<Partial<RectProps>>;
  checked?: boolean;
  disabled?: boolean;
  spacing?: number;
  textSpacing?: number;
  defaultChecked?: boolean;
  checkedChildren?: TagCfg;
  unCheckedChildren?: TagCfg;
  onChange?: (checked: boolean) => void;
  onClick?: (e: Event, checked: boolean) => void;
};

export type SwitchOptions = DisplayObjectConfig<SwitchCfg>;
