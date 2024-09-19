export * from './tw-screens';
export type BreakPoints = Record<string, number>;
export type BreakpointState = {
    current: string;
} & Record<string, boolean>;
export declare const useResponsive: (pts?: BreakPoints) => BreakpointState;
