export * from './tw-screens';
export type Screens = Record<string, number>;
export type ScreenConfig = {
    index: number;
    breakpoint: string;
    maxWidth: number;
};
export type ScreensSortedList = ScreenConfig[];
export type ScreenState = {
    current: ScreenConfig;
} & Record<string, ScreenConfig> & {
    match: (op: '<' | '<=' | '=' | '>=' | '>', breakpoint: string) => boolean;
};
export declare function handleScreens(ss: Screens): ScreensSortedList;
export declare const useResponsive: (ss?: Screens | ScreensSortedList) => ScreenState;
