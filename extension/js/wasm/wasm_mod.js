import { SQLite } from './snippets/sqlite-wasm-rs-77a2229985ea0c4a/src/jswasm/sqlite3.js';
import { report_progress } from './snippets/wasm_mod-bc4ca452742d1bb1/src/progress.js';

let wasm;

function logError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        let error = (function () {
            try {
                return e instanceof Error ? `${e.message}\n\nStack:\n${e.stack}` : e.toString();
            } catch(_) {
                return "<failed to stringify thrown value>";
            }
        }());
        console.error("wasm-bindgen: imported JS function that was not marked as `catch` threw an error:", error);
        throw e;
    }
}

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_export_2.set(idx, obj);
    return idx;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

function _assertNum(n) {
    if (typeof(n) !== 'number') throw new Error(`expected a number argument, found ${typeof(n)}`);
}

function _assertBoolean(n) {
    if (typeof(n) !== 'boolean') {
        throw new Error(`expected a boolean argument, found ${typeof(n)}`);
    }
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (typeof(arg) !== 'string') throw new Error(`expected a string argument, found ${typeof(arg)}`);

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

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
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);
        if (ret.read !== arg.length) throw new Error('failed to pass whole string');
        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => {
    wasm.__wbindgen_export_6.get(state.dtor)(state.a, state.b)
});

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_6.get(state.dtor)(a, state.b);
                CLOSURE_DTORS.unregister(state);
            } else {
                state.a = a;
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}
/**
 * A demo function to test if WASM is callable from background.js
 * @returns {Promise<void>}
 */
export function init_wasm() {
    const ret = wasm.init_wasm();
    return ret;
}

/**
 * The main entry point callable from `background.js`.
 * @param {string} msg
 * @returns {Promise<void>}
 */
export function report_state(msg) {
    const ptr0 = passStringToWasm0(msg, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.report_state(ptr0, len0);
    return ret;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_export_2.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function _assertBigInt(n) {
    if (typeof(n) !== 'bigint') throw new Error(`expected a bigint argument, found ${typeof(n)}`);
}
/**
 * Initialize Javascript logging and panic handler
 */
export function solana_program_init() {
    wasm.solana_program_init();
}

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    const mem = getDataViewMemory0();
    for (let i = 0; i < array.length; i++) {
        mem.setUint32(ptr + 4 * i, addToExternrefTable0(array[i]), true);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}
function __wbg_adapter_44(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.closure113_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_47(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.closure117_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_50(arg0, arg1) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hcf28fd4aa5735679(arg0, arg1);
}

function __wbg_adapter_53(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.closure115_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_56(arg0, arg1, arg2, arg3) {
    _assertNum(arg0);
    _assertNum(arg1);
    const ptr0 = passArrayJsValueToWasm0(arg2, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArrayJsValueToWasm0(arg3, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm._dyn_core__ops__function__FnMut__A_B___Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h37795cae6904c7d7(arg0, arg1, ptr0, len0, ptr1, len1);
    return ret;
}

function __wbg_adapter_59(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.closure177_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_315(arg0, arg1, arg2, arg3) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.closure358_externref_shim(arg0, arg1, arg2, arg3);
}

const __wbindgen_enum_BinaryType = ["blob", "arraybuffer"];

const ElGamalKeypairFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_elgamalkeypair_free(ptr >>> 0, 1));
/**
 * A (twisted) ElGamal encryption keypair.
 *
 * The instances of the secret key are zeroized on drop.
 */
export class ElGamalKeypair {

    constructor() {
        throw new Error('cannot invoke `new` directly');
    }

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ElGamalKeypair.prototype);
        obj.__wbg_ptr = ptr;
        ElGamalKeypairFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ElGamalKeypairFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_elgamalkeypair_free(ptr, 0);
    }
    /**
     * Generates the public and secret keys for ElGamal encryption.
     *
     * This function is randomized. It internally samples a scalar element using `OsRng`.
     * @returns {ElGamalKeypair}
     */
    static new_rand() {
        const ret = wasm.elgamalkeypair_new_rand();
        return ElGamalKeypair.__wrap(ret);
    }
    /**
     * @returns {ElGamalPubkey}
     */
    pubkey_owned() {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        const ret = wasm.elgamalkeypair_pubkey_owned(this.__wbg_ptr);
        return ElGamalPubkey.__wrap(ret);
    }
}

const ElGamalPubkeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_elgamalpubkey_free(ptr >>> 0, 1));
/**
 * Public key for the ElGamal encryption scheme.
 */
export class ElGamalPubkey {

    constructor() {
        throw new Error('cannot invoke `new` directly');
    }

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ElGamalPubkey.prototype);
        obj.__wbg_ptr = ptr;
        ElGamalPubkeyFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ElGamalPubkeyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_elgamalpubkey_free(ptr, 0);
    }
}

const HashFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_hash_free(ptr >>> 0, 1));
/**
 * A hash; the 32-byte output of a hashing algorithm.
 *
 * This struct is used most often in `solana-sdk` and related crates to contain
 * a [SHA-256] hash, but may instead contain a [blake3] hash.
 *
 * [SHA-256]: https://en.wikipedia.org/wiki/SHA-2
 * [blake3]: https://github.com/BLAKE3-team/BLAKE3
 */
