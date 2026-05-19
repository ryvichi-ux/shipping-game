/**
 * levels.js
 * 100-stage river crossing campaign. Difficulty stars are shown on the level cards.
 */
"use strict";

const LEVELS = [
  {
    id: 1,
    title: "川を渡ろう",
    subtitle: "ブロンズ☆1 入門",
    intro: "2人（父・母）を右岸へ渡そう。相性制約なし。",
    characters: [
      "father",
      "mother"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "bronze",
      count: 1
    },
  },
  {
    id: 2,
    title: "三人旅",
    subtitle: "ブロンズ☆1 入門",
    intro: "3人（父・母・息子A）を右岸へ渡そう。相性制約なし。",
    characters: [
      "father",
      "mother",
      "son1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "bronze",
      count: 1
    },
  },
  {
    id: 3,
    title: "四人家族",
    subtitle: "ブロンズ☆1 入門",
    intro: "4人（父・母・息子A・娘A）を右岸へ渡そう。相性制約なし。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "bronze",
      count: 1
    },
  },
  {
    id: 4,
    title: "娘を守れ",
    subtitle: "ブロンズ☆1 父娘制約",
    intro: "3人（父・母・娘A）を右岸へ渡そう。父娘制約。",
    characters: [
      "father",
      "mother",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: true,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "bronze",
      count: 1
    },
  },
  {
    id: 5,
    title: "息子を守れ",
    subtitle: "ブロンズ☆1 母息子制約",
    intro: "3人（父・母・息子A）を右岸へ渡そう。母息子制約。",
    characters: [
      "father",
      "mother",
      "son1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: true,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "bronze",
      count: 1
    },
  },
  {
    id: 6,
    title: "両方の制約",
    subtitle: "ブロンズ☆1 相性制約",
    intro: "4人（父・母・息子A・娘A）を右岸へ渡そう。父娘制約・母息子制約。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: true,
      motherSon: true,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "bronze",
      count: 1
    },
  },
  {
    id: 7,
    title: "息子が二人",
    subtitle: "ブロンズ☆1 人数増加",
    intro: "4人（父・母・息子A・息子B）を右岸へ渡そう。母息子制約。",
    characters: [
      "father",
      "mother",
      "son1",
      "son2"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: true,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "bronze",
      count: 1
    },
  },
  {
    id: 8,
    title: "娘が二人",
    subtitle: "ブロンズ☆1 人数増加",
    intro: "4人（父・母・娘A・娘B）を右岸へ渡そう。父娘制約。",
    characters: [
      "father",
      "mother",
      "daughter1",
      "daughter2"
    ],
    constraints: {
      fatherDaughter: true,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "bronze",
      count: 1
    },
  },
  {
    id: 9,
    title: "犬がやってきた",
    subtitle: "ブロンズ☆1 召使制約",
    intro: "4人（父・母・召使い・犬）を右岸へ渡そう。犬と召使い制約。",
    characters: [
      "father",
      "mother",
      "maid",
      "dog"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: true
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "bronze",
      count: 1
    },
  },
  {
    id: 10,
    title: "はじめての全制約",
    subtitle: "ブロンズ☆1 まとめ",
    intro: "6人（父・母・息子A・娘A・召使い・犬）を右岸へ渡そう。父娘制約・母息子制約・犬と召使い制約。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1",
      "maid",
      "dog"
    ],
    constraints: {
      fatherDaughter: true,
      motherSon: true,
      dogMaid: true
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "bronze",
      count: 1
    },
  },
  {
    id: 11,
    title: "二人でこぐ船",
    subtitle: "ブロンズ☆2 新ギミック",
    intro: "2人（父・母）を右岸へ渡そう。相性制約なし。船は必ず二人以上。",
    characters: [
      "father",
      "mother"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "bronze",
      count: 2
    },
    rules: {
      noSolo: true
    },
  },
  {
    id: 12,
    title: "帰りは一人だけ",
    subtitle: "ブロンズ☆2 新ギミック",
    intro: "3人（父・母・息子A）を右岸へ渡そう。相性制約なし。左岸へ戻る便は1人まで。",
    characters: [
      "father",
      "mother",
      "son1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "bronze",
      count: 2
    },
    rules: {
      returnCapacity: 1
    },
  },
  {
    id: 13,
    title: "向かい風の川",
    subtitle: "ブロンズ☆2 新ギミック",
    intro: "4人（父・母・息子A・娘A）を右岸へ渡そう。相性制約なし。右岸行きは父が必要。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "bronze",
      count: 2
    },
    rules: {
      outboundRequires: {
        ids: [
          "father"
        ],
        text: "父"
      }
    },
  },
  {
    id: 14,
    title: "夜のランタン",
    subtitle: "ブロンズ☆2 新ギミック",
    intro: "3人（召使い・父・母）を右岸へ渡そう。相性制約なし。すべての便に召使いが必要。夜の川。",
    characters: [
      "maid",
      "father",
      "mother"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "bronze",
      count: 2
    },
    rules: {
      nightMode: true,
      moveRequires: {
        ids: [
          "maid"
        ],
        text: "召使い"
      }
    },
  },
  {
    id: 15,
    title: "壊れそうな船",
    subtitle: "ブロンズ☆2 新ギミック",
    intro: "3人（父・母・息子A）を右岸へ渡そう。相性制約なし。左岸へ戻れるのは1回まで。",
    characters: [
      "father",
      "mother",
      "son1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "bronze",
      count: 2
    },
    rules: {
      maxReturnTrips: 1
    },
  },
  {
    id: 16,
    title: "船内げんか",
    subtitle: "ブロンズ☆2 新ギミック",
    intro: "3人（父・母・息子A）を右岸へ渡そう。相性制約なし。船内で禁止ペアあり。",
    characters: [
      "father",
      "mother",
      "son1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "bronze",
      count: 2
    },
    rules: {
      boatPairBans: [
        [
          "father",
          "son1"
        ]
      ]
    },
  },
  {
    id: 17,
    title: "重さを考えよう",
    subtitle: "ブロンズ☆2 新ギミック",
    intro: "4人（父・母・息子A・娘A）を右岸へ渡そう。相性制約なし。重さ制限4。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 3,
    moveLimit: null,
    difficulty: {
      tier: "bronze",
      count: 2
    },
    rules: {
      weightLimit: 4,
      weights: {
        father: 2,
        mother: 2,
        maid: 1,
        son: 1,
        daughter: 1,
        dog: 1
      }
    },
  },
  {
    id: 18,
    title: "母の帰り道",
    subtitle: "ブロンズ☆2 新ギミック",
    intro: "4人（父・母・息子A・娘A）を右岸へ渡そう。相性制約なし。左岸戻りは母が必要。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "bronze",
      count: 2
    },
    rules: {
      returnRequires: {
        ids: [
          "mother"
        ],
        text: "母"
      }
    },
  },
  {
    id: 19,
    title: "召使いの通行証",
    subtitle: "ブロンズ☆2 新ギミック",
    intro: "4人（父・母・召使い・犬）を右岸へ渡そう。犬と召使い制約。右岸行きは召使いが必要。",
    characters: [
      "father",
      "mother",
      "maid",
      "dog"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: true
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "bronze",
      count: 2
    },
    rules: {
      outboundRequires: {
        ids: [
          "maid"
        ],
        text: "召使い"
      }
    },
  },
  {
    id: 20,
    title: "夜の小舟",
    subtitle: "ブロンズ☆2 まとめ",
    intro: "4人（召使い・父・母・息子A）を右岸へ渡そう。相性制約なし。すべての便に召使いが必要。左岸へ戻る便は1人まで。夜の川。",
    characters: [
      "maid",
      "father",
      "mother",
      "son1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "bronze",
      count: 2
    },
    rules: {
      nightMode: true,
      moveRequires: {
        ids: [
          "maid"
        ],
        text: "召使い"
      },
      returnCapacity: 1
    },
  },
  {
    id: 21,
    title: "帰り一人の基本",
    subtitle: "ブロンズ☆3 応用",
    intro: "4人（父・母・息子A・娘A）を右岸へ渡そう。相性制約なし。左岸へ戻る便は1人まで。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "bronze",
      count: 3
    },
    rules: {
      returnCapacity: 1
    },
  },
  {
    id: 22,
    title: "帰り一人の応用",
    subtitle: "ブロンズ☆3 応用",
    intro: "4人（父・母・息子A・娘A）を右岸へ渡そう。相性制約なし。左岸へ戻る便は1人まで。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "bronze",
      count: 3
    },
    rules: {
      returnCapacity: 1
    },
  },
  {
    id: 23,
    title: "向かい風と息子たち",
    subtitle: "ブロンズ☆3 応用",
    intro: "4人（父・母・息子A・息子B）を右岸へ渡そう。母息子制約。右岸行きは父が必要。",
    characters: [
      "father",
      "mother",
      "son1",
      "son2"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: true,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "bronze",
      count: 3
    },
    rules: {
      outboundRequires: {
        ids: [
          "father"
        ],
        text: "父"
      }
    },
  },
  {
    id: 24,
    title: "夜と犬の番人",
    subtitle: "ブロンズ☆3 応用",
    intro: "4人（父・母・召使い・犬）を右岸へ渡そう。犬と召使い制約。すべての便に召使いが必要。夜の川。",
    characters: [
      "father",
      "mother",
      "maid",
      "dog"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: true
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "bronze",
      count: 3
    },
    rules: {
      nightMode: true,
      moveRequires: {
        ids: [
          "maid"
        ],
        text: "召使い"
      }
    },
  },
  {
    id: 25,
    title: "重さ4の家族船",
    subtitle: "ブロンズ☆3 応用",
    intro: "4人（父・母・息子A・娘A）を右岸へ渡そう。父娘制約・母息子制約。重さ制限4。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: true,
      motherSon: true,
      dogMaid: false
    },
    boatCapacity: 3,
    moveLimit: null,
    difficulty: {
      tier: "bronze",
      count: 3
    },
    rules: {
      weightLimit: 4,
      weights: {
        father: 2,
        mother: 2,
        maid: 1,
        son: 1,
        daughter: 1,
        dog: 1
      }
    },
  },
  {
    id: 26,
    title: "戻れる回数を数えろ",
    subtitle: "ブロンズ☆3 応用",
    intro: "4人（父・母・息子A・娘A）を右岸へ渡そう。相性制約なし。左岸へ戻れるのは2回まで。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 1
    },
    rules: {
      maxReturnTrips: 2
    },
  },
  {
    id: 27,
    title: "兄弟げんかの船",
    subtitle: "ブロンズ☆3 応用",
    intro: "4人（父・母・息子A・息子B）を右岸へ渡そう。相性制約なし。船内で禁止ペアあり。",
    characters: [
      "father",
      "mother",
      "son1",
      "son2"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 1
    },
    rules: {
      boatPairBans: [
        [
          "mother",
          "son"
        ]
      ]
    },
  },
  {
    id: 28,
    title: "父が風を読む",
    subtitle: "ブロンズ☆3 応用",
    intro: "4人（父・母・息子A・娘A）を右岸へ渡そう。相性制約なし。右岸行きは父が必要。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 1
    },
    rules: {
      outboundRequires: {
        ids: [
          "father"
        ],
        text: "父"
      }
    },
  },
  {
    id: 29,
    title: "ランタン家族",
    subtitle: "ブロンズ☆3 応用",
    intro: "4人（召使い・父・母・娘A）を右岸へ渡そう。父娘制約。すべての便に召使いが必要。夜の川。",
    characters: [
      "maid",
      "father",
      "mother",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: true,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 1
    },
    rules: {
      nightMode: true,
      moveRequires: {
        ids: [
          "maid"
        ],
        text: "召使い"
      }
    },
  },
  {
    id: 30,
    title: "壊れそうな家族船",
    subtitle: "ブロンズ☆3 応用",
    intro: "6人（父・母・息子A・息子B・娘A・娘B）を右岸へ渡そう。相性制約なし。左岸へ戻れるのは4回まで。",
    characters: [
      "father",
      "mother",
      "son1",
      "son2",
      "daughter1",
      "daughter2"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 1
    },
    rules: {
      maxReturnTrips: 4
    },
  },
  {
    id: 31,
    title: "父の向かい風隊",
    subtitle: "シルバー☆1 ひらめき",
    intro: "4人（父・母・息子A・娘A）を右岸へ渡そう。相性制約なし。右岸行きは父が必要。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 1
    },
    rules: {
      outboundRequires: {
        ids: [
          "father"
        ],
        text: "父"
      }
    },
  },
  {
    id: 32,
    title: "召使いランタン隊",
    subtitle: "シルバー☆1 ひらめき",
    intro: "5人（召使い・父・母・息子A・娘A）を右岸へ渡そう。相性制約なし。すべての便に召使いが必要。夜の川。",
    characters: [
      "maid",
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 1
    },
    rules: {
      nightMode: true,
      moveRequires: {
        ids: [
          "maid"
        ],
        text: "召使い"
      }
    },
  },
  {
    id: 33,
    title: "重量と犬",
    subtitle: "シルバー☆1 ひらめき",
    intro: "6人（父・母・息子A・娘A・召使い・犬）を右岸へ渡そう。父娘制約・母息子制約・犬と召使い制約。重さ制限4。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1",
      "maid",
      "dog"
    ],
    constraints: {
      fatherDaughter: true,
      motherSon: true,
      dogMaid: true
    },
    boatCapacity: 3,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 1
    },
    rules: {
      weightLimit: 4,
      weights: {
        father: 2,
        mother: 2,
        maid: 1,
        son: 1,
        daughter: 1,
        dog: 1
      }
    },
  },
  {
    id: 34,
    title: "戻り一人の四人家族",
    subtitle: "シルバー☆1 ひらめき",
    intro: "4人（父・母・息子A・娘A）を右岸へ渡そう。相性制約なし。左岸へ戻る便は1人まで。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 1
    },
    rules: {
      returnCapacity: 1
    },
  },
  {
    id: 35,
    title: "壊れそうな六人船",
    subtitle: "シルバー☆1 ひらめき",
    intro: "6人（父・母・息子A・息子B・娘A・娘B）を右岸へ渡そう。相性制約なし。左岸へ戻れるのは4回まで。",
    characters: [
      "father",
      "mother",
      "son1",
      "son2",
      "daughter1",
      "daughter2"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 1
    },
    rules: {
      maxReturnTrips: 4
    },
  },
  {
    id: 36,
    title: "ケンカを避ける船",
    subtitle: "シルバー☆1 ひらめき",
    intro: "6人（父・母・息子A・息子B・娘A・娘B）を右岸へ渡そう。相性制約なし。船内で禁止ペアあり。",
    characters: [
      "father",
      "mother",
      "son1",
      "son2",
      "daughter1",
      "daughter2"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 2
    },
    rules: {
      boatPairBans: [
        [
          "father",
          "son"
        ]
      ]
    },
  },
  {
    id: 37,
    title: "母の帰り道",
    subtitle: "シルバー☆1 ひらめき",
    intro: "4人（父・母・息子A・娘A）を右岸へ渡そう。相性制約なし。左岸戻りは母が必要。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 2
    },
    rules: {
      returnRequires: {
        ids: [
          "mother"
        ],
        text: "母"
      }
    },
  },
  {
    id: 38,
    title: "三人船の油断",
    subtitle: "シルバー☆1 ひらめき",
    intro: "6人（父・母・息子A・息子B・娘A・娘B）を右岸へ渡そう。父娘制約・母息子制約。",
    characters: [
      "father",
      "mother",
      "son1",
      "son2",
      "daughter1",
      "daughter2"
    ],
    constraints: {
      fatherDaughter: true,
      motherSon: true,
      dogMaid: false
    },
    boatCapacity: 3,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 2
    },
  },
  {
    id: 39,
    title: "犬の護衛計画",
    subtitle: "シルバー☆1 ひらめき",
    intro: "5人（父・母・息子A・召使い・犬）を右岸へ渡そう。犬と召使い制約。左岸へ戻る便は1人まで。",
    characters: [
      "father",
      "mother",
      "son1",
      "maid",
      "dog"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: true
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 2
    },
    rules: {
      returnCapacity: 1
    },
  },
  {
    id: 40,
    title: "父の向かい風",
    subtitle: "シルバー☆1 ひらめき",
    intro: "4人（父・母・息子A・娘A）を右岸へ渡そう。相性制約なし。右岸行きは父が必要。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 2
    },
    rules: {
      outboundRequires: {
        ids: [
          "father"
        ],
        text: "父"
      }
    },
  },
  {
    id: 41,
    title: "月明かりのランタン",
    subtitle: "シルバー☆2 変化球",
    intro: "5人（召使い・父・母・息子A・娘A）を右岸へ渡そう。相性制約なし。すべての便に召使いが必要。夜の川。",
    characters: [
      "maid",
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 2
    },
    rules: {
      nightMode: true,
      moveRequires: {
        ids: [
          "maid"
        ],
        text: "召使い"
      }
    },
  },
  {
    id: 42,
    title: "重い親たち",
    subtitle: "シルバー☆2 変化球",
    intro: "7人（父・母・息子A・息子B・娘A・娘B・召使い）を右岸へ渡そう。父娘制約・母息子制約。重さ制限4。",
    characters: [
      "father",
      "mother",
      "son1",
      "son2",
      "daughter1",
      "daughter2",
      "maid"
    ],
    constraints: {
      fatherDaughter: true,
      motherSon: true,
      dogMaid: false
    },
    boatCapacity: 3,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 2
    },
    rules: {
      weightLimit: 4,
      weights: {
        father: 2,
        mother: 2,
        maid: 1,
        son: 1,
        daughter: 1,
        dog: 1
      }
    },
  },
  {
    id: 43,
    title: "父だけが風を切る",
    subtitle: "シルバー☆2 変化球",
    intro: "4人（父・母・息子A・娘A）を右岸へ渡そう。相性制約なし。右岸行きは父が必要。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 2
    },
    rules: {
      outboundRequires: {
        ids: [
          "father"
        ],
        text: "父"
      }
    },
  },
  {
    id: 44,
    title: "戻り一人の全制約",
    subtitle: "シルバー☆2 変化球",
    intro: "6人（父・母・息子A・娘A・召使い・犬）を右岸へ渡そう。父娘制約・母息子制約・犬と召使い制約。左岸へ戻る便は1人まで。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1",
      "maid",
      "dog"
    ],
    constraints: {
      fatherDaughter: true,
      motherSon: true,
      dogMaid: true
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 2
    },
    rules: {
      returnCapacity: 1
    },
  },
  {
    id: 45,
    title: "壊れそうな大家族船",
    subtitle: "シルバー☆2 変化球",
    intro: "6人（父・母・息子A・息子B・娘A・娘B）を右岸へ渡そう。相性制約なし。左岸へ戻れるのは4回まで。",
    characters: [
      "father",
      "mother",
      "son1",
      "son2",
      "daughter1",
      "daughter2"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 2
    },
    rules: {
      maxReturnTrips: 4
    },
  },
  {
    id: 46,
    title: "父の通行証",
    subtitle: "シルバー☆2 変化球",
    intro: "4人（父・母・息子A・娘A）を右岸へ渡そう。相性制約なし。右岸行きは父が必要。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 2
    },
    rules: {
      outboundRequires: {
        ids: [
          "father"
        ],
        text: "父"
      }
    },
  },
  {
    id: 47,
    title: "船内の火花",
    subtitle: "シルバー☆2 変化球",
    intro: "7人（父・母・息子A・息子B・娘A・娘B・召使い）を右岸へ渡そう。父娘制約・母息子制約。船内で禁止ペアあり。",
    characters: [
      "father",
      "mother",
      "son1",
      "son2",
      "daughter1",
      "daughter2",
      "maid"
    ],
    constraints: {
      fatherDaughter: true,
      motherSon: true,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 2
    },
    rules: {
      boatPairBans: [
        [
          "father",
          "daughter"
        ]
      ]
    },
  },
  {
    id: 48,
    title: "母だけの帰港",
    subtitle: "シルバー☆2 変化球",
    intro: "4人（父・母・息子A・娘A）を右岸へ渡そう。相性制約なし。左岸戻りは母が必要。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 2
    },
    rules: {
      returnRequires: {
        ids: [
          "mother"
        ],
        text: "母"
      }
    },
  },
  {
    id: 49,
    title: "二人以上の約束",
    subtitle: "シルバー☆2 変化球",
    intro: "4人（父・母・息子A・娘A）を右岸へ渡そう。父娘制約・母息子制約。船は必ず二人以上。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: true,
      motherSon: true,
      dogMaid: false
    },
    boatCapacity: 3,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 2
    },
    rules: {
      noSolo: true
    },
  },
  {
    id: 50,
    title: "夜風の父",
    subtitle: "シルバー☆2 変化球",
    intro: "4人（父・母・息子A・娘A）を右岸へ渡そう。相性制約なし。右岸行きは父が必要。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 2
    },
    rules: {
      outboundRequires: {
        ids: [
          "father"
        ],
        text: "父"
      }
    },
  },
  {
    id: 51,
    title: "重さと帰り道",
    subtitle: "シルバー☆2 変化球",
    intro: "4人（父・母・息子A・娘A）を右岸へ渡そう。父娘制約・母息子制約。左岸へ戻る便は1人まで。重さ制限4。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: true,
      motherSon: true,
      dogMaid: false
    },
    boatCapacity: 3,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 2
    },
    rules: {
      weightLimit: 4,
      weights: {
        father: 2,
        mother: 2,
        maid: 1,
        son: 1,
        daughter: 1,
        dog: 1
      },
      returnCapacity: 1
    },
  },
  {
    id: 52,
    title: "召使いの帰港",
    subtitle: "シルバー☆2 変化球",
    intro: "5人（召使い・父・母・息子A・娘A）を右岸へ渡そう。相性制約なし。左岸戻りは召使いが必要。",
    characters: [
      "maid",
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 2
    },
    rules: {
      returnRequires: {
        ids: [
          "maid"
        ],
        text: "召使い"
      }
    },
  },
  {
    id: 53,
    title: "子ども4人の風",
    subtitle: "シルバー☆2 変化球",
    intro: "6人（父・母・息子A・息子B・娘A・娘B）を右岸へ渡そう。相性制約なし。右岸行きは父が必要。",
    characters: [
      "father",
      "mother",
      "son1",
      "son2",
      "daughter1",
      "daughter2"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 2
    },
    rules: {
      outboundRequires: {
        ids: [
          "father"
        ],
        text: "父"
      }
    },
  },
  {
    id: 54,
    title: "3人船の犬番",
    subtitle: "シルバー☆2 変化球",
    intro: "6人（父・母・息子A・娘A・召使い・犬）を右岸へ渡そう。父娘制約・母息子制約・犬と召使い制約。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1",
      "maid",
      "dog"
    ],
    constraints: {
      fatherDaughter: true,
      motherSon: true,
      dogMaid: true
    },
    boatCapacity: 3,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 2
    },
  },
  {
    id: 55,
    title: "父息子げんか船",
    subtitle: "シルバー☆2 変化球",
    intro: "4人（父・母・息子A・娘A）を右岸へ渡そう。相性制約なし。船内で禁止ペアあり。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 2
    },
    rules: {
      boatPairBans: [
        [
          "father",
          "son"
        ]
      ]
    },
  },
  {
    id: 56,
    title: "暗い川の大家族",
    subtitle: "シルバー☆3 熟考",
    intro: "7人（父・母・息子A・息子B・娘A・娘B・召使い）を右岸へ渡そう。父娘制約・母息子制約。すべての便に召使いが必要。夜の川。",
    characters: [
      "father",
      "mother",
      "son1",
      "son2",
      "daughter1",
      "daughter2",
      "maid"
    ],
    constraints: {
      fatherDaughter: true,
      motherSon: true,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 3
    },
    rules: {
      nightMode: true,
      moveRequires: {
        ids: [
          "maid"
        ],
        text: "召使い"
      }
    },
  },
  {
    id: 57,
    title: "重量船と全制約",
    subtitle: "シルバー☆3 熟考",
    intro: "6人（父・母・息子A・娘A・召使い・犬）を右岸へ渡そう。父娘制約・母息子制約・犬と召使い制約。重さ制限4。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1",
      "maid",
      "dog"
    ],
    constraints: {
      fatherDaughter: true,
      motherSon: true,
      dogMaid: true
    },
    boatCapacity: 3,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 3
    },
    rules: {
      weightLimit: 4,
      weights: {
        father: 2,
        mother: 2,
        maid: 1,
        son: 1,
        daughter: 1,
        dog: 1
      }
    },
  },
  {
    id: 58,
    title: "戻り一人の7人",
    subtitle: "シルバー☆3 熟考",
    intro: "7人（父・母・息子A・息子B・娘A・娘B・召使い）を右岸へ渡そう。父娘制約・母息子制約。左岸へ戻る便は1人まで。",
    characters: [
      "father",
      "mother",
      "son1",
      "son2",
      "daughter1",
      "daughter2",
      "maid"
    ],
    constraints: {
      fatherDaughter: true,
      motherSon: true,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 3
    },
    rules: {
      returnCapacity: 1
    },
  },
  {
    id: 59,
    title: "風を読む父",
    subtitle: "シルバー☆3 熟考",
    intro: "4人（父・母・息子A・娘A）を右岸へ渡そう。相性制約なし。右岸行きは父が必要。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 3
    },
    rules: {
      outboundRequires: {
        ids: [
          "father"
        ],
        text: "父"
      }
    },
  },
  {
    id: 60,
    title: "壊れそうな六人船",
    subtitle: "シルバー☆3 熟考",
    intro: "6人（父・母・息子A・息子B・娘A・娘B）を右岸へ渡そう。相性制約なし。左岸へ戻れるのは4回まで。",
    characters: [
      "father",
      "mother",
      "son1",
      "son2",
      "daughter1",
      "daughter2"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 3
    },
    rules: {
      maxReturnTrips: 4
    },
  },
  {
    id: 61,
    title: "母の帰港ルート",
    subtitle: "シルバー☆3 熟考",
    intro: "4人（父・母・息子A・娘A）を右岸へ渡そう。相性制約なし。左岸戻りは母が必要。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 3
    },
    rules: {
      returnRequires: {
        ids: [
          "mother"
        ],
        text: "母"
      }
    },
  },
  {
    id: 62,
    title: "召使いの帰港ルート",
    subtitle: "シルバー☆3 熟考",
    intro: "5人（召使い・父・母・息子A・娘A）を右岸へ渡そう。相性制約なし。左岸戻りは召使いが必要。",
    characters: [
      "maid",
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 3
    },
    rules: {
      returnRequires: {
        ids: [
          "maid"
        ],
        text: "召使い"
      }
    },
  },
  {
    id: 63,
    title: "父娘げんか船",
    subtitle: "シルバー☆3 熟考",
    intro: "4人（父・母・娘A・娘B）を右岸へ渡そう。父娘制約。船内で禁止ペアあり。",
    characters: [
      "father",
      "mother",
      "daughter1",
      "daughter2"
    ],
    constraints: {
      fatherDaughter: true,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 3
    },
    rules: {
      boatPairBans: [
        [
          "father",
          "daughter"
        ]
      ]
    },
  },
  {
    id: 64,
    title: "母息子げんか船",
    subtitle: "シルバー☆3 熟考",
    intro: "4人（父・母・息子A・息子B）を右岸へ渡そう。母息子制約。船内で禁止ペアあり。",
    characters: [
      "father",
      "mother",
      "son1",
      "son2"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: true,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 3
    },
    rules: {
      boatPairBans: [
        [
          "mother",
          "son"
        ]
      ]
    },
  },
  {
    id: 65,
    title: "夜と重さ",
    subtitle: "シルバー☆3 熟考",
    intro: "5人（召使い・父・母・息子A・娘A）を右岸へ渡そう。父娘制約・母息子制約。重さ制限4。夜の川。",
    characters: [
      "maid",
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: true,
      motherSon: true,
      dogMaid: false
    },
    boatCapacity: 3,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 3
    },
    rules: {
      nightMode: true,
      weightLimit: 4,
      weights: {
        father: 2,
        mother: 2,
        maid: 1,
        son: 1,
        daughter: 1,
        dog: 1
      }
    },
  },
  {
    id: 66,
    title: "父風の一手",
    subtitle: "シルバー☆3 熟考",
    intro: "4人（父・母・息子A・娘A）を右岸へ渡そう。相性制約なし。右岸行きは父が必要。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 3
    },
    rules: {
      outboundRequires: {
        ids: [
          "father"
        ],
        text: "父"
      }
    },
  },
  {
    id: 67,
    title: "二人船の誓い",
    subtitle: "シルバー☆3 熟考",
    intro: "4人（父・母・息子A・娘A）を右岸へ渡そう。相性制約なし。船は必ず二人以上。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 3,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 3
    },
    rules: {
      noSolo: true
    },
  },
  {
    id: 68,
    title: "犬と重い親",
    subtitle: "シルバー☆3 熟考",
    intro: "6人（父・母・息子A・娘A・召使い・犬）を右岸へ渡そう。父娘制約・母息子制約・犬と召使い制約。重さ制限4。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1",
      "maid",
      "dog"
    ],
    constraints: {
      fatherDaughter: true,
      motherSon: true,
      dogMaid: true
    },
    boatCapacity: 3,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 3
    },
    rules: {
      weightLimit: 4,
      weights: {
        father: 2,
        mother: 2,
        maid: 1,
        son: 1,
        daughter: 1,
        dog: 1
      }
    },
  },
  {
    id: 69,
    title: "戻り制限の迷路",
    subtitle: "シルバー☆3 熟考",
    intro: "6人（父・母・息子A・娘A・召使い・犬）を右岸へ渡そう。父娘制約・母息子制約・犬と召使い制約。左岸へ戻れるのは4回まで。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1",
      "maid",
      "dog"
    ],
    constraints: {
      fatherDaughter: true,
      motherSon: true,
      dogMaid: true
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 3
    },
    rules: {
      maxReturnTrips: 4
    },
  },
  {
    id: 70,
    title: "父の通行証",
    subtitle: "シルバー☆3 熟考",
    intro: "4人（父・母・息子A・娘A）を右岸へ渡そう。相性制約なし。右岸行きは父が必要。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 3
    },
    rules: {
      outboundRequires: {
        ids: [
          "father"
        ],
        text: "父"
      }
    },
  },
  {
    id: 71,
    title: "大船だけど重い",
    subtitle: "シルバー☆3 熟考",
    intro: "8人（父・母・息子A・息子B・娘A・娘B・召使い・犬）を右岸へ渡そう。父娘制約・母息子制約・犬と召使い制約。重さ制限4。",
    characters: [
      "father",
      "mother",
      "son1",
      "son2",
      "daughter1",
      "daughter2",
      "maid",
      "dog"
    ],
    constraints: {
      fatherDaughter: true,
      motherSon: true,
      dogMaid: true
    },
    boatCapacity: 3,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 3
    },
    rules: {
      weightLimit: 4,
      weights: {
        father: 2,
        mother: 2,
        maid: 1,
        son: 1,
        daughter: 1,
        dog: 1
      }
    },
  },
  {
    id: 72,
    title: "父の風",
    subtitle: "シルバー☆3 熟考",
    intro: "4人（父・母・息子A・娘A）を右岸へ渡そう。相性制約なし。右岸行きは父が必要。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 3
    },
    rules: {
      outboundRequires: {
        ids: [
          "father"
        ],
        text: "父"
      }
    },
  },
  {
    id: 73,
    title: "召使いの往復便",
    subtitle: "シルバー☆3 熟考",
    intro: "5人（召使い・父・母・息子A・娘A）を右岸へ渡そう。相性制約なし。すべての便に召使いが必要。",
    characters: [
      "maid",
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 3
    },
    rules: {
      nightMode: false,
      moveRequires: {
        ids: [
          "maid"
        ],
        text: "召使い"
      }
    },
  },
  {
    id: 74,
    title: "見えない浅瀬",
    subtitle: "シルバー☆3 熟考",
    intro: "6人（父・母・息子A・娘A・召使い・犬）を右岸へ渡そう。父娘制約・母息子制約・犬と召使い制約。左岸へ戻る便は1人まで。夜の川。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1",
      "maid",
      "dog"
    ],
    constraints: {
      fatherDaughter: true,
      motherSon: true,
      dogMaid: true
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 3
    },
    rules: {
      nightMode: true,
      returnCapacity: 1
    },
  },
  {
    id: 75,
    title: "四人の最短路",
    subtitle: "シルバー☆3 熟考",
    intro: "4人（父・母・息子A・娘A）を右岸へ渡そう。相性制約なし。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "silver",
      count: 3
    },
  },
  {
    id: 76,
    title: "月夜のランタン",
    subtitle: "ゴールド☆2 難問",
    intro: "5人（召使い・父・母・息子A・娘A）を右岸へ渡そう。相性制約なし。すべての便に召使いが必要。夜の川。",
    characters: [
      "maid",
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "gold",
      count: 2
    },
    rules: {
      nightMode: true,
      moveRequires: {
        ids: [
          "maid"
        ],
        text: "召使い"
      }
    },
  },
  {
    id: 77,
    title: "重さ制限の大家族",
    subtitle: "ゴールド☆2 難問",
    intro: "8人（父・母・息子A・息子B・娘A・娘B・召使い・犬）を右岸へ渡そう。父娘制約・母息子制約・犬と召使い制約。重さ制限4。",
    characters: [
      "father",
      "mother",
      "son1",
      "son2",
      "daughter1",
      "daughter2",
      "maid",
      "dog"
    ],
    constraints: {
      fatherDaughter: true,
      motherSon: true,
      dogMaid: true
    },
    boatCapacity: 3,
    moveLimit: null,
    difficulty: {
      tier: "gold",
      count: 2
    },
    rules: {
      weightLimit: 4,
      weights: {
        father: 2,
        mother: 2,
        maid: 1,
        son: 1,
        daughter: 1,
        dog: 1
      }
    },
  },
  {
    id: 78,
    title: "帰り一人の試練",
    subtitle: "ゴールド☆2 難問",
    intro: "4人（父・母・息子A・娘A）を右岸へ渡そう。相性制約なし。左岸へ戻る便は1人まで。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "gold",
      count: 2
    },
    rules: {
      returnCapacity: 1
    },
  },
  {
    id: 79,
    title: "向かい風の試練",
    subtitle: "ゴールド☆2 難問",
    intro: "4人（父・母・息子A・娘A）を右岸へ渡そう。相性制約なし。右岸行きは父が必要。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "gold",
      count: 2
    },
    rules: {
      outboundRequires: {
        ids: [
          "father"
        ],
        text: "父"
      }
    },
  },
  {
    id: 80,
    title: "壊れそうな試練船",
    subtitle: "ゴールド☆2 難問",
    intro: "6人（父・母・息子A・息子B・娘A・娘B）を右岸へ渡そう。相性制約なし。左岸へ戻れるのは4回まで。",
    characters: [
      "father",
      "mother",
      "son1",
      "son2",
      "daughter1",
      "daughter2"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "gold",
      count: 2
    },
    rules: {
      maxReturnTrips: 4
    },
  },
  {
    id: 81,
    title: "父の強風",
    subtitle: "ゴールド☆2 難問",
    intro: "4人（父・母・息子A・娘A）を右岸へ渡そう。相性制約なし。右岸行きは父が必要。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "gold",
      count: 2
    },
    rules: {
      outboundRequires: {
        ids: [
          "father"
        ],
        text: "父"
      }
    },
  },
  {
    id: 82,
    title: "月夜の重さ4",
    subtitle: "ゴールド☆2 難問",
    intro: "6人（父・母・息子A・娘A・召使い・犬）を右岸へ渡そう。父娘制約・母息子制約・犬と召使い制約。重さ制限4。夜の川。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1",
      "maid",
      "dog"
    ],
    constraints: {
      fatherDaughter: true,
      motherSon: true,
      dogMaid: true
    },
    boatCapacity: 3,
    moveLimit: null,
    difficulty: {
      tier: "gold",
      count: 2
    },
    rules: {
      nightMode: true,
      weightLimit: 4,
      weights: {
        father: 2,
        mother: 2,
        maid: 1,
        son: 1,
        daughter: 1,
        dog: 1
      }
    },
  },
  {
    id: 83,
    title: "父息子分断線",
    subtitle: "ゴールド☆2 難問",
    intro: "4人（父・母・息子A・娘A）を右岸へ渡そう。相性制約なし。船内で禁止ペアあり。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "gold",
      count: 2
    },
    rules: {
      boatPairBans: [
        [
          "father",
          "son"
        ]
      ]
    },
  },
  {
    id: 84,
    title: "召使いの帰港鍵",
    subtitle: "ゴールド☆2 難問",
    intro: "5人（召使い・父・母・息子A・娘A）を右岸へ渡そう。相性制約なし。左岸戻りは召使いが必要。",
    characters: [
      "maid",
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "gold",
      count: 2
    },
    rules: {
      returnRequires: {
        ids: [
          "maid"
        ],
        text: "召使い"
      }
    },
  },
  {
    id: 85,
    title: "父風の二重奏",
    subtitle: "ゴールド☆2 難問",
    intro: "4人（父・母・息子A・娘A）を右岸へ渡そう。相性制約なし。右岸行きは父が必要。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "gold",
      count: 2
    },
    rules: {
      outboundRequires: {
        ids: [
          "father"
        ],
        text: "父"
      }
    },
  },
  {
    id: 86,
    title: "夜と戻り制限",
    subtitle: "ゴールド☆2 難問",
    intro: "6人（父・母・息子A・娘A・召使い・犬）を右岸へ渡そう。父娘制約・母息子制約・犬と召使い制約。左岸へ戻れるのは4回まで。夜の川。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1",
      "maid",
      "dog"
    ],
    constraints: {
      fatherDaughter: true,
      motherSon: true,
      dogMaid: true
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "gold",
      count: 2
    },
    rules: {
      nightMode: true,
      maxReturnTrips: 4
    },
  },
  {
    id: 87,
    title: "二人以上で大移動",
    subtitle: "ゴールド☆2 難問",
    intro: "6人（父・母・息子A・娘A・召使い・犬）を右岸へ渡そう。父娘制約・母息子制約・犬と召使い制約。船は必ず二人以上。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1",
      "maid",
      "dog"
    ],
    constraints: {
      fatherDaughter: true,
      motherSon: true,
      dogMaid: true
    },
    boatCapacity: 3,
    moveLimit: null,
    difficulty: {
      tier: "gold",
      count: 2
    },
    rules: {
      noSolo: true
    },
  },
  {
    id: 88,
    title: "母の帰港鍵",
    subtitle: "ゴールド☆2 難問",
    intro: "4人（父・母・息子A・娘A）を右岸へ渡そう。相性制約なし。左岸戻りは母が必要。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "gold",
      count: 2
    },
    rules: {
      returnRequires: {
        ids: [
          "mother"
        ],
        text: "母"
      }
    },
  },
  {
    id: 89,
    title: "黄金の予行演習",
    subtitle: "ゴールド☆2 難問",
    intro: "8人（父・母・息子A・息子B・娘A・娘B・召使い・犬）を右岸へ渡そう。父娘制約・母息子制約・犬と召使い制約。",
    characters: [
      "father",
      "mother",
      "son1",
      "son2",
      "daughter1",
      "daughter2",
      "maid",
      "dog"
    ],
    constraints: {
      fatherDaughter: true,
      motherSon: true,
      dogMaid: true
    },
    boatCapacity: 3,
    moveLimit: null,
    difficulty: {
      tier: "gold",
      count: 2
    },
  },
  {
    id: 90,
    title: "金色の入口",
    subtitle: "ゴールド☆3 終盤",
    intro: "8人（父・母・息子A・息子B・娘A・娘B・召使い・犬）を右岸へ渡そう。父娘制約・母息子制約・犬と召使い制約。",
    characters: [
      "father",
      "mother",
      "son1",
      "son2",
      "daughter1",
      "daughter2",
      "maid",
      "dog"
    ],
    constraints: {
      fatherDaughter: true,
      motherSon: true,
      dogMaid: true
    },
    boatCapacity: 3,
    moveLimit: null,
    difficulty: {
      tier: "gold",
      count: 3
    },
  },
  {
    id: 91,
    title: "夜明け前の五人渡し",
    subtitle: "ゴールド☆3 終盤",
    intro: "5人（召使い・父・母・息子A・娘A）を右岸へ渡そう。相性制約なし。すべての便に召使いが必要。夜の川。",
    characters: [
      "maid",
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "gold",
      count: 3
    },
    rules: {
      nightMode: true,
      moveRequires: {
        ids: [
          "maid"
        ],
        text: "召使い"
      }
    },
  },
  {
    id: 92,
    title: "強風六人編成",
    subtitle: "ゴールド☆3 終盤",
    intro: "6人（父・母・息子A・息子B・娘A・娘B）を右岸へ渡そう。相性制約なし。右岸行きは父が必要。",
    characters: [
      "father",
      "mother",
      "son1",
      "son2",
      "daughter1",
      "daughter2"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "gold",
      count: 3
    },
    rules: {
      outboundRequires: {
        ids: [
          "father"
        ],
        text: "父"
      }
    },
  },
  {
    id: 93,
    title: "重さ4の最終船",
    subtitle: "ゴールド☆3 終盤",
    intro: "8人（父・母・息子A・息子B・娘A・娘B・召使い・犬）を右岸へ渡そう。父娘制約・母息子制約・犬と召使い制約。重さ制限4。",
    characters: [
      "father",
      "mother",
      "son1",
      "son2",
      "daughter1",
      "daughter2",
      "maid",
      "dog"
    ],
    constraints: {
      fatherDaughter: true,
      motherSon: true,
      dogMaid: true
    },
    boatCapacity: 3,
    moveLimit: null,
    difficulty: {
      tier: "gold",
      count: 3
    },
    rules: {
      weightLimit: 4,
      weights: {
        father: 2,
        mother: 2,
        maid: 1,
        son: 1,
        daughter: 1,
        dog: 1
      }
    },
  },
  {
    id: 94,
    title: "帰り一人の四人戦",
    subtitle: "ゴールド☆3 終盤",
    intro: "4人（父・母・息子A・娘A）を右岸へ渡そう。相性制約なし。左岸へ戻る便は1人まで。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "gold",
      count: 3
    },
    rules: {
      returnCapacity: 1
    },
  },
  {
    id: 95,
    title: "古典の川渡り",
    subtitle: "ゴールド☆3 本来の難問",
    intro: "8人（父・母・息子A・息子B・娘A・娘B・召使い・犬）を右岸へ渡そう。父娘制約・母息子制約・犬と召使い制約。",
    characters: [
      "father",
      "mother",
      "son1",
      "son2",
      "daughter1",
      "daughter2",
      "maid",
      "dog"
    ],
    constraints: {
      fatherDaughter: true,
      motherSon: true,
      dogMaid: true
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "gold",
      count: 3
    },
  },
  {
    id: 96,
    title: "古典＋壊れそうな船",
    subtitle: "ゴールド☆3 複合",
    intro: "8人（父・母・息子A・息子B・娘A・娘B・召使い・犬）を右岸へ渡そう。父娘制約・母息子制約・犬と召使い制約。左岸へ戻れるのは8回まで。",
    characters: [
      "father",
      "mother",
      "son1",
      "son2",
      "daughter1",
      "daughter2",
      "maid",
      "dog"
    ],
    constraints: {
      fatherDaughter: true,
      motherSon: true,
      dogMaid: true
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "gold",
      count: 3
    },
    rules: {
      maxReturnTrips: 8
    },
  },
  {
    id: 97,
    title: "船内げんかの最終型",
    subtitle: "ゴールド☆3 複合",
    intro: "4人（父・母・息子A・娘A）を右岸へ渡そう。相性制約なし。船内で禁止ペアあり。",
    characters: [
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "gold",
      count: 3
    },
    rules: {
      boatPairBans: [
        [
          "father",
          "son"
        ]
      ]
    },
  },
  {
    id: 98,
    title: "夜ランタンの最終型",
    subtitle: "ゴールド☆3 複合",
    intro: "5人（召使い・父・母・息子A・娘A）を右岸へ渡そう。相性制約なし。すべての便に召使いが必要。夜の川。",
    characters: [
      "maid",
      "father",
      "mother",
      "son1",
      "daughter1"
    ],
    constraints: {
      fatherDaughter: false,
      motherSon: false,
      dogMaid: false
    },
    boatCapacity: 2,
    moveLimit: null,
    difficulty: {
      tier: "gold",
      count: 3
    },
    rules: {
      nightMode: true,
      moveRequires: {
        ids: [
          "maid"
        ],
        text: "召使い"
      }
    },
  },
  {
    id: 99,
    title: "古典＋重さ制限",
    subtitle: "ゴールド☆3 複合",
    intro: "8人（父・母・息子A・息子B・娘A・娘B・召使い・犬）を右岸へ渡そう。父娘制約・母息子制約・犬と召使い制約。重さ制限4。",
    characters: [
      "father",
      "mother",
      "son1",
      "son2",
      "daughter1",
      "daughter2",
      "maid",
      "dog"
    ],
    constraints: {
      fatherDaughter: true,
      motherSon: true,
      dogMaid: true
    },
    boatCapacity: 3,
    moveLimit: null,
    difficulty: {
      tier: "gold",
      count: 3
    },
    rules: {
      weightLimit: 4,
      weights: {
        father: 2,
        mother: 2,
        maid: 1,
        son: 1,
        daughter: 1,
        dog: 1
      }
    },
  },
  {
    id: 100,
    title: "川渡りマスター",
    subtitle: "ゴールド☆3 最終問題",
    intro: "8人（父・母・息子A・息子B・娘A・娘B・召使い・犬）を右岸へ渡そう。父娘制約・母息子制約・犬と召使い制約。すべての便に召使いが必要。重さ制限4。夜の川。",
    characters: [
      "father",
      "mother",
      "son1",
      "son2",
      "daughter1",
      "daughter2",
      "maid",
      "dog"
    ],
    constraints: {
      fatherDaughter: true,
      motherSon: true,
      dogMaid: true
    },
    boatCapacity: 3,
    moveLimit: null,
    difficulty: {
      tier: "gold",
      count: 3
    },
    rules: {
      nightMode: true,
      weightLimit: 4,
      weights: {
        father: 2,
        mother: 2,
        maid: 1,
        son: 1,
        daughter: 1,
        dog: 1
      },
      moveRequires: {
        ids: [
          "maid"
        ],
        text: "召使い"
      }
    },
  },
];
