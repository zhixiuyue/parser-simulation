export const mode = [{
    text: '默认模式',
    statement: `在该模式下，所有非终结符的格式为大写字母（A-Z）或带上标的大写字母（A'-Z'、A''-Z''...）,
        所有终结符为小写字母（a-z）或Greek Symbols（ε,μ...）`,
    grammars: [
        "A => A c | A a d | b d | ε",
        `A => A c
                    | A a d
                    | b d
                    | ε`,
        `S => A a | b
                    A => A c | S d | ε`,
        "注意",
        "首个文法表达式左边的非终结符将作为文法分析的开始符号",
        "所有token需要用空格分开"
    ],
    examples: [
        "A => A'' | b d A''",
        "A' => c | a d",
        "A'' => A' A'' | ε",
        "注意",
        "首个文法表达式左边的非终结符将作为文法分析的开始符号",
        "所有token需要用空格分开"
    ],
},
{
    text: '自定义模式',
    statement: '该模式下，需要自定义终结符和非终结符',
    grammars: [
        'bterm => bterm  bfactor | bterm  a d | b d | ϵ',
        `bterm  => bterm  bfactor
                        | bterm  a d
                        | b d
                        | ϵ`,
        'S => bterm  a | b',
        'bterm  => bterm  bfactor | S d | ϵ',
        "注意",
        "首个文法表达式左边的非终结符将作为文法分析的开始符号",
        "所有token需要用空格分开"
    ],
    examples: [
        'bexpr => bexpr or bterm | bterm',
        `bterm => bterm and bfactor
                    | bfactor` ,
        `bfactor => not bfactor | ( bexpr )
                    | true | false`,
        "注意",
        "首个文法表达式左边的非终结符将作为文法分析的开始符号",
        "所有token需要用空格分开"
    ]
}
]

export const LLRoute = [
    // {
    //     text: "文法定义",
    //     route: '/',
    // },
    {
        text: "LL(1)文法判定",
        route: '/LL1/LL1Grammar',
    },
    {
        text: "LL(1)分析表构建",
        route: '/LL1/LL1Table',
    },
    {
        text: "LL(1)预测分析",
        route: '/LL1/LL1Analysis',
    }
]

export const LRRoute = [
    // {
    //     text: "文法定义",
    //     route: '/',
    // },
    {
        text: "LR(0)DFA构建",
        route: '/LR0/Automaton',
    },
    {
        text: "LR(0)分析表构建",
        route: '/LR0/LR0Table',
        params: { type: 'LR0' }
    },
    {
        text: "LR(0)模拟分析",
        route: '/LR0/LR0Analysis',
        params: { type: 'LR0' }
    }
]

export const analysisItems = [
    {
        key: 'LL1',
        text: "LL(1)分析",
        route: LLRoute[0].route,
    },
    {
        key: 'LR0',
        text: "LR(0)分析",
        route: LRRoute[0].route,
    },
]