export class Hash {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Hash.prototype);
        obj.__wbg_ptr = ptr;
        HashFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        HashFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_hash_free(ptr, 0);
    }
    /**
     * Create a new Hash object
     *
     * * `value` - optional hash as a base58 encoded string, `Uint8Array`, `[number]`
     * @param {any} value
     */
    constructor(value) {
        const ret = wasm.hash_constructor(value);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        HashFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Return the base58 string representation of the hash
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
            _assertNum(this.__wbg_ptr);
            const ret = wasm.hash_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Checks if two `Hash`s are equal
     * @param {Hash} other
     * @returns {boolean}
     */
    equals(other) {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        _assertClass(other, Hash);
        if (other.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        const ret = wasm.hash_equals(this.__wbg_ptr, other.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Return the `Uint8Array` representation of the hash
     * @returns {Uint8Array}
     */
    toBytes() {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        const ret = wasm.hash_toBytes(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
}

const InstructionFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_instruction_free(ptr >>> 0, 1));
/**
 * wasm-bindgen version of the Instruction struct.
 * This duplication is required until https://github.com/rustwasm/wasm-bindgen/issues/3671
 * is fixed. This must not diverge from the regular non-wasm Instruction struct.
 */
export class Instruction {

    constructor() {
        throw new Error('cannot invoke `new` directly');
    }

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Instruction.prototype);
        obj.__wbg_ptr = ptr;
        InstructionFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        InstructionFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_instruction_free(ptr, 0);
    }
}

const InstructionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_instructions_free(ptr >>> 0, 1));

export class Instructions {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        InstructionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_instructions_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.instructions_constructor();
        this.__wbg_ptr = ret >>> 0;
        InstructionsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {Instruction} instruction
     */
    push(instruction) {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        _assertClass(instruction, Instruction);
        if (instruction.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        var ptr0 = instruction.__destroy_into_raw();
        wasm.instructions_push(this.__wbg_ptr, ptr0);
    }
}

const KeypairFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_keypair_free(ptr >>> 0, 1));
/**
 * A vanilla Ed25519 key pair
 */
export class Keypair {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Keypair.prototype);
        obj.__wbg_ptr = ptr;
        KeypairFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        KeypairFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_keypair_free(ptr, 0);
    }
    /**
     * Create a new `Keypair `
     */
    constructor() {
        const ret = wasm.keypair_constructor();
        this.__wbg_ptr = ret >>> 0;
        KeypairFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Convert a `Keypair` to a `Uint8Array`
     * @returns {Uint8Array}
     */
    toBytes() {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        const ret = wasm.keypair_toBytes(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    /**
     * Recover a `Keypair` from a `Uint8Array`
     * @param {Uint8Array} bytes
     * @returns {Keypair}
     */
    static fromBytes(bytes) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.keypair_fromBytes(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Keypair.__wrap(ret[0]);
    }
    /**
     * Return the `Pubkey` for this `Keypair`
     * @returns {Pubkey}
     */
    pubkey() {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        const ret = wasm.keypair_pubkey(this.__wbg_ptr);
        return Pubkey.__wrap(ret);
    }
}

const MessageFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_message_free(ptr >>> 0, 1));
/**
 * wasm-bindgen version of the Message struct.
 * This duplication is required until https://github.com/rustwasm/wasm-bindgen/issues/3671
 * is fixed. This must not diverge from the regular non-wasm Message struct.
 */
export class Message {

    constructor() {
        throw new Error('cannot invoke `new` directly');
    }

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Message.prototype);
        obj.__wbg_ptr = ptr;
        MessageFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MessageFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_message_free(ptr, 0);
    }
    /**
     * The id of a recent ledger entry.
     * @returns {Hash}
     */
    get recent_blockhash() {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        const ret = wasm.__wbg_get_message_recent_blockhash(this.__wbg_ptr);
        return Hash.__wrap(ret);
    }
    /**
     * The id of a recent ledger entry.
     * @param {Hash} arg0
     */
    set recent_blockhash(arg0) {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        _assertClass(arg0, Hash);
        if (arg0.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_message_recent_blockhash(this.__wbg_ptr, ptr0);
    }
}

const PodElGamalPubkeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_podelgamalpubkey_free(ptr >>> 0, 1));
/**
 * The `ElGamalPubkey` type as a `Pod`.
 */
