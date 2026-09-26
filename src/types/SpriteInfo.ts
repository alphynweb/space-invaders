export type AnimationType = 'normal' | 'exploding';

export interface SpriteInfoFrame {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface SpriteInfo {
    normal: SpriteInfoFrame[];
    exploding: SpriteInfoFrame[];
}