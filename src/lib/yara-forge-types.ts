
export interface MetaItem {
  id: string;
  key: string;
  value: string | number | boolean;
  type: 'string' | 'integer' | 'boolean';
}

export interface StringModifiers {
    nocase: boolean;
    ascii: boolean;
    wide: boolean;
    fullword: boolean;
    private: boolean;
    xor: {
        enabled: boolean;
        min: number;
        max: number;
    },
    base64: {
        enabled: boolean;
        alphabet: string;
    },
    base64wide: {
        enabled: boolean;
        alphabet: string;
    }
}

export interface StringItem {
  id: string;
  identifier: string;
  type: 'text' | 'hex' | 'regexp';
  value: string;
  modifiers: StringModifiers;
}

export interface YaraXRuleState {
  isGlobal: boolean;
  isPrivate: boolean;
  identifier: string;
  tags: string[];
  meta: MetaItem[];
  strings: StringItem[];
  condition: string;
}

export interface BuilderItem {
    id: 'header' | 'meta' | 'strings' | 'condition';
    type: 'header' | 'meta' | 'strings' | 'condition';
}
