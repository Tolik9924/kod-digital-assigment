export const Variant = {
    'primary':'primary',
    'secondary':'secondary',
    'success': 'success',
    'error': 'error',
    'dark':'dark',
    'on-dark':'on-dark'
};

export const Shape = {
    'round' : 'round',
    'square' : 'square'
};

export const Size = {
    'xs':'xs',
    's':'s',
    'm':'m',
    'l':'l',
};

export const BorderRadius = {
    'none': 'none',
    'top': 'top',
    'bottom': 'bottom',
};

export type ElementType = 'h1'|  'h2'|  'h3'|  'h4'|  'h5'|  'h6'|  'p'|  'div'| 'span';
export type SizeType = keyof typeof Size;
export type VariantType = keyof typeof Variant;
export type ShapeType = keyof typeof Shape;
export type BorderRadiusType = keyof typeof BorderRadius;