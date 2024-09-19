import { useCallback, useEffect, useState } from 'react';
import { TwScreens } from './tw-screens';
export * from './tw-screens';
export const useResponsive = (pts = TwScreens) => {
    let sorted = Object.entries(pts).sort(([, a], [, b]) => a - b);
    let getBreakpointState = useCallback(() => {
        let clientWidth = 0;
        if (document) {
            clientWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        }
        let nstate = {};
        for (let pt of sorted) {
            let [name, maxWidth] = pt;
            if (nstate.current) {
                nstate[name] = false;
            }
            else {
                let inRange = clientWidth <= maxWidth;
                if (inRange)
                    nstate.current = name;
                nstate[name] = true;
            }
        }
        return nstate;
    }, [sorted]);
    let [state, setState] = useState(() => getBreakpointState());
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
    return state;
};
//# sourceMappingURL=index.js.map