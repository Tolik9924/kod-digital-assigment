import { classes } from "../../classes/classes"
import styles from './margin.module.scss'

const DEFAULT_CSS = '01';
const MARGIN = {
    '01': '01',
    '02': '02',
    '03': '03',
    '04': '04',
    '05': '05',
    '06': '06',
    '07': '07',
    '08': '08',
    '09': '09',
    '010': '010',
}
type MarginType = keyof typeof MARGIN;
export type MarginProps = {
    margin?: MarginType;
    marginY?: MarginType;
    marginX?: MarginType;
    margintop?: MarginType;
    marginbottom?: MarginType;
    marginright?: MarginType;
    marginleft?: MarginType;
}

export const margin = ({
    margin,
    marginY,
    marginX,
    margintop,
    marginbottom,
    marginright,
    marginleft,
}:MarginProps)=>{
    const curentMarginTop = margintop || marginY || margin;
    const curentMarginBottom = marginbottom || marginY || margin;
    const curentMarginLeft = marginleft || marginX || margin;
    const curentMarginRight = marginright || marginX || margin;
    return classes({
        [styles[`marginTop${MARGIN[curentMarginTop || DEFAULT_CSS]}`]]: !!curentMarginTop,
        [styles[`marginBottom${MARGIN[curentMarginBottom || DEFAULT_CSS]}`]]: !!curentMarginBottom,
        [styles[`marginLeft${MARGIN[curentMarginLeft || DEFAULT_CSS]}`]]:  !!curentMarginLeft,
        [styles[`marginRight${MARGIN[curentMarginRight || DEFAULT_CSS]}`]]: !!curentMarginRight,
    })
}