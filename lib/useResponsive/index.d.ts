export * from './tw-screens';
export type Screens = {
    [breakpoint: string]: number;
};
export type ScreenConfig = {
    index: number;
    breakpoint: string;
    maxWidth: number;
};
export type ScreensSortedList = ScreenConfig[];
export type ScreenState = {
    current: ScreenConfig;
} & {
    [breakpoint: string]: ScreenConfig;
} & {
    match: (op: '<' | '<=' | '=' | '>=' | '>', breakpoint: string) => boolean;
};
export declare function handleScreens(ss: Screens): ScreensSortedList;
export declare const useResponsive: (ss?: Screens | ScreensSortedList) => ScreenState;
