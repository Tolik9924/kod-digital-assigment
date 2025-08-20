export const classes =(...args: unknown[]): string=>{
    let styles : string = ''
    args.forEach((arg)=>{
    if(!arg) return styles;

    const argType = typeof arg

    if(argType === 'string'){
       styles += ` ${arg}`
    }
    if(Array.isArray(arg)){
        styles += ` ${classes(...arg)}`
    }
    if(argType === 'object'){
        const obj = arg as {[key:string]:unknown};
        Object.keys(obj)
        .filter((key)=>obj[key])
        .forEach((key)=> styles += ` ${key}` )
    }
    })

    return styles
}