import { useCallback, useEffect, useMemo, useState } from 'react';
import { TwScreenSortedList } from './tw-screens';
export * from './tw-screens';
export function handleScreens(ss) {
    return Object.entries(ss)
        .sort(([, a], [, b]) => a - b)
        .map(([breakpoint, maxWidth], index) => ({ index, breakpoint, maxWidth }));
}
export const useResponsive = (ss = TwScreenSortedList) => {
    const sorted = useMemo(() => (!Array.isArray(ss) ? handleScreens(ss) : ss), [ss]);
    const getBreakpointState = useCallback(() => {
        let clientWidth = 0;
        if (document) {
            clientWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        }
        const nstate = {};
        for (const c of sorted) {
            nstate[c.breakpoint] = c;
            if (!nstate.current) {
                const inRange = clientWidth <= c.maxWidth;
                if (inRange) {
                    nstate.current = c;
                }
            }
        }
        if (!nstate.current)
            nstate.current = sorted.at(-1);
        nstate.match = (op, bp) => {
            const currentIndex = nstate.current.index;
            const targetIndex = nstate[bp]?.index;
            if (targetIndex === undefined)
                return false;
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
    const [state, setState] = useState(() => getBreakpointState());
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
    return state;
};
//# sourceMappingURL=index.js.map