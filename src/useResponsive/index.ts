import { useCallback, useEffect, useState } from 'react';
import { TwScreenSortedList } from './tw-screens';
//
export * from './tw-screens';
// Types
export type Screens = { [breakpoint: string]: number };
export type ScreenConfig = { index: number; breakpoint: string; maxWidth: number };
export type ScreensSortedList = ScreenConfig[];
export type ScreenState = { current: ScreenConfig } & { [breakpoint: string]: ScreenConfig } & {
	match: (op: '<' | '<=' | '=' | '>=' | '>', breakpoint: string) => boolean;
};
//把BreakPoints配置转换成ScreensSortedList
export function handleScreens(ss: Screens): ScreensSortedList {
	return Object.entries(ss)
		.sort(([, a], [, b]) => a - b)
		.map(([breakpoint, maxWidth], index) => ({ index, breakpoint, maxWidth }));
}
// Hook
export const useResponsive = (ss: Screens | ScreensSortedList = TwScreenSortedList) => {
	// 对传入的pts根据数据从小到大进行排序
	let sorted = !Array.isArray(ss) ? handleScreens(ss) : ss;
	let getBreakpointState = useCallback(() => {
		let clientWidth = 0; // SSR
		if (document) {
			// Cross-browser support as described in:
			// https://stackoverflow.com/questions/1248081
			clientWidth = Math.max(document.documentElement!.clientWidth, window.innerWidth || 0);
			// height = Math.max(document.documentElement!.clientHeight, window.innerHeight || 0);
		}
		//
		let nstate: ScreenState = {} as any;
		for (let c of sorted) {
			nstate[c.breakpoint] = c;
			//
			if (!nstate.current) {
				let inRange = clientWidth <= c.maxWidth;
				if (inRange) {
					nstate.current = c;
				}
			}
		}
		nstate.match = (op: string, bp: string) => {
			let currentIndex = nstate.current.index;
			let targetIndex = nstate[bp].index;
			if (op === '<') return currentIndex < targetIndex;
			if (op === '<=') return currentIndex <= targetIndex;
			if (op === '=') return currentIndex === targetIndex;
			if (op === '>=') return currentIndex >= targetIndex;
			if (op === '>') return currentIndex > targetIndex;
			return false;
		};
		return nstate;
	}, [sorted]);
	//
	let [state, setState] = useState<ScreenState>(() => getBreakpointState());
	useEffect(() => {
		let onResize = () => {
			const now = getBreakpointState();
			if (now.current.breakpoint !== state.current.breakpoint) {
				setState(now);
			}
		};
		window.addEventListener('resize', onResize, { passive: true });
		return () => {
			window.removeEventListener('resize', onResize);
		};
	}, [getBreakpointState, state, setState]);
	//
	return state;
};
