import { useCallback, useEffect, useMemo, useState } from 'react';

import { TwScreenSortedList } from './tw-screens';

//
export * from './tw-screens';
// Types
export type Screens = Record<string, number>;
export interface ScreenConfig {
	index: number;
	breakpoint: string;
	maxWidth: number;
}
export type ScreensSortedList = ScreenConfig[];
export type ScreenState = { current: ScreenConfig } & Record<string, ScreenConfig> & {
		match: (op: '<' | '<=' | '=' | '>=' | '>', breakpoint: string) => boolean;
	};
// 把BreakPoints配置转换成ScreensSortedList
export function handleScreens(ss: Screens): ScreensSortedList {
	return Object.entries(ss)
		.sort(([, a], [, b]) => a - b)
		.map(([breakpoint, maxWidth], index) => ({ index, breakpoint, maxWidth }));
}
// Hook
export const useResponsive = (ss: Screens | ScreensSortedList = TwScreenSortedList) => {
	// 对传入的pts根据数据从小到大进行排序
	const sorted = useMemo(() => (!Array.isArray(ss) ? handleScreens(ss) : ss), [ss]);
	const getBreakpointState = useCallback(() => {
		let clientWidth = 0; // SSR
		if (document) {
			// Cross-browser support as described in:
			// https://stackoverflow.com/questions/1248081
			clientWidth = Math.max(document.documentElement!.clientWidth, window.innerWidth || 0);
			// height = Math.max(document.documentElement!.clientHeight, window.innerHeight || 0);
		}
		//
		const nstate: ScreenState = {} as any;
		for (const c of sorted) {
			// 记录断点
			nstate[c.breakpoint] = c;
			// 计算当前所在的断点
			if (!nstate.current) {
				const inRange = clientWidth <= c.maxWidth;
				if (inRange) {
					nstate.current = c;
				}
			}
		}
		if (!nstate.current) nstate.current = sorted.at(-1)!;
		//
		nstate.match = (op: string, bp: string) => {
			const currentIndex = nstate.current.index;
			const targetIndex = nstate[bp]?.index;
			if (targetIndex === undefined) return false;
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
	const [state, setState] = useState<ScreenState>(() => getBreakpointState());
	//biome-ignore lint/correctness/useExhaustiveDependencies: no
	useEffect(() => {
		const onResize = () => {
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
