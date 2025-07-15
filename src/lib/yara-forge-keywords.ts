
export interface KeywordItem {
    name: string;
    signature: string;
    description: string;
    insertValue: string;
}

export type YaraFunction = KeywordItem;
export type YaraField = KeywordItem;
export type YaraConstant = KeywordItem;

export interface YaraModule {
    name: string;
    functions?: YaraFunction[];
    fields?: YaraField[];
    constants?: YaraConstant[];
}

export const yaraModules: YaraModule[] = [
    {
        name: "PE Module",
        functions: [
            { name: "exports", signature: "pe.exports('func_name')", description: "Checks if a function is exported.", insertValue: "pe.exports('')" },
            { name: "imports", signature: "pe.imports('dll', 'func')", description: "Checks for a specific imported function.", insertValue: "pe.imports('', '')" },
            { name: "is_dll", signature: "pe.is_dll()", description: "Returns true if the file is a DLL.", insertValue: "pe.is_dll()" },
        ],
        fields: [
            { name: "entry_point", signature: "pe.entry_point", description: "The entry point RVA of the PE.", insertValue: "pe.entry_point" },
            { name: "number_of_sections", signature: "pe.number_of_sections", description: "Number of sections in the PE.", insertValue: "pe.number_of_sections" },
            { name: "machine", signature: "pe.machine", description: "The machine type (e.g., pe.MACHINE_AMD64).", insertValue: "pe.machine" },
        ],
        constants: [
            { name: "MACHINE_AMD64", signature: "pe.MACHINE_AMD64", description: "Constant for AMD64 machine type.", insertValue: "pe.MACHINE_AMD64" },
            { name: "MACHINE_I386", signature: "pe.MACHINE_I386", description: "Constant for I386 machine type.", insertValue: "pe.MACHINE_I386" },
        ]
    },
    {
        name: "ELF Module",
        fields: [
            { name: "entry_point", signature: "elf.entry_point", description: "The entry point address of the ELF.", insertValue: "elf.entry_point" },
            { name: "number_of_sections", signature: "elf.number_of_sections", description: "Number of sections.", insertValue: "elf.number_of_sections" },
        ]
    },
    {
        name: "Math Module",
        functions: [
            { name: "entropy", signature: "math.entropy(offset, size)", description: "Calculates entropy of a data block.", insertValue: "math.entropy(0, filesize)" },
            { name: "monte_carlo_pi", signature: "math.monte_carlo_pi(offset, size)", description: "Calculates PI using Monte Carlo method.", insertValue: "math.monte_carlo_pi(0, filesize)" },
        ]
    },
    {
        name: "Hash Module",
        functions: [
            { name: "md5", signature: "hash.md5(offset, size)", description: "Calculates MD5 hash of a data block.", insertValue: "hash.md5(0, filesize)" },
            { name: "sha256", signature: "hash.sha256(offset, size)", description: "Calculates SHA256 hash of a data block.", insertValue: "hash.sha256(0, filesize)" },
        ]
    },
    {
        name: "DotNet Module",
        fields: [
            { name: "version", signature: "dotnet.version", description: "The runtime version of the .NET assembly.", insertValue: "dotnet.version" },
            { name: "number_of_streams", signature: "dotnet.number_of_streams", description: "Number of streams in the metadata root.", insertValue: "dotnet.number_of_streams" },
        ]
    },
];
