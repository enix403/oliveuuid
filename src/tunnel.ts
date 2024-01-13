import wasmUrl from '@wasmcore/pkg/oliveuuid_bg.wasm?url';
import * as wasmModule from '@wasmcore/pkg';

type ModuleExports = typeof wasmModule;
export type CoreApi = Omit<ModuleExports, 'initSync' | 'default'>;

let init = wasmModule.default;
export let wasmCore: CoreApi = { ...wasmModule };

let _isLoaded = false;

export function isCoreLoaded() {
    return _isLoaded;
}

export async function loadWasmCore(): Promise<void> {
    if (_isLoaded)
        return;

    await init(fetch(wasmUrl));
    _isLoaded = true;
}

// ================================

// import init, { InitOutput } from "@wasmcore/pkg";
// import wasmUrl from '@wasmcore/pkg/oliveuuid_bg.wasm?url';

// function unloaded(...args: any): never {
//     throw new Error("Wasm Core not loaded");
// }

// type CoreFuncs = Omit<InitOutput, 'memory'>;
// type CoreMemoryAccessor = {
//     getAssemblyMemory: () => WebAssembly.Memory
// };

// export type CoreApi = CoreFuncs & CoreMemoryAccessor;

// let noopApi: CoreApi = new Proxy({} as any, {
//     get(target, p, receiver) {
//         return unloaded;
//     },
// });

// export let wasmCore = noopApi;
// let _isLoaded = false;

// export function isCoreLoaded() {
//     return _isLoaded;
// }

// export async function loadWasmCore(): Promise<void> {
//     if (_isLoaded)
//         return;

//     let api = await init(fetch(wasmUrl));
//     _isLoaded = true;

//     let { memory, ...funcs } = api;

//     wasmCore = {
//         getAssemblyMemory: () => memory,
//         ...funcs
//     };
// }
