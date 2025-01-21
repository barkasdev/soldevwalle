import { report_progress } from './snippets/wasm_mod-bc4ca452742d1bb1/src/progress.js';

let wasm;

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
function __wbg_adapter_32(arg0, arg1, arg2) {
    wasm.closure123_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_39(arg0, arg1) {
    wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__had0ee89e2517b0dd(arg0, arg1);
}

function __wbg_adapter_42(arg0, arg1, arg2) {
    wasm.closure138_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_268(arg0, arg1, arg2, arg3) {
    wasm.closure312_externref_shim(arg0, arg1, arg2, arg3);
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
        _assertClass(other, Hash);
        const ret = wasm.hash_equals(this.__wbg_ptr, other.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Return the `Uint8Array` representation of the hash
     * @returns {Uint8Array}
     */
    toBytes() {
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
        _assertClass(instruction, Instruction);
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
        const ret = wasm.__wbg_get_message_recent_blockhash(this.__wbg_ptr);
        return Hash.__wrap(ret);
    }
    /**
     * The id of a recent ledger entry.
     * @param {Hash} arg0
     */
    set recent_blockhash(arg0) {
        _assertClass(arg0, Hash);
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
        _assertClass(other, PodElGamalPubkey);
        const ret = wasm.podelgamalpubkey_equals(this.__wbg_ptr, other.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Return the `Uint8Array` representation of the public key
     * @returns {Uint8Array}
     */
    toBytes() {
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
        const ret = wasm.podelgamalpubkey_compressed(decoded.__wbg_ptr);
        return PodElGamalPubkey.__wrap(ret);
    }
    /**
     * @returns {ElGamalPubkey}
     */
    decompressed() {
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
        const ret = wasm.pubkey_isOnCurve(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Checks if two `Pubkey`s are equal
     * @param {Pubkey} other
     * @returns {boolean}
     */
    equals(other) {
        _assertClass(other, Pubkey);
        const ret = wasm.pubkey_equals(this.__wbg_ptr, other.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Return the `Uint8Array` representation of the public key
     * @returns {Uint8Array}
     */
    toBytes() {
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
        const ptr0 = passStringToWasm0(seed, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(owner, Pubkey);
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
        _assertClass(to_pubkey, Pubkey);
        _assertClass(owner, Pubkey);
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
        _assertClass(to_pubkey, Pubkey);
        _assertClass(base, Pubkey);
        const ptr0 = passStringToWasm0(seed, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(owner, Pubkey);
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
        _assertClass(owner, Pubkey);
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
        _assertClass(base, Pubkey);
        const ptr0 = passStringToWasm0(seed, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(owner, Pubkey);
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
        _assertClass(to_pubkey, Pubkey);
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
        _assertClass(from_base, Pubkey);
        const ptr0 = passStringToWasm0(from_seed, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(from_owner, Pubkey);
        _assertClass(to_pubkey, Pubkey);
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
        _assertClass(base, Pubkey);
        const ptr0 = passStringToWasm0(seed, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(owner, Pubkey);
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
        _assertClass(nonce_pubkey, Pubkey);
        _assertClass(authority, Pubkey);
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
        _assertClass(authorized_pubkey, Pubkey);
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
        _assertClass(authorized_pubkey, Pubkey);
        _assertClass(to_pubkey, Pubkey);
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
        _assertClass(authorized_pubkey, Pubkey);
        _assertClass(new_authority, Pubkey);
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
        var ptr0 = instructions.__destroy_into_raw();
        let ptr1 = 0;
        if (!isLikeNone(payer)) {
            _assertClass(payer, Pubkey);
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
        const ret = wasm.transaction_message(this.__wbg_ptr);
        return Message.__wrap(ret);
    }
    /**
     * Return the serialized message data to sign.
     * @returns {Uint8Array}
     */
    messageData() {
        const ret = wasm.transaction_messageData(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    /**
     * Verify the transaction
     */
    verify() {
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
        _assertClass(keypair, Keypair);
        _assertClass(recent_blockhash, Hash);
        wasm.transaction_partialSign(this.__wbg_ptr, keypair.__wbg_ptr, recent_blockhash.__wbg_ptr);
    }
    /**
     * @returns {boolean}
     */
    isSigned() {
        const ret = wasm.transaction_isSigned(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {Uint8Array}
     */
    toBytes() {
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
    imports.wbg.__wbg_abort_05026c983d86824c = function(arg0) {
        arg0.abort();
    };
    imports.wbg.__wbg_addEventListener_37872d53aeb4c65a = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.addEventListener(getStringFromWasm0(arg1, arg2), arg3, arg4);
    }, arguments) };
    imports.wbg.__wbg_addEventListener_b9481c2c2cab6047 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        arg0.addEventListener(getStringFromWasm0(arg1, arg2), arg3);
    }, arguments) };
    imports.wbg.__wbg_buffer_61b7ce01341d7f88 = function(arg0) {
        const ret = arg0.buffer;
        return ret;
    };
    imports.wbg.__wbg_call_500db948e69c7330 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.call(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_call_b0d8e36992d9900d = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.call(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_close_4063e1bcbd6d5fe2 = function() { return handleError(function (arg0) {
        arg0.close();
    }, arguments) };
    imports.wbg.__wbg_code_cd82312abb9d9ff9 = function(arg0) {
        const ret = arg0.code;
        return ret;
    };
    imports.wbg.__wbg_crypto_038798f665f985e2 = function(arg0) {
        const ret = arg0.crypto;
        return ret;
    };
    imports.wbg.__wbg_crypto_ed58b8e10a292839 = function(arg0) {
        const ret = arg0.crypto;
        return ret;
    };
    imports.wbg.__wbg_data_4ce8a82394d8b110 = function(arg0) {
        const ret = arg0.data;
        return ret;
    };
    imports.wbg.__wbg_debug_156ca727dbc3150f = function(arg0) {
        console.debug(arg0);
    };
    imports.wbg.__wbg_dispatchEvent_391667c727dc7c90 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.dispatchEvent(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_done_f22c1561fa919baa = function(arg0) {
        const ret = arg0.done;
        return ret;
    };
    imports.wbg.__wbg_error_7534b8e9a36f1ab4 = function(arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_error_fab41a42d22bf2bc = function(arg0) {
        console.error(arg0);
    };
    imports.wbg.__wbg_fetch_a9bc66c159c18e19 = function(arg0) {
        const ret = fetch(arg0);
        return ret;
    };
    imports.wbg.__wbg_getRandomValues_371e7ade8bd92088 = function(arg0, arg1) {
        arg0.getRandomValues(arg1);
    };
    imports.wbg.__wbg_getRandomValues_7dfe5bd1b67c9ca1 = function(arg0) {
        const ret = arg0.getRandomValues;
        return ret;
    };
    imports.wbg.__wbg_getRandomValues_bcb4912f16000dc4 = function() { return handleError(function (arg0, arg1) {
        arg0.getRandomValues(arg1);
    }, arguments) };
    imports.wbg.__wbg_get_bbccf8970793c087 = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.get(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_info_c3044c86ae29faab = function(arg0) {
        console.info(arg0);
    };
    imports.wbg.__wbg_instanceof_ArrayBuffer_670ddde44cdb2602 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof ArrayBuffer;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Error_2b29c5b4afac4e22 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Error;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Response_d3453657e10c4300 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Response;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Uint8Array_28af5bc19d6acad8 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Uint8Array;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Window_d2514c6a7ee7ba60 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Window;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_WorkerGlobalScope_b32c94246142a6a7 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof WorkerGlobalScope;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instruction_new = function(arg0) {
        const ret = Instruction.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_isArray_1ba11a930108ec51 = function(arg0) {
        const ret = Array.isArray(arg0);
        return ret;
    };
    imports.wbg.__wbg_iterator_23604bb983791576 = function() {
        const ret = Symbol.iterator;
        return ret;
    };
    imports.wbg.__wbg_length_65d1cd11729ced11 = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbg_log_464d1b2190ca1e04 = function(arg0) {
        console.log(arg0);
    };
    imports.wbg.__wbg_log_4bb95dea3d972fd3 = function(arg0, arg1) {
        console.log(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_message_7bde112094278773 = function(arg0) {
        const ret = arg0.message;
        return ret;
    };
    imports.wbg.__wbg_msCrypto_0a36e2ec3a343d26 = function(arg0) {
        const ret = arg0.msCrypto;
        return ret;
    };
    imports.wbg.__wbg_msCrypto_ff35fce085fab2a3 = function(arg0) {
        const ret = arg0.msCrypto;
        return ret;
    };
    imports.wbg.__wbg_name_ae6b09babb81aa7d = function(arg0) {
        const ret = arg0.name;
        return ret;
    };
    imports.wbg.__wbg_new_17f755666e48d1d8 = function() { return handleError(function (arg0, arg1) {
        const ret = new URL(getStringFromWasm0(arg0, arg1));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_254fa9eac11932ae = function() {
        const ret = new Array();
        return ret;
    };
    imports.wbg.__wbg_new_35d748855c4620b9 = function() { return handleError(function () {
        const ret = new Headers();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_3d446df9155128ef = function(arg0, arg1) {
        try {
            var state0 = {a: arg0, b: arg1};
            var cb0 = (arg0, arg1) => {
                const a = state0.a;
                state0.a = 0;
                try {
                    return __wbg_adapter_268(a, state0.b, arg0, arg1);
                } finally {
                    state0.a = a;
                }
            };
            const ret = new Promise(cb0);
            return ret;
        } finally {
            state0.a = state0.b = 0;
        }
    };
    imports.wbg.__wbg_new_3ff5b33b1ce712df = function(arg0) {
        const ret = new Uint8Array(arg0);
        return ret;
    };
    imports.wbg.__wbg_new_5f48f21d4be11586 = function() { return handleError(function () {
        const ret = new AbortController();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_688846f374351c92 = function() {
        const ret = new Object();
        return ret;
    };
    imports.wbg.__wbg_new_8a6f238a6ece86ea = function() {
        const ret = new Error();
        return ret;
    };
    imports.wbg.__wbg_new_9b6c38191d7b9512 = function() { return handleError(function (arg0, arg1) {
        const ret = new WebSocket(getStringFromWasm0(arg0, arg1));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_a3eaec3587e1fb84 = function() { return handleError(function () {
        const ret = new URLSearchParams();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_newnoargs_fd9e4bf8be2bc16d = function(arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_ba35896968751d91 = function(arg0, arg1, arg2) {
        const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwitheventinitdict_8ef7c889b37bf3b0 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = new CloseEvent(getStringFromWasm0(arg0, arg1), arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_newwithlength_34ce8f1051e74449 = function(arg0) {
        const ret = new Uint8Array(arg0 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithlength_759c7b9d6a7a314f = function(arg0) {
        const ret = new Array(arg0 >>> 0);
        return ret;
    };
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
    imports.wbg.__wbg_next_137428deb98342b0 = function(arg0) {
        const ret = arg0.next;
        return ret;
    };
    imports.wbg.__wbg_node_02999533c4ea02e3 = function(arg0) {
        const ret = arg0.node;
        return ret;
    };
    imports.wbg.__wbg_process_5c1d670bc53614b8 = function(arg0) {
        const ret = arg0.process;
        return ret;
    };
    imports.wbg.__wbg_pubkey_new = function(arg0) {
        const ret = Pubkey.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_push_6edad0df4b546b2c = function(arg0, arg1) {
        const ret = arg0.push(arg1);
        return ret;
    };
    imports.wbg.__wbg_queueMicrotask_2181040e064c0dc8 = function(arg0) {
        queueMicrotask(arg0);
    };
    imports.wbg.__wbg_queueMicrotask_ef9ac43769cbcc4f = function(arg0) {
        const ret = arg0.queueMicrotask;
        return ret;
    };
    imports.wbg.__wbg_randomFillSync_994ac6d9ade7a695 = function(arg0, arg1, arg2) {
        arg0.randomFillSync(getArrayU8FromWasm0(arg1, arg2));
    };
    imports.wbg.__wbg_randomFillSync_ab2cfe79ebbf2740 = function() { return handleError(function (arg0, arg1) {
        arg0.randomFillSync(arg1);
    }, arguments) };
    imports.wbg.__wbg_reason_17a506fc63aa299a = function(arg0, arg1) {
        const ret = arg1.reason;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_removeEventListener_a9ca9f05245321f0 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        arg0.removeEventListener(getStringFromWasm0(arg1, arg2), arg3);
    }, arguments) };
    imports.wbg.__wbg_reportprogress_f596037cfd5dad43 = function(arg0, arg1) {
        report_progress(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_require_0d6aeaec3c042c88 = function(arg0, arg1, arg2) {
        const ret = arg0.require(getStringFromWasm0(arg1, arg2));
        return ret;
    };
    imports.wbg.__wbg_require_79b1e9274cde3c87 = function() { return handleError(function () {
        const ret = module.require;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_resolve_0bf7c44d641804f9 = function(arg0) {
        const ret = Promise.resolve(arg0);
        return ret;
    };
    imports.wbg.__wbg_search_a8f6890ada3d686f = function(arg0, arg1) {
        const ret = arg1.search;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_self_25aabeb5a7b41685 = function() { return handleError(function () {
        const ret = self.self;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_set_1d80752d0d5f0b21 = function(arg0, arg1, arg2) {
        arg0[arg1 >>> 0] = arg2;
    };
    imports.wbg.__wbg_set_23d69db4e5c66a6e = function(arg0, arg1, arg2) {
        arg0.set(arg1, arg2 >>> 0);
    };
    imports.wbg.__wbg_set_aa8f7a765a0a2e5f = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.set(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_setbinaryType_3fa4a9e8d2cc506f = function(arg0, arg1) {
        arg0.binaryType = __wbindgen_enum_BinaryType[arg1];
    };
    imports.wbg.__wbg_setbody_64920df008e48adc = function(arg0, arg1) {
        arg0.body = arg1;
    };
    imports.wbg.__wbg_setcode_6c2f9e460f442b5b = function(arg0, arg1) {
        arg0.code = arg1;
    };
    imports.wbg.__wbg_setheaders_4c921e8e226bdfa7 = function(arg0, arg1) {
        arg0.headers = arg1;
    };
    imports.wbg.__wbg_setmethod_cfc7f688ba46a6be = function(arg0, arg1, arg2) {
        arg0.method = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setonce_87cf501e67ee47f7 = function(arg0, arg1) {
        arg0.once = arg1 !== 0;
    };
    imports.wbg.__wbg_setreason_6ba48376e1afb3d9 = function(arg0, arg1, arg2) {
        arg0.reason = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setsearch_420bbd8d2dbd92aa = function(arg0, arg1, arg2) {
        arg0.search = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setsignal_f766190d206f09e5 = function(arg0, arg1) {
        arg0.signal = arg1;
    };
    imports.wbg.__wbg_signal_1fdadeba2d04660e = function(arg0) {
        const ret = arg0.signal;
        return ret;
    };
    imports.wbg.__wbg_stack_0ed75d68575b0f3c = function(arg0, arg1) {
        const ret = arg1.stack;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_static_accessor_GLOBAL_0be7472e492ad3e3 = function() {
        const ret = typeof global === 'undefined' ? null : global;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_GLOBAL_THIS_1a6eb482d12c9bfb = function() {
        const ret = typeof globalThis === 'undefined' ? null : globalThis;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_MODULE_ef3aa2eb251158a5 = function() {
        const ret = module;
        return ret;
    };
    imports.wbg.__wbg_static_accessor_SELF_1dc398a895c82351 = function() {
        const ret = typeof self === 'undefined' ? null : self;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_WINDOW_ae1c80c7eea8d64a = function() {
        const ret = typeof window === 'undefined' ? null : window;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_subarray_46adeb9b86949d12 = function(arg0, arg1, arg2) {
        const ret = arg0.subarray(arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_text_dfc4cb7631d2eb34 = function() { return handleError(function (arg0) {
        const ret = arg0.text();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_then_0438fad860fe38e1 = function(arg0, arg1) {
        const ret = arg0.then(arg1);
        return ret;
    };
    imports.wbg.__wbg_then_0ffafeddf0e182a4 = function(arg0, arg1, arg2) {
        const ret = arg0.then(arg1, arg2);
        return ret;
    };
    imports.wbg.__wbg_toString_a491ccf7be1ca5c9 = function(arg0) {
        const ret = arg0.toString();
        return ret;
    };
    imports.wbg.__wbg_toString_cbcf95f260c441ae = function(arg0) {
        const ret = arg0.toString();
        return ret;
    };
    imports.wbg.__wbg_url_0287fc8f8dd185b7 = function(arg0, arg1) {
        const ret = arg1.url;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_value_4c32fd138a88eee2 = function(arg0) {
        const ret = arg0.value;
        return ret;
    };
    imports.wbg.__wbg_values_5b2662303e52c392 = function(arg0) {
        const ret = arg0.values();
        return ret;
    };
    imports.wbg.__wbg_versions_c71aa1626a93e0a1 = function(arg0) {
        const ret = arg0.versions;
        return ret;
    };
    imports.wbg.__wbg_warn_123db6aa8948382e = function(arg0) {
        console.warn(arg0);
    };
    imports.wbg.__wbg_wasClean_303f938d5142dcca = function(arg0) {
        const ret = arg0.wasClean;
        return ret;
    };
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = arg0.original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        const ret = false;
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper573 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 122, __wbg_adapter_32);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper575 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 122, __wbg_adapter_32);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper577 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 122, __wbg_adapter_32);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper579 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 122, __wbg_adapter_39);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper645 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 139, __wbg_adapter_42);
        return ret;
    };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        const ret = debugString(arg1);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
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
        return ret;
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = arg0;
        const ret = typeof(val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbindgen_is_string = function(arg0) {
        const ret = typeof(arg0) === 'string';
        return ret;
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = arg0 === undefined;
        return ret;
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return ret;
    };
    imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'number' ? obj : undefined;
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