export class PodElGamalPubkey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(PodElGamalPubkey.prototype);
        obj.__wbg_ptr = ptr;
        PodElGamalPubkeyFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PodElGamalPubkeyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_podelgamalpubkey_free(ptr, 0);
    }
    /**
     * Create a new `PodElGamalPubkey` object
     *
     * * `value` - optional public key as a base64 encoded string, `Uint8Array`, `[number]`
     * @param {any} value
     */
    constructor(value) {
        const ret = wasm.podelgamalpubkey_constructor(value);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        PodElGamalPubkeyFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Return the base64 string representation of the public key
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
            _assertNum(this.__wbg_ptr);
            const ret = wasm.podelgamalpubkey_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Checks if two `ElGamalPubkey`s are equal
     * @param {PodElGamalPubkey} other
     * @returns {boolean}
     */
    equals(other) {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        _assertClass(other, PodElGamalPubkey);
        if (other.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        const ret = wasm.podelgamalpubkey_equals(this.__wbg_ptr, other.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Return the `Uint8Array` representation of the public key
     * @returns {Uint8Array}
     */
    toBytes() {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        const ret = wasm.podelgamalpubkey_toBytes(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    /**
     * @param {ElGamalPubkey} decoded
     * @returns {PodElGamalPubkey}
     */
    static compressed(decoded) {
        _assertClass(decoded, ElGamalPubkey);
        if (decoded.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        const ret = wasm.podelgamalpubkey_compressed(decoded.__wbg_ptr);
        return PodElGamalPubkey.__wrap(ret);
    }
    /**
     * @returns {ElGamalPubkey}
     */
    decompressed() {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        const ret = wasm.podelgamalpubkey_decompressed(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ElGamalPubkey.__wrap(ret[0]);
    }
}

const PubkeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_pubkey_free(ptr >>> 0, 1));
/**
 * The address of a [Solana account][acc].
 *
 * Some account addresses are [ed25519] public keys, with corresponding secret
 * keys that are managed off-chain. Often, though, account addresses do not
 * have corresponding secret keys &mdash; as with [_program derived
 * addresses_][pdas] &mdash; or the secret key is not relevant to the operation
 * of a program, and may have even been disposed of. As running Solana programs
 * can not safely create or manage secret keys, the full [`Keypair`] is not
 * defined in `solana-program` but in `solana-sdk`.
 *
 * [acc]: https://solana.com/docs/core/accounts
 * [ed25519]: https://ed25519.cr.yp.to/
 * [pdas]: https://solana.com/docs/core/cpi#program-derived-addresses
 * [`Keypair`]: https://docs.rs/solana-sdk/latest/solana_sdk/signer/keypair/struct.Keypair.html
 */
export class Pubkey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Pubkey.prototype);
        obj.__wbg_ptr = ptr;
        PubkeyFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PubkeyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_pubkey_free(ptr, 0);
    }
    /**
     * Create a new Pubkey object
     *
     * * `value` - optional public key as a base58 encoded string, `Uint8Array`, `[number]`
     * @param {any} value
     */
    constructor(value) {
        const ret = wasm.pubkey_constructor(value);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        PubkeyFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Return the base58 string representation of the public key
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
            _assertNum(this.__wbg_ptr);
            const ret = wasm.pubkey_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Check if a `Pubkey` is on the ed25519 curve.
     * @returns {boolean}
     */
    isOnCurve() {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        const ret = wasm.pubkey_isOnCurve(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Checks if two `Pubkey`s are equal
     * @param {Pubkey} other
     * @returns {boolean}
     */
    equals(other) {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        _assertClass(other, Pubkey);
        if (other.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        const ret = wasm.pubkey_equals(this.__wbg_ptr, other.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Return the `Uint8Array` representation of the public key
     * @returns {Uint8Array}
     */
    toBytes() {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        const ret = wasm.pubkey_toBytes(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    /**
     * Derive a Pubkey from another Pubkey, string seed, and a program id
     * @param {Pubkey} base
     * @param {string} seed
     * @param {Pubkey} owner
     * @returns {Pubkey}
     */
    static createWithSeed(base, seed, owner) {
        _assertClass(base, Pubkey);
        if (base.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        const ptr0 = passStringToWasm0(seed, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(owner, Pubkey);
        if (owner.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        const ret = wasm.pubkey_createWithSeed(base.__wbg_ptr, ptr0, len0, owner.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Pubkey.__wrap(ret[0]);
    }
    /**
     * Derive a program address from seeds and a program id
     * @param {any[]} seeds
     * @param {Pubkey} program_id
     * @returns {Pubkey}
     */
    static createProgramAddress(seeds, program_id) {
        const ptr0 = passArrayJsValueToWasm0(seeds, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(program_id, Pubkey);
        if (program_id.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        const ret = wasm.pubkey_createProgramAddress(ptr0, len0, program_id.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Pubkey.__wrap(ret[0]);
    }
    /**
     * Find a valid program address
     *
     * Returns:
     * * `[PubKey, number]` - the program address and bump seed
     * @param {any[]} seeds
     * @param {Pubkey} program_id
     * @returns {any}
     */
    static findProgramAddress(seeds, program_id) {
        const ptr0 = passArrayJsValueToWasm0(seeds, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(program_id, Pubkey);
        if (program_id.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        const ret = wasm.pubkey_findProgramAddress(ptr0, len0, program_id.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
}

const SystemInstructionFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_systeminstruction_free(ptr >>> 0, 1));

export class SystemInstruction {

    constructor() {
        throw new Error('cannot invoke `new` directly');
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SystemInstructionFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_systeminstruction_free(ptr, 0);
    }
    /**
     * @param {Pubkey} from_pubkey
     * @param {Pubkey} to_pubkey
     * @param {bigint} lamports
     * @param {bigint} space
     * @param {Pubkey} owner
     * @returns {Instruction}
     */
    static createAccount(from_pubkey, to_pubkey, lamports, space, owner) {
        _assertClass(from_pubkey, Pubkey);
        if (from_pubkey.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        _assertClass(to_pubkey, Pubkey);
        if (to_pubkey.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        _assertBigInt(lamports);
        _assertBigInt(space);
        _assertClass(owner, Pubkey);
        if (owner.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        const ret = wasm.systeminstruction_createAccount(from_pubkey.__wbg_ptr, to_pubkey.__wbg_ptr, lamports, space, owner.__wbg_ptr);
        return Instruction.__wrap(ret);
    }
    /**
     * @param {Pubkey} from_pubkey
     * @param {Pubkey} to_pubkey
     * @param {Pubkey} base
     * @param {string} seed
     * @param {bigint} lamports
     * @param {bigint} space
     * @param {Pubkey} owner
     * @returns {Instruction}
     */
    static createAccountWithSeed(from_pubkey, to_pubkey, base, seed, lamports, space, owner) {
        _assertClass(from_pubkey, Pubkey);
        if (from_pubkey.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        _assertClass(to_pubkey, Pubkey);
        if (to_pubkey.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        _assertClass(base, Pubkey);
        if (base.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        const ptr0 = passStringToWasm0(seed, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        _assertBigInt(lamports);
        _assertBigInt(space);
        _assertClass(owner, Pubkey);
        if (owner.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        const ret = wasm.systeminstruction_createAccountWithSeed(from_pubkey.__wbg_ptr, to_pubkey.__wbg_ptr, base.__wbg_ptr, ptr0, len0, lamports, space, owner.__wbg_ptr);
        return Instruction.__wrap(ret);
    }
    /**
     * @param {Pubkey} pubkey
     * @param {Pubkey} owner
     * @returns {Instruction}
     */
    static assign(pubkey, owner) {
        _assertClass(pubkey, Pubkey);
        if (pubkey.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        _assertClass(owner, Pubkey);
        if (owner.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        const ret = wasm.systeminstruction_assign(pubkey.__wbg_ptr, owner.__wbg_ptr);
        return Instruction.__wrap(ret);
    }
    /**
     * @param {Pubkey} pubkey
     * @param {Pubkey} base
     * @param {string} seed
     * @param {Pubkey} owner
     * @returns {Instruction}
     */
    static assignWithSeed(pubkey, base, seed, owner) {
        _assertClass(pubkey, Pubkey);
        if (pubkey.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        _assertClass(base, Pubkey);
        if (base.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        const ptr0 = passStringToWasm0(seed, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(owner, Pubkey);
        if (owner.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        const ret = wasm.systeminstruction_assignWithSeed(pubkey.__wbg_ptr, base.__wbg_ptr, ptr0, len0, owner.__wbg_ptr);
        return Instruction.__wrap(ret);
    }
    /**
     * @param {Pubkey} from_pubkey
     * @param {Pubkey} to_pubkey
     * @param {bigint} lamports
     * @returns {Instruction}
     */
    static transfer(from_pubkey, to_pubkey, lamports) {
        _assertClass(from_pubkey, Pubkey);
        if (from_pubkey.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        _assertClass(to_pubkey, Pubkey);
        if (to_pubkey.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        _assertBigInt(lamports);
        const ret = wasm.systeminstruction_transfer(from_pubkey.__wbg_ptr, to_pubkey.__wbg_ptr, lamports);
        return Instruction.__wrap(ret);
    }
    /**
     * @param {Pubkey} from_pubkey
     * @param {Pubkey} from_base
     * @param {string} from_seed
     * @param {Pubkey} from_owner
     * @param {Pubkey} to_pubkey
     * @param {bigint} lamports
     * @returns {Instruction}
     */
    static transferWithSeed(from_pubkey, from_base, from_seed, from_owner, to_pubkey, lamports) {
        _assertClass(from_pubkey, Pubkey);
        if (from_pubkey.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        _assertClass(from_base, Pubkey);
        if (from_base.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        const ptr0 = passStringToWasm0(from_seed, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(from_owner, Pubkey);
        if (from_owner.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        _assertClass(to_pubkey, Pubkey);
        if (to_pubkey.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        _assertBigInt(lamports);
        const ret = wasm.systeminstruction_transferWithSeed(from_pubkey.__wbg_ptr, from_base.__wbg_ptr, ptr0, len0, from_owner.__wbg_ptr, to_pubkey.__wbg_ptr, lamports);
        return Instruction.__wrap(ret);
    }
    /**
     * @param {Pubkey} pubkey
     * @param {bigint} space
     * @returns {Instruction}
     */
    static allocate(pubkey, space) {
        _assertClass(pubkey, Pubkey);
        if (pubkey.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        _assertBigInt(space);
        const ret = wasm.systeminstruction_allocate(pubkey.__wbg_ptr, space);
        return Instruction.__wrap(ret);
    }
    /**
     * @param {Pubkey} address
     * @param {Pubkey} base
     * @param {string} seed
     * @param {bigint} space
     * @param {Pubkey} owner
     * @returns {Instruction}
     */
    static allocateWithSeed(address, base, seed, space, owner) {
        _assertClass(address, Pubkey);
        if (address.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        _assertClass(base, Pubkey);
        if (base.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        const ptr0 = passStringToWasm0(seed, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        _assertBigInt(space);
        _assertClass(owner, Pubkey);
        if (owner.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        const ret = wasm.systeminstruction_allocateWithSeed(address.__wbg_ptr, base.__wbg_ptr, ptr0, len0, space, owner.__wbg_ptr);
        return Instruction.__wrap(ret);
    }
    /**
     * @param {Pubkey} from_pubkey
     * @param {Pubkey} nonce_pubkey
     * @param {Pubkey} authority
     * @param {bigint} lamports
     * @returns {Array<any>}
     */
    static createNonceAccount(from_pubkey, nonce_pubkey, authority, lamports) {
        _assertClass(from_pubkey, Pubkey);
        if (from_pubkey.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        _assertClass(nonce_pubkey, Pubkey);
        if (nonce_pubkey.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        _assertClass(authority, Pubkey);
        if (authority.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        _assertBigInt(lamports);
        const ret = wasm.systeminstruction_createNonceAccount(from_pubkey.__wbg_ptr, nonce_pubkey.__wbg_ptr, authority.__wbg_ptr, lamports);
        return ret;
    }
    /**
     * @param {Pubkey} nonce_pubkey
     * @param {Pubkey} authorized_pubkey
     * @returns {Instruction}
     */
    static advanceNonceAccount(nonce_pubkey, authorized_pubkey) {
        _assertClass(nonce_pubkey, Pubkey);
        if (nonce_pubkey.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        _assertClass(authorized_pubkey, Pubkey);
        if (authorized_pubkey.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        const ret = wasm.systeminstruction_advanceNonceAccount(nonce_pubkey.__wbg_ptr, authorized_pubkey.__wbg_ptr);
        return Instruction.__wrap(ret);
    }
    /**
     * @param {Pubkey} nonce_pubkey
     * @param {Pubkey} authorized_pubkey
     * @param {Pubkey} to_pubkey
     * @param {bigint} lamports
     * @returns {Instruction}
     */
    static withdrawNonceAccount(nonce_pubkey, authorized_pubkey, to_pubkey, lamports) {
        _assertClass(nonce_pubkey, Pubkey);
        if (nonce_pubkey.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        _assertClass(authorized_pubkey, Pubkey);
        if (authorized_pubkey.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        _assertClass(to_pubkey, Pubkey);
        if (to_pubkey.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        _assertBigInt(lamports);
        const ret = wasm.systeminstruction_withdrawNonceAccount(nonce_pubkey.__wbg_ptr, authorized_pubkey.__wbg_ptr, to_pubkey.__wbg_ptr, lamports);
        return Instruction.__wrap(ret);
    }
    /**
     * @param {Pubkey} nonce_pubkey
     * @param {Pubkey} authorized_pubkey
     * @param {Pubkey} new_authority
     * @returns {Instruction}
     */
    static authorizeNonceAccount(nonce_pubkey, authorized_pubkey, new_authority) {
        _assertClass(nonce_pubkey, Pubkey);
        if (nonce_pubkey.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        _assertClass(authorized_pubkey, Pubkey);
        if (authorized_pubkey.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        _assertClass(new_authority, Pubkey);
        if (new_authority.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        const ret = wasm.systeminstruction_authorizeNonceAccount(nonce_pubkey.__wbg_ptr, authorized_pubkey.__wbg_ptr, new_authority.__wbg_ptr);
        return Instruction.__wrap(ret);
    }
}

const TransactionFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_transaction_free(ptr >>> 0, 1));
/**
 * wasm-bindgen version of the Transaction struct.
 * This duplication is required until https://github.com/rustwasm/wasm-bindgen/issues/3671
 * is fixed. This must not diverge from the regular non-wasm Transaction struct.
 */
export class Transaction {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Transaction.prototype);
        obj.__wbg_ptr = ptr;
        TransactionFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TransactionFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_transaction_free(ptr, 0);
    }
    /**
     * Create a new `Transaction`
     * @param {Instructions} instructions
     * @param {Pubkey | undefined} [payer]
     */
    constructor(instructions, payer) {
        _assertClass(instructions, Instructions);
        if (instructions.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        var ptr0 = instructions.__destroy_into_raw();
        let ptr1 = 0;
        if (!isLikeNone(payer)) {
            _assertClass(payer, Pubkey);
            if (payer.__wbg_ptr === 0) {
                throw new Error('Attempt to use a moved value');
            }
            ptr1 = payer.__destroy_into_raw();
        }
        const ret = wasm.transaction_constructor(ptr0, ptr1);
        this.__wbg_ptr = ret >>> 0;
        TransactionFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Return a message containing all data that should be signed.
     * @returns {Message}
     */
    message() {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        const ret = wasm.transaction_message(this.__wbg_ptr);
        return Message.__wrap(ret);
    }
    /**
     * Return the serialized message data to sign.
     * @returns {Uint8Array}
     */
    messageData() {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        const ret = wasm.transaction_messageData(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    /**
     * Verify the transaction
     */
    verify() {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        const ret = wasm.transaction_verify(this.__wbg_ptr);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {Keypair} keypair
     * @param {Hash} recent_blockhash
     */
    partialSign(keypair, recent_blockhash) {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        _assertClass(keypair, Keypair);
        if (keypair.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        _assertClass(recent_blockhash, Hash);
        if (recent_blockhash.__wbg_ptr === 0) {
            throw new Error('Attempt to use a moved value');
        }
        wasm.transaction_partialSign(this.__wbg_ptr, keypair.__wbg_ptr, recent_blockhash.__wbg_ptr);
    }
    /**
     * @returns {boolean}
     */
    isSigned() {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        const ret = wasm.transaction_isSigned(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {Uint8Array}
     */
    toBytes() {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        const ret = wasm.transaction_toBytes(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {Transaction}
     */
    static fromBytes(bytes) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.transaction_fromBytes(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Transaction.__wrap(ret[0]);
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_abort_05026c983d86824c = function() { return logError(function (arg0) {
        arg0.abort();
    }, arguments) };
    imports.wbg.__wbg_addEventListener_37872d53aeb4c65a = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.addEventListener(getStringFromWasm0(arg1, arg2), arg3, arg4);
    }, arguments) };
    imports.wbg.__wbg_addEventListener_b9481c2c2cab6047 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        arg0.addEventListener(getStringFromWasm0(arg1, arg2), arg3);
    }, arguments) };
    imports.wbg.__wbg_alloc_155edbddfae82039 = function() { return logError(function (arg0, arg1) {
        const ret = arg0.alloc(arg1 >>> 0);
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_buffer_61b7ce01341d7f88 = function() { return logError(function (arg0) {
        const ret = arg0.buffer;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_buffer_dc5dbfa8d5fb28cf = function() { return logError(function (arg0) {
        const ret = arg0.buffer;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_call_500db948e69c7330 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.call(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_call_b0d8e36992d9900d = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.call(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_capi_5630259892df790e = function() { return logError(function (arg0) {
        const ret = arg0.capi;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_close_4063e1bcbd6d5fe2 = function() { return handleError(function (arg0) {
        arg0.close();
    }, arguments) };
    imports.wbg.__wbg_code_cd82312abb9d9ff9 = function() { return logError(function (arg0) {
        const ret = arg0.code;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_crypto_038798f665f985e2 = function() { return logError(function (arg0) {
        const ret = arg0.crypto;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_crypto_ed58b8e10a292839 = function() { return logError(function (arg0) {
        const ret = arg0.crypto;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_data_4ce8a82394d8b110 = function() { return logError(function (arg0) {
        const ret = arg0.data;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_dealloc_72cea39e69ee4ec9 = function() { return logError(function (arg0, arg1) {
        arg0.dealloc(arg1 >>> 0);
    }, arguments) };
    imports.wbg.__wbg_debug_156ca727dbc3150f = function() { return logError(function (arg0) {
        console.debug(arg0);
    }, arguments) };
    imports.wbg.__wbg_dispatchEvent_391667c727dc7c90 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.dispatchEvent(arg1);
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_done_f22c1561fa919baa = function() { return logError(function (arg0) {
        const ret = arg0.done;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_error_7534b8e9a36f1ab4 = function() { return logError(function (arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    }, arguments) };
    imports.wbg.__wbg_error_fab41a42d22bf2bc = function() { return logError(function (arg0) {
        console.error(arg0);
    }, arguments) };
    imports.wbg.__wbg_fetch_a9bc66c159c18e19 = function() { return logError(function (arg0) {
        const ret = fetch(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getRandomValues_371e7ade8bd92088 = function() { return logError(function (arg0, arg1) {
        arg0.getRandomValues(arg1);
    }, arguments) };
    imports.wbg.__wbg_getRandomValues_7dfe5bd1b67c9ca1 = function() { return logError(function (arg0) {
        const ret = arg0.getRandomValues;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getRandomValues_bcb4912f16000dc4 = function() { return handleError(function (arg0, arg1) {
        arg0.getRandomValues(arg1);
    }, arguments) };
    imports.wbg.__wbg_get_bbccf8970793c087 = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.get(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getwithrefkey_1dc361bd10053bfe = function() { return logError(function (arg0, arg1) {
        const ret = arg0[arg1];
        return ret;
    }, arguments) };
    imports.wbg.__wbg_heap8u_bbe8edbfd32d8d6a = function() { return logError(function (arg0) {
        const ret = arg0.heap8u();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_info_c3044c86ae29faab = function() { return logError(function (arg0) {
        console.info(arg0);
    }, arguments) };
    imports.wbg.__wbg_init_831cea2cc22b28c4 = function() { return handleError(function (arg0) {
        const ret = SQLite.init(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_ArrayBuffer_670ddde44cdb2602 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof ArrayBuffer;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_Error_2b29c5b4afac4e22 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof Error;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_Response_d3453657e10c4300 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof Response;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_Uint8Array_28af5bc19d6acad8 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof Uint8Array;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_Window_d2514c6a7ee7ba60 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof Window;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_WorkerGlobalScope_b32c94246142a6a7 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof WorkerGlobalScope;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instruction_new = function() { return logError(function (arg0) {
        const ret = Instruction.__wrap(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_isArray_1ba11a930108ec51 = function() { return logError(function (arg0) {
        const ret = Array.isArray(arg0);
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_isSafeInteger_12f5549b2fca23f4 = function() { return logError(function (arg0) {
        const ret = Number.isSafeInteger(arg0);
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_iterator_23604bb983791576 = function() { return logError(function () {
        const ret = Symbol.iterator;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_length_65d1cd11729ced11 = function() { return logError(function (arg0) {
        const ret = arg0.length;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_log_464d1b2190ca1e04 = function() { return logError(function (arg0) {
        console.log(arg0);
    }, arguments) };
    imports.wbg.__wbg_log_4bb95dea3d972fd3 = function() { return logError(function (arg0, arg1) {
        console.log(getStringFromWasm0(arg0, arg1));
    }, arguments) };
    imports.wbg.__wbg_message_7bde112094278773 = function() { return logError(function (arg0) {
        const ret = arg0.message;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_msCrypto_0a36e2ec3a343d26 = function() { return logError(function (arg0) {
        const ret = arg0.msCrypto;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_msCrypto_ff35fce085fab2a3 = function() { return logError(function (arg0) {
        const ret = arg0.msCrypto;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_name_ae6b09babb81aa7d = function() { return logError(function (arg0) {
        const ret = arg0.name;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_17f755666e48d1d8 = function() { return handleError(function (arg0, arg1) {
        const ret = new URL(getStringFromWasm0(arg0, arg1));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_254fa9eac11932ae = function() { return logError(function () {
        const ret = new Array();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_35d748855c4620b9 = function() { return handleError(function () {
        const ret = new Headers();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_3d446df9155128ef = function() { return logError(function (arg0, arg1) {
        try {
            var state0 = {a: arg0, b: arg1};
            var cb0 = (arg0, arg1) => {
                const a = state0.a;
                state0.a = 0;
                try {
                    return __wbg_adapter_315(a, state0.b, arg0, arg1);
                } finally {
                    state0.a = a;
                }
            };
            const ret = new Promise(cb0);
            return ret;
        } finally {
            state0.a = state0.b = 0;
        }
    }, arguments) };
    imports.wbg.__wbg_new_3ff5b33b1ce712df = function() { return logError(function (arg0) {
        const ret = new Uint8Array(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_5f48f21d4be11586 = function() { return handleError(function () {
        const ret = new AbortController();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_688846f374351c92 = function() { return logError(function () {
        const ret = new Object();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_71b858a4f974c1db = function() { return logError(function (arg0) {
        const ret = new SQLite(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_8a6f238a6ece86ea = function() { return logError(function () {
        const ret = new Error();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_9b6c38191d7b9512 = function() { return handleError(function (arg0, arg1) {
        const ret = new WebSocket(getStringFromWasm0(arg0, arg1));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_a3eaec3587e1fb84 = function() { return handleError(function () {
        const ret = new URLSearchParams();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_e04dcd3aad5daca2 = function() { return handleError(function (arg0) {
        const ret = new WebAssembly.Memory(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_newnoargs_fd9e4bf8be2bc16d = function() { return logError(function (arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_newwithbyteoffsetandlength_ba35896968751d91 = function() { return logError(function (arg0, arg1, arg2) {
        const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_newwitheventinitdict_8ef7c889b37bf3b0 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = new CloseEvent(getStringFromWasm0(arg0, arg1), arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_newwithlength_34ce8f1051e74449 = function() { return logError(function (arg0) {
        const ret = new Uint8Array(arg0 >>> 0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_newwithlength_759c7b9d6a7a314f = function() { return logError(function (arg0) {
        const ret = new Array(arg0 >>> 0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_newwithstr_6dc08c9fc8762dbd = function() { return handleError(function (arg0, arg1) {
        const ret = new Request(getStringFromWasm0(arg0, arg1));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_newwithstrandinit_a1f6583f20e4faff = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = new Request(getStringFromWasm0(arg0, arg1), arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_next_01dd9234a5bf6d05 = function() { return handleError(function (arg0) {
        const ret = arg0.next();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_next_137428deb98342b0 = function() { return logError(function (arg0) {
        const ret = arg0.next;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_node_02999533c4ea02e3 = function() { return logError(function (arg0) {
        const ret = arg0.node;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_process_5c1d670bc53614b8 = function() { return logError(function (arg0) {
        const ret = arg0.process;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_pubkey_new = function() { return logError(function (arg0) {
        const ret = Pubkey.__wrap(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_push_6edad0df4b546b2c = function() { return logError(function (arg0, arg1) {
        const ret = arg0.push(arg1);
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_queueMicrotask_2181040e064c0dc8 = function() { return logError(function (arg0) {
        queueMicrotask(arg0);
    }, arguments) };
    imports.wbg.__wbg_queueMicrotask_ef9ac43769cbcc4f = function() { return logError(function (arg0) {
        const ret = arg0.queueMicrotask;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_randomFillSync_994ac6d9ade7a695 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.randomFillSync(getArrayU8FromWasm0(arg1, arg2));
    }, arguments) };
    imports.wbg.__wbg_randomFillSync_ab2cfe79ebbf2740 = function() { return handleError(function (arg0, arg1) {
        arg0.randomFillSync(arg1);
    }, arguments) };
    imports.wbg.__wbg_reason_17a506fc63aa299a = function() { return logError(function (arg0, arg1) {
        const ret = arg1.reason;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_removeEventListener_a9ca9f05245321f0 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        arg0.removeEventListener(getStringFromWasm0(arg1, arg2), arg3);
    }, arguments) };
    imports.wbg.__wbg_reportprogress_f596037cfd5dad43 = function() { return logError(function (arg0, arg1) {
        report_progress(getStringFromWasm0(arg0, arg1));
    }, arguments) };
    imports.wbg.__wbg_require_0d6aeaec3c042c88 = function() { return logError(function (arg0, arg1, arg2) {
        const ret = arg0.require(getStringFromWasm0(arg1, arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_require_79b1e9274cde3c87 = function() { return handleError(function () {
        const ret = module.require;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_resolve_0bf7c44d641804f9 = function() { return logError(function (arg0) {
        const ret = Promise.resolve(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_search_a8f6890ada3d686f = function() { return logError(function (arg0, arg1) {
        const ret = arg1.search;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_self_25aabeb5a7b41685 = function() { return handleError(function () {
        const ret = self.self;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_set_1d80752d0d5f0b21 = function() { return logError(function (arg0, arg1, arg2) {
        arg0[arg1 >>> 0] = arg2;
    }, arguments) };
    imports.wbg.__wbg_set_23d69db4e5c66a6e = function() { return logError(function (arg0, arg1, arg2) {
        arg0.set(arg1, arg2 >>> 0);
    }, arguments) };
    imports.wbg.__wbg_set_3f1d0b984ed272ed = function() { return logError(function (arg0, arg1, arg2) {
        arg0[arg1] = arg2;
    }, arguments) };
    imports.wbg.__wbg_set_aa8f7a765a0a2e5f = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.set(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_setbinaryType_3fa4a9e8d2cc506f = function() { return logError(function (arg0, arg1) {
        arg0.binaryType = __wbindgen_enum_BinaryType[arg1];
    }, arguments) };
    imports.wbg.__wbg_setbody_64920df008e48adc = function() { return logError(function (arg0, arg1) {
        arg0.body = arg1;
    }, arguments) };
    imports.wbg.__wbg_setcode_6c2f9e460f442b5b = function() { return logError(function (arg0, arg1) {
        arg0.code = arg1;
    }, arguments) };
    imports.wbg.__wbg_setheaders_4c921e8e226bdfa7 = function() { return logError(function (arg0, arg1) {
        arg0.headers = arg1;
    }, arguments) };
    imports.wbg.__wbg_setmethod_cfc7f688ba46a6be = function() { return logError(function (arg0, arg1, arg2) {
        arg0.method = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_setonce_87cf501e67ee47f7 = function() { return logError(function (arg0, arg1) {
        arg0.once = arg1 !== 0;
    }, arguments) };
    imports.wbg.__wbg_setreason_6ba48376e1afb3d9 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.reason = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_setsearch_420bbd8d2dbd92aa = function() { return logError(function (arg0, arg1, arg2) {
        arg0.search = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_setsignal_f766190d206f09e5 = function() { return logError(function (arg0, arg1) {
        arg0.signal = arg1;
    }, arguments) };
    imports.wbg.__wbg_signal_1fdadeba2d04660e = function() { return logError(function (arg0) {
        const ret = arg0.signal;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_sqlite3_d7961eba5ba919de = function() { return logError(function (arg0) {
        const ret = arg0.sqlite3;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_sqlite3exec_280b816af0199cdd = function() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
        const ret = arg0.sqlite3_exec(arg1 >>> 0, arg2, arg3, arg4 >>> 0, arg5 >>> 0);
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_sqlite3openv2_391117b726893a9b = function() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
        const ret = arg0.sqlite3_open_v2(arg1, arg2 >>> 0, arg3, arg4);
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_stack_0ed75d68575b0f3c = function() { return logError(function (arg0, arg1) {
        const ret = arg1.stack;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_static_accessor_GLOBAL_0be7472e492ad3e3 = function() { return logError(function () {
        const ret = typeof global === 'undefined' ? null : global;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_static_accessor_GLOBAL_THIS_1a6eb482d12c9bfb = function() { return logError(function () {
        const ret = typeof globalThis === 'undefined' ? null : globalThis;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_static_accessor_MODULE_ef3aa2eb251158a5 = function() { return logError(function () {
        const ret = module;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_static_accessor_SELF_1dc398a895c82351 = function() { return logError(function () {
        const ret = typeof self === 'undefined' ? null : self;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_static_accessor_WINDOW_ae1c80c7eea8d64a = function() { return logError(function () {
        const ret = typeof window === 'undefined' ? null : window;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_subarray_46adeb9b86949d12 = function() { return logError(function (arg0, arg1, arg2) {
        const ret = arg0.subarray(arg1 >>> 0, arg2 >>> 0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_text_dfc4cb7631d2eb34 = function() { return handleError(function (arg0) {
        const ret = arg0.text();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_then_0438fad860fe38e1 = function() { return logError(function (arg0, arg1) {
        const ret = arg0.then(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_then_0ffafeddf0e182a4 = function() { return logError(function (arg0, arg1, arg2) {
        const ret = arg0.then(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_toString_a491ccf7be1ca5c9 = function() { return logError(function (arg0) {
        const ret = arg0.toString();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_toString_cbcf95f260c441ae = function() { return logError(function (arg0) {
        const ret = arg0.toString();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_url_0287fc8f8dd185b7 = function() { return logError(function (arg0, arg1) {
        const ret = arg1.url;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_value_4c32fd138a88eee2 = function() { return logError(function (arg0) {
        const ret = arg0.value;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_values_5b2662303e52c392 = function() { return logError(function (arg0) {
        const ret = arg0.values();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_version_0fc9fa765bbaaafd = function() { return logError(function (arg0) {
        const ret = arg0.version();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_versions_c71aa1626a93e0a1 = function() { return logError(function (arg0) {
        const ret = arg0.versions;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_warn_123db6aa8948382e = function() { return logError(function (arg0) {
        console.warn(arg0);
    }, arguments) };
    imports.wbg.__wbg_wasClean_303f938d5142dcca = function() { return logError(function (arg0) {
        const ret = arg0.wasClean;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_wasm_2a3fa6a8510b3f27 = function() { return logError(function (arg0) {
        const ret = arg0.wasm;
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_as_number = function(arg0) {
        const ret = +arg0;
        return ret;
    };
    imports.wbg.__wbindgen_bigint_from_u64 = function(arg0) {
        const ret = BigInt.asUintN(64, arg0);
        return ret;
    };
    imports.wbg.__wbindgen_boolean_get = function(arg0) {
        const v = arg0;
        const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
        _assertNum(ret);
        return ret;
    };
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = arg0.original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        const ret = false;
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper2243 = function() { return logError(function (arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 114, __wbg_adapter_44);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_closure_wrapper2245 = function() { return logError(function (arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 118, __wbg_adapter_47);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_closure_wrapper2247 = function() { return logError(function (arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 112, __wbg_adapter_50);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_closure_wrapper2249 = function() { return logError(function (arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 116, __wbg_adapter_53);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_closure_wrapper2603 = function() { return logError(function (arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 151, __wbg_adapter_56);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_closure_wrapper3125 = function() { return logError(function (arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 178, __wbg_adapter_59);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        const ret = debugString(arg1);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_error_new = function(arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbindgen_in = function(arg0, arg1) {
        const ret = arg0 in arg1;
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_export_2;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
        ;
    };
    imports.wbg.__wbindgen_is_function = function(arg0) {
        const ret = typeof(arg0) === 'function';
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = arg0;
        const ret = typeof(val) === 'object' && val !== null;
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbindgen_is_string = function(arg0) {
        const ret = typeof(arg0) === 'string';
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = arg0 === undefined;
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbindgen_jsval_loose_eq = function(arg0, arg1) {
        const ret = arg0 == arg1;
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbindgen_link_9c2d9a80a50dc8d0 = function() { return logError(function (arg0) {
        const val = `const e=(e,...t)=>postMessage({type:e,payload:t}),t=function(){const t=function(...e){throw new Error(e.join(" "))};globalThis.window===globalThis?t("This code cannot run from the main thread.","Load it as a Worker from a separate Worker."):navigator?.storage?.getDirectory||t("This API requires navigator.storage.getDirectory.");const n=Object.create(null);n.verbose=1;const s={0:console.error.bind(console),1:console.warn.bind(console),2:console.log.bind(console)},a=(e,...t)=>{n.verbose>e&&s[e]("OPFS asyncer:",...t)},i=(...e)=>a(2,...e),o=(...e)=>a(1,...e),r=(...e)=>a(0,...e),c=Object.create(null),l=new Set,d=function(e,t){const n=new URL(e,"file://irrelevant").pathname;return t?n.split("/").filter((e=>!!e)):n},f=async function(e,t=!1){const s=d(e,!0),a=s.pop();let i=n.rootDir;for(const e of s)e&&(i=await i.getDirectoryHandle(e,{create:!!t}));return[i,a]},y=async e=>{if(e.syncHandle){i("Closing sync handle for",e.filenameAbs);const t=e.syncHandle;return delete e.syncHandle,delete e.xLock,l.delete(e.fid),t.close()}},u=async e=>{try{await y(e)}catch(t){o("closeSyncHandleNoThrow() ignoring:",t,e)}},E=async()=>{if(l.size)for(const e of l){const t=c[e];await u(t),i("Auto-unlocked",e,t.filenameAbs)}},b=async e=>{if(e.releaseImplicitLocks&&l.has(e.fid))return u(e)};class O extends Error{constructor(e,...t){super([...t,": "+e.name+":",e.message].join(" "),{cause:e}),this.name="GetSyncHandleError"}}O.convertRc=(e,t)=>{if(e instanceof O){if("NoModificationAllowedError"===e.cause.name||"DOMException"===e.cause.name&&0===e.cause.message.indexOf("Access Handles cannot"))return n.sq3Codes.SQLITE_BUSY;if("NotFoundError"===e.cause.name)return n.sq3Codes.SQLITE_CANTOPEN}else if("NotFoundError"===e?.name)return n.sq3Codes.SQLITE_CANTOPEN;return t};const g=async(e,t)=>{if(!e.syncHandle){const s=performance.now();i("Acquiring sync handle for",e.filenameAbs);const a=6,r=2*n.asyncIdleWaitTime;let c=1,d=r;for(;;d=r*++c)try{e.syncHandle=await e.fileHandle.createSyncAccessHandle();break}catch(s){if(c===a)throw new O(s,"Error getting sync handle for",t+"().",a,"attempts failed.",e.filenameAbs);o("Error getting sync handle for",t+"(). Waiting",d,"ms and trying again.",e.filenameAbs,s),Atomics.wait(n.sabOPView,n.opIds.retry,0,d)}i("Got",t+"() sync handle for",e.filenameAbs,"in",performance.now()-s,"ms"),e.xLock||(l.add(e.fid),i("Acquired implicit lock for",t+"()",e.fid,e.filenameAbs))}return e.syncHandle},h=(e,t)=>{i(e+"() => notify(",t,")"),Atomics.store(n.sabOPView,n.opIds.rc,t),Atomics.notify(n.sabOPView,n.opIds.rc)},w=function(e,n){n.readOnly&&t(e+"(): File is read-only: "+n.filenameAbs)};let p=!1;const I={"opfs-async-shutdown":async()=>{p=!0,h("opfs-async-shutdown",0)},mkdir:async e=>{let t=0;try{await f(e+"/filepart",!0)}catch(e){n.s11n.storeException(2,e),t=n.sq3Codes.SQLITE_IOERR}h("mkdir",t)},xAccess:async e=>{let t=0;try{const[t,n]=await f(e);await t.getFileHandle(n)}catch(e){n.s11n.storeException(2,e),t=n.sq3Codes.SQLITE_IOERR}h("xAccess",t)},xClose:async function(e){l.delete(e);const t=c[e];let s=0;if(t){if(delete c[e],await y(t),t.deleteOnClose)try{await t.dirHandle.removeEntry(t.filenamePart)}catch(e){o("Ignoring dirHandle.removeEntry() failure of",t,e)}}else n.s11n.serialize(),s=n.sq3Codes.SQLITE_NOTFOUND;h("xClose",s)},xDelete:async function(...e){const t=await I.xDeleteNoWait(...e);h("xDelete",t)},xDeleteNoWait:async function(e,t=0,s=!1){let a=0;try{for(;e;){const[n,a]=await f(e,!1);if(!a)break;if(await n.removeEntry(a,{recursive:s}),4660!==t)break;s=!1,(e=d(e,!0)).pop(),e=e.join("/")}}catch(e){n.s11n.storeException(2,e),a=n.sq3Codes.SQLITE_IOERR_DELETE}return a},xFileSize:async function(e){const t=c[e];let s=0;try{const e=await(await g(t,"xFileSize")).getSize();n.s11n.serialize(Number(e))}catch(e){n.s11n.storeException(1,e),s=O.convertRc(e,n.sq3Codes.SQLITE_IOERR)}await b(t),h("xFileSize",s)},xLock:async function(e,t){const s=c[e];let a=0;const i=s.xLock;if(s.xLock=t,!s.syncHandle)try{await g(s,"xLock"),l.delete(e)}catch(e){n.s11n.storeException(1,e),a=O.convertRc(e,n.sq3Codes.SQLITE_IOERR_LOCK),s.xLock=i}h("xLock",a)},xOpen:async function(e,t,s,a){const i="xOpen",o=n.sq3Codes.SQLITE_OPEN_CREATE&s;try{let r,l;try{[r,l]=await f(t,!!o)}catch(e){return n.s11n.storeException(1,e),void h(i,n.sq3Codes.SQLITE_NOTFOUND)}if(n.opfsFlags.OPFS_UNLINK_BEFORE_OPEN&a)try{await r.removeEntry(l)}catch(e){}const d=await r.getFileHandle(l,{create:o}),y=Object.assign(Object.create(null),{fid:e,filenameAbs:t,filenamePart:l,dirHandle:r,fileHandle:d,sabView:n.sabFileBufView,readOnly:!o&&!!(n.sq3Codes.SQLITE_OPEN_READONLY&s),deleteOnClose:!!(n.sq3Codes.SQLITE_OPEN_DELETEONCLOSE&s)});y.releaseImplicitLocks=a&n.opfsFlags.OPFS_UNLOCK_ASAP||n.opfsFlags.defaultUnlockAsap,c[e]=y,h(i,0)}catch(e){r(i,e),n.s11n.storeException(1,e),h(i,n.sq3Codes.SQLITE_IOERR)}},xRead:async function(e,t,s){let a,i=0;const o=c[e];try{a=(await g(o,"xRead")).read(o.sabView.subarray(0,t),{at:Number(s)}),a<t&&(o.sabView.fill(0,a,t),i=n.sq3Codes.SQLITE_IOERR_SHORT_READ)}catch(e){r("xRead() failed",e,o),n.s11n.storeException(1,e),i=O.convertRc(e,n.sq3Codes.SQLITE_IOERR_READ)}await b(o),h("xRead",i)},xSync:async function(e,t){const s=c[e];let a=0;if(!s.readOnly&&s.syncHandle)try{await s.syncHandle.flush()}catch(e){n.s11n.storeException(2,e),a=n.sq3Codes.SQLITE_IOERR_FSYNC}h("xSync",a)},xTruncate:async function(e,t){let s=0;const a=c[e];try{w("xTruncate",a),await(await g(a,"xTruncate")).truncate(t)}catch(e){r("xTruncate():",e,a),n.s11n.storeException(2,e),s=O.convertRc(e,n.sq3Codes.SQLITE_IOERR_TRUNCATE)}await b(a),h("xTruncate",s)},xUnlock:async function(e,t){let s=0;const a=c[e];if(a.syncHandle&&n.sq3Codes.SQLITE_LOCK_NONE===t)try{await y(a)}catch(e){n.s11n.storeException(1,e),s=n.sq3Codes.SQLITE_IOERR_UNLOCK}h("xUnlock",s)},xWrite:async function(e,t,s){let a;const i=c[e];try{w("xWrite",i),a=t===(await g(i,"xWrite")).write(i.sabView.subarray(0,t),{at:Number(s)})?0:n.sq3Codes.SQLITE_IOERR_WRITE}catch(e){r("xWrite():",e,i),n.s11n.storeException(1,e),a=O.convertRc(e,n.sq3Codes.SQLITE_IOERR_WRITE)}await b(i),h("xWrite",a)}},m=async function(){const e=Object.create(null);for(let t of Object.keys(n.opIds)){const s=I[t];if(!s)continue;const a=Object.create(null);e[n.opIds[t]]=a,a.key=t,a.f=s}for(;!p;)try{if("not-equal"!==Atomics.wait(n.sabOPView,n.opIds.whichOp,0,n.asyncIdleWaitTime)){await E();continue}const s=Atomics.load(n.sabOPView,n.opIds.whichOp);Atomics.store(n.sabOPView,n.opIds.whichOp,0);const a=e[s]??t("No waitLoop handler for whichOp #",s),i=n.s11n.deserialize(!0)||[];a.f?await a.f(...i):r("Missing callback for opId",s)}catch(e){r("in waitLoop():",e)}};navigator.storage.getDirectory().then((function(s){n.rootDir=s,globalThis.onmessage=function({data:s}){switch(s.type){case"opfs-async-init":{const a=s.args;for(const e in a)n[e]=a[e];n.verbose=a.verbose??1,n.sabOPView=new Int32Array(n.sabOP),n.sabFileBufView=new Uint8Array(n.sabIO,0,n.fileBufferSize),n.sabS11nView=new Uint8Array(n.sabIO,n.sabS11nOffset,n.sabS11nSize),Object.keys(I).forEach((e=>{Number.isFinite(n.opIds[e])||t("Maintenance required: missing state.opIds[",e,"]")})),(()=>{if(n.s11n)return n.s11n;const e=new TextDecoder,s=new TextEncoder("utf-8"),a=new Uint8Array(n.sabIO,n.sabS11nOffset,n.sabS11nSize),i=new DataView(n.sabIO,n.sabS11nOffset,n.sabS11nSize);n.s11n=Object.create(null);const o=Object.create(null);o.number={id:1,size:8,getter:"getFloat64",setter:"setFloat64"},o.bigint={id:2,size:8,getter:"getBigInt64",setter:"setBigInt64"},o.boolean={id:3,size:4,getter:"getInt32",setter:"setInt32"},o.string={id:4};const r=e=>{switch(e){case o.number.id:return o.number;case o.bigint.id:return o.bigint;case o.boolean.id:return o.boolean;case o.string.id:return o.string;default:t("Invalid type ID:",e)}};n.s11n.deserialize=function(t=!1){const s=a[0],o=s?[]:null;if(s){const t=[];let c,l,d,f=1;for(c=0;c<s;++c,++f)t.push(r(a[f]));for(c=0;c<s;++c){const s=t[c];s.getter?(d=i[s.getter](f,n.littleEndian),f+=s.size):(l=i.getInt32(f,n.littleEndian),f+=4,d=e.decode(a.slice(f,f+l)),f+=l),o.push(d)}}return t&&(a[0]=0),o},n.s11n.serialize=function(...e){if(e.length){const c=[];let l=0,d=1;for(a[0]=255&e.length;l<e.length;++l,++d)c.push((r=e[l],o[typeof r]||t("Maintenance required: this value type cannot be serialized.",r))),a[d]=c[l].id;for(l=0;l<e.length;++l){const t=c[l];if(t.setter)i[t.setter](d,e[l],n.littleEndian),d+=t.size;else{const t=s.encode(e[l]);i.setInt32(d,t.byteLength,n.littleEndian),d+=4,a.set(t,d),d+=t.byteLength}}}else a[0]=0;var r},n.s11n.storeException=n.asyncS11nExceptions?(e,t)=>{e<=n.asyncS11nExceptions&&n.s11n.serialize([t.name,": ",t.message].join(""))}:()=>{},n.s11n})(),i("init state",n),e("opfs-async-inited"),m();break}case"opfs-async-restart":p&&(o("Restarting after opfs-async-shutdown. Might or might not work."),p=!1,m())}},e("opfs-async-loaded")})).catch((e=>r("error initializing OPFS asyncer:",e)))};globalThis.SharedArrayBuffer?globalThis.Atomics?globalThis.FileSystemHandle&&globalThis.FileSystemDirectoryHandle&&globalThis.FileSystemFileHandle&&globalThis.FileSystemFileHandle.prototype.createSyncAccessHandle&&navigator?.storage?.getDirectory?t():e("opfs-unavailable","Missing required OPFS APIs."):e("opfs-unavailable","Missing Atomics API.","The server must emit the COOP/COEP response headers to enable that."):e("opfs-unavailable","Missing SharedArrayBuffer API.","The server must emit the COOP/COEP response headers to enable that.");
        `;
        const ret = typeof URL.createObjectURL === 'undefined' ? "data:application/javascript," + encodeURIComponent(val) : URL.createObjectURL(new Blob([val], { type: "text/javascript" }));
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return ret;
    };
    imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'number' ? obj : undefined;
        if (!isLikeNone(ret)) {
            _assertNum(ret);
        }
        getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
    };
    imports.wbg.__wbindgen_number_new = function(arg0) {
        const ret = arg0;
        return ret;
    };
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    return imports;
}

function __wbg_init_memory(imports, memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('wasm_mod_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
