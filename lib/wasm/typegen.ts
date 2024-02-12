import { readFileSync } from "fs";
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const wasmBuffer: Buffer = readFileSync(`${__dirname}/wasm/json_typegen_wasm_bg.wasm`);

const lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;
const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let WASM_VECTOR_LEN = 0;
let cachegetUint8Memory0: any = null;
let cachegetInt32Memory0: any = null;
let cachedTextEncoder = new lTextEncoder('utf-8');
let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

function getUint8Memory0(wasm: any) {
  if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
    cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachegetUint8Memory0;
}

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
  ? function (arg: any, view: any) {
    return cachedTextEncoder.encodeInto(arg, view);
  }
  : function (arg: any, view: any) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
      read: arg.length,
      written: buf.length
    };
  });

function passStringToWasm0(wasm: any, arg: any, malloc: any, realloc: any) {

  if (realloc === undefined) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr = malloc(buf.length);
    getUint8Memory0(wasm).subarray(ptr, ptr + buf.length).set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr;
  }

  let len = arg.length;
  let ptr = malloc(len);

  const mem = getUint8Memory0(wasm);

  let offset = 0;

  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 0x7F) break;
    mem[ptr + offset] = code;
  }

  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, len = offset + arg.length * 3);
    const view = getUint8Memory0(wasm).subarray(ptr + offset, ptr + len);
    const ret = encodeString(arg, view);

    offset += ret.written;
  }

  WASM_VECTOR_LEN = offset;
  return ptr;
}

function getInt32Memory0(wasm: any) {
  if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
    cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
  }
  return cachegetInt32Memory0;
}

function getStringFromWasm0(wasm: any, ptr: any, len: any) {
  return cachedTextDecoder.decode(getUint8Memory0(wasm).subarray(ptr, ptr + len));
}

export async function init() {
  const wasmCompiled = await WebAssembly.instantiate(wasmBuffer);
  const wasm: any = wasmCompiled.instance.exports;

  return function run(name: string, input: string, options: string) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      var ptr0 = passStringToWasm0(wasm, name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      var len0 = WASM_VECTOR_LEN;
      var ptr1 = passStringToWasm0(wasm, input, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      var len1 = WASM_VECTOR_LEN;
      var ptr2 = passStringToWasm0(wasm, options, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      var len2 = WASM_VECTOR_LEN;
      wasm.run(retptr, ptr0, len0, ptr1, len1, ptr2, len2);
      var r0 = getInt32Memory0(wasm)[retptr / 4 + 0];
      var r1 = getInt32Memory0(wasm)[retptr / 4 + 1];
      return getStringFromWasm0(wasm, r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(r0, r1);
    }
  } 
  
}
