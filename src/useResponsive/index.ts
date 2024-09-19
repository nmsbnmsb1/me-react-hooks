import { useCallback, useEffect, useState } from 'react';
import { TwScreens } from './tw-screens';
// Types
export * from './tw-screens';
export type BreakPoints = Record<string, number>;
export type BreakpointState = { current: string } & Record<string, boolean>;

// Hook
export const useResponsive = (pts: BreakPoints = TwScreens) => {
	// 对传入的pts根据数据从小到大进行排序
	let sorted = Object.entries(pts).sort(([, a], [, b]) => a - b);
	let getBreakpointState = useCallback(() => {
		let clientWidth = 0; // SSR
		if (document) {
			// Cross-browser support as described in:
			// https://stackoverflow.com/questions/1248081
			clientWidth = Math.max(document.documentElement!.clientWidth, window.innerWidth || 0);
			// height = Math.max(document.documentElement!.clientHeight, window.innerHeight || 0);
		}
		//
		let nstate: any = {};
		for (let pt of sorted) {
			let [name, maxWidth] = pt;
			// 如果已有判定
			if (nstate.current) {
				nstate[name] = false;
			} else {
				let inRange = clientWidth <= maxWidth;
				if (inRange) nstate.current = name;
				nstate[name] = true;
			}
		}
		return nstate;
	}, [sorted]);
	//
	let [state, setState] = useState<BreakpointState>(() => getBreakpointState());
	useEffect(() => {
		let onResize = () => {
			const now = getBreakpointState();
			if (now.current !== state.current) {
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
