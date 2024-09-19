import { useCallback, useEffect, useState } from 'react';
import { TwScreenSortedList } from './tw-screens';
export * from './tw-screens';
export function handleScreens(ss) {
    return Object.entries(ss)
        .sort(([, a], [, b]) => a - b)
        .map(([breakpoint, maxWidth], index) => ({ index, breakpoint, maxWidth }));
}
export const useResponsive = (ss = TwScreenSortedList) => {
    let sorted = !Array.isArray(ss) ? handleScreens(ss) : ss;
    let getBreakpointState = useCallback(() => {
        let clientWidth = 0;
        if (document) {
            clientWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        }
        let nstate = {};
        for (let c of sorted) {
            nstate[c.breakpoint] = c;
            if (!nstate.current) {
                let inRange = clientWidth <= c.maxWidth;
                if (inRange) {
                    nstate.current = c;
                }
            }
        }
        nstate.match = (op, bp) => {
            let currentIndex = nstate.current.index;
            let targetIndex = nstate[bp].index;
            if (op === '<')
                return currentIndex < targetIndex;
            if (op === '<=')
                return currentIndex <= targetIndex;
            if (op === '=')
                return currentIndex === targetIndex;
            if (op === '>=')
                return currentIndex >= targetIndex;
            if (op === '>')
                return currentIndex > targetIndex;
            return false;
        };
        return nstate;
    }, [sorted]);
    let [state, setState] = useState(() => getBreakpointState());
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
    return state;
};
//# sourceMappingURL=index.js.map