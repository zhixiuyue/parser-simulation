export const mode = {
    simple: {
        text: '默认模式',
        statement: `该模式仅支持教学意义的简单文法，所有非终结符的格式为大写字母（A-Z）或带上标的大写字母（A'-Z'、A''-Z''...）,
        所有终结符为小写字母（a-z）或Greek Symbols（ε,μ...），如需要自定义终结符和非终结符，请切换自定义模式`,
        grammars: [
            "A => A c | A a d | b d | ε",
            `A => A c
                    | A a d
                    | b d
                    | ε`,
            `S => A a | b
                    A => A c | S d | ε`,
            "(Copy ε to input if needed)",
            "(All tokens must be separated by space characters)"
        ],
        examples: [
            "S => S S + | S S * | a",
            "S => 0 S 1 | 0 1",
            "S => + S S | * S S | a",
            "S => S ( S ) S | ε",
            "S => S + S | S S | ( S ) | S * | a",
            "S => ( L ) | a L => L , S | S",
        ],
    },
    custom: {
        text: '自定义模式',
        statement: '该模式支持自定义文法，需要输入自定义终结符和非终结符，请在文法下方输入自定义终结符和非终结符，如不需要自定义，请切换简单模式',
        grammars: [
            'bterm => bterm  bfactor | bterm  a d | b d | ϵ',
            `bterm  => bterm  bfactor
                        | bterm  a d
                        | b d
                        | ϵ`,
            'S => bterm  a | b',
            'bterm  => bterm  bfactor | S d | ϵ',
            "(Copy ε to input if needed)",
            "(All tokens must be separated by space characters)"
        ],
        examples: [
            'bexpr => bexpr or bterm | bterm',
            `bterm => bterm and bfactor
                    | bfactor` ,
            `bfactor => not bfactor | ( bexpr )
                    | true | false`,
        ]
    }
}

// export const analysisItems = [
//     {
//         text: "LL(1)分析表构造",
//         route: '/LL1Table',
//     },
//     {
//         text: "LR(0)分析表构造",
//         route: '/LR0Table',
//         params: { type: 'LR0' }
//     },
//     {
//         text: "SLR(1)分析表构造",
//         route: 'LR0Table',
//         params: { type: 'SLR1' }
//     },
//     {
//         text: "LL(1)预测分析",
//         route: '/LL1Analysis',
//     },
//     {
//         text: "LR(0)模拟分析",
//         route: '/LR0Analysis',
//         params: { type: 'LR0' }
//     },
//     {
//         text: "SLR(1)模拟分析",
//         route: '/LR0Analysis',
//         params: { type: 'SLR1' }
//     },
//     {
//         text: "LR(0)自动机构造",
//         route: '/Automaton',
//     },
// ]

export const LLRoute = [
    {
        text: "文法定义",
        route: '/',
    },
    {
        text: "LL(1)文法判定",
        route: '/LL1Grammar',
    },
    {
        text: "LL(1)分析表构造",
        route: '/LL1Table',
    },
    {
        text: "LL(1)预测分析",
        route: '/LL1Analysis',
    }
]

export const LRRoute = [
    {
        text: "文法定义",
        route: '/',
    },
    {
        text: "LR(0)自动机构造",
        route: '/Automaton',
    },
    {
        text: "LR(0)分析表构造",
        route: '/LR0Table',
        params: { type: 'LR0' }
    },
    {
        text: "LR(0)模拟分析",
        route: '/LR0Analysis',
        params: { type: 'LR0' }
    }
]

export const analysisItems = [
    {
        key: 'LL1',
        text: "LL(1)分析",
        route: LLRoute[1].route,
    },
    {
        key: 'LR0',
        text: "LR(0)分析",
        route: LRRoute[1].route,
    },
]
