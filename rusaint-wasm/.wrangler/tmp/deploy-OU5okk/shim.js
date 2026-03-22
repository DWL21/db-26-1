var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// build/index.js
import { WorkerEntrypoint as pt } from "cloudflare:workers";
import X from "./ac5a244eaf18879643f8c460ff5be80cd0c6ee78-index_bg.wasm";
var R = /* @__PURE__ */ __name(class {
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, it.unregister(this), t;
  }
  free() {
    let t = this.__destroy_into_raw();
    o.__wbg_containerstartupoptions_free(t, 0);
  }
  get enableInternet() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== u)
      throw new Error("Invalid stale object from previous Wasm instance");
    let t = o.__wbg_get_containerstartupoptions_enableInternet(this.__wbg_ptr);
    return t === 16777215 ? void 0 : t !== 0;
  }
  get entrypoint() {
    try {
      if (this.__wbg_inst !== void 0 && this.__wbg_inst !== u)
        throw new Error("Invalid stale object from previous Wasm instance");
      let i = o.__wbindgen_add_to_stack_pointer(-16);
      o.__wbg_get_containerstartupoptions_entrypoint(i, this.__wbg_ptr);
      var t = a().getInt32(i + 0, true), e = a().getInt32(i + 4, true), n = bt(t, e).slice();
      return o.__wbindgen_export4(t, e * 4, 4), n;
    } finally {
      o.__wbindgen_add_to_stack_pointer(16);
    }
  }
  get env() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== u)
      throw new Error("Invalid stale object from previous Wasm instance");
    let t = o.__wbg_get_containerstartupoptions_env(this.__wbg_ptr);
    return p(t);
  }
  set enableInternet(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== u)
      throw new Error("Invalid stale object from previous Wasm instance");
    o.__wbg_set_containerstartupoptions_enableInternet(this.__wbg_ptr, w(t) ? 16777215 : t ? 1 : 0);
  }
  set entrypoint(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== u)
      throw new Error("Invalid stale object from previous Wasm instance");
    let e = gt(t, o.__wbindgen_export), n = h;
    o.__wbg_set_containerstartupoptions_entrypoint(this.__wbg_ptr, e, n);
  }
  set env(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== u)
      throw new Error("Invalid stale object from previous Wasm instance");
    o.__wbg_set_containerstartupoptions_env(this.__wbg_ptr, s(t));
  }
}, "R");
Symbol.dispose && (R.prototype[Symbol.dispose] = R.prototype.free);
var E = /* @__PURE__ */ __name(class {
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, ot.unregister(this), t;
  }
  free() {
    let t = this.__destroy_into_raw();
    o.__wbg_intounderlyingbytesource_free(t, 0);
  }
  get autoAllocateChunkSize() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== u)
      throw new Error("Invalid stale object from previous Wasm instance");
    return o.intounderlyingbytesource_autoAllocateChunkSize(this.__wbg_ptr) >>> 0;
  }
  cancel() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== u)
      throw new Error("Invalid stale object from previous Wasm instance");
    let t = this.__destroy_into_raw();
    o.intounderlyingbytesource_cancel(t);
  }
  pull(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== u)
      throw new Error("Invalid stale object from previous Wasm instance");
    let e = o.intounderlyingbytesource_pull(this.__wbg_ptr, s(t));
    return p(e);
  }
  start(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== u)
      throw new Error("Invalid stale object from previous Wasm instance");
    o.intounderlyingbytesource_start(this.__wbg_ptr, s(t));
  }
  get type() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== u)
      throw new Error("Invalid stale object from previous Wasm instance");
    let t = o.intounderlyingbytesource_type(this.__wbg_ptr);
    return et[t];
  }
}, "E");
Symbol.dispose && (E.prototype[Symbol.dispose] = E.prototype.free);
var j = /* @__PURE__ */ __name(class {
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, st.unregister(this), t;
  }
  free() {
    let t = this.__destroy_into_raw();
    o.__wbg_intounderlyingsink_free(t, 0);
  }
  abort(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== u)
      throw new Error("Invalid stale object from previous Wasm instance");
    let e = this.__destroy_into_raw(), n = o.intounderlyingsink_abort(e, s(t));
    return p(n);
  }
  close() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== u)
      throw new Error("Invalid stale object from previous Wasm instance");
    let t = this.__destroy_into_raw(), e = o.intounderlyingsink_close(t);
    return p(e);
  }
  write(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== u)
      throw new Error("Invalid stale object from previous Wasm instance");
    let e = o.intounderlyingsink_write(this.__wbg_ptr, s(t));
    return p(e);
  }
}, "j");
Symbol.dispose && (j.prototype[Symbol.dispose] = j.prototype.free);
var F = /* @__PURE__ */ __name(class {
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, ct.unregister(this), t;
  }
  free() {
    let t = this.__destroy_into_raw();
    o.__wbg_intounderlyingsource_free(t, 0);
  }
  cancel() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== u)
      throw new Error("Invalid stale object from previous Wasm instance");
    let t = this.__destroy_into_raw();
    o.intounderlyingsource_cancel(t);
  }
  pull(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== u)
      throw new Error("Invalid stale object from previous Wasm instance");
    let e = o.intounderlyingsource_pull(this.__wbg_ptr, s(t));
    return p(e);
  }
}, "F");
Symbol.dispose && (F.prototype[Symbol.dispose] = F.prototype.free);
var S = /* @__PURE__ */ __name(class {
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, ut.unregister(this), t;
  }
  free() {
    let t = this.__destroy_into_raw();
    o.__wbg_minifyconfig_free(t, 0);
  }
  get css() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== u)
      throw new Error("Invalid stale object from previous Wasm instance");
    return o.__wbg_get_minifyconfig_css(this.__wbg_ptr) !== 0;
  }
  get html() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== u)
      throw new Error("Invalid stale object from previous Wasm instance");
    return o.__wbg_get_minifyconfig_html(this.__wbg_ptr) !== 0;
  }
  get js() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== u)
      throw new Error("Invalid stale object from previous Wasm instance");
    return o.__wbg_get_minifyconfig_js(this.__wbg_ptr) !== 0;
  }
  set css(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== u)
      throw new Error("Invalid stale object from previous Wasm instance");
    o.__wbg_set_minifyconfig_css(this.__wbg_ptr, t);
  }
  set html(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== u)
      throw new Error("Invalid stale object from previous Wasm instance");
    o.__wbg_set_minifyconfig_html(this.__wbg_ptr, t);
  }
  set js(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== u)
      throw new Error("Invalid stale object from previous Wasm instance");
    o.__wbg_set_minifyconfig_js(this.__wbg_ptr, t);
  }
}, "S");
Symbol.dispose && (S.prototype[Symbol.dispose] = S.prototype.free);
var k = /* @__PURE__ */ __name(class {
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, ft.unregister(this), t;
  }
  free() {
    let t = this.__destroy_into_raw();
    o.__wbg_r2range_free(t, 0);
  }
  get length() {
    try {
      if (this.__wbg_inst !== void 0 && this.__wbg_inst !== u)
        throw new Error("Invalid stale object from previous Wasm instance");
      let n = o.__wbindgen_add_to_stack_pointer(-16);
      o.__wbg_get_r2range_length(n, this.__wbg_ptr);
      var t = a().getInt32(n + 0, true), e = a().getFloat64(n + 8, true);
      return t === 0 ? void 0 : e;
    } finally {
      o.__wbindgen_add_to_stack_pointer(16);
    }
  }
  get offset() {
    try {
      if (this.__wbg_inst !== void 0 && this.__wbg_inst !== u)
        throw new Error("Invalid stale object from previous Wasm instance");
      let n = o.__wbindgen_add_to_stack_pointer(-16);
      o.__wbg_get_r2range_offset(n, this.__wbg_ptr);
      var t = a().getInt32(n + 0, true), e = a().getFloat64(n + 8, true);
      return t === 0 ? void 0 : e;
    } finally {
      o.__wbindgen_add_to_stack_pointer(16);
    }
  }
  get suffix() {
    try {
      if (this.__wbg_inst !== void 0 && this.__wbg_inst !== u)
        throw new Error("Invalid stale object from previous Wasm instance");
      let n = o.__wbindgen_add_to_stack_pointer(-16);
      o.__wbg_get_r2range_suffix(n, this.__wbg_ptr);
      var t = a().getInt32(n + 0, true), e = a().getFloat64(n + 8, true);
      return t === 0 ? void 0 : e;
    } finally {
      o.__wbindgen_add_to_stack_pointer(16);
    }
  }
  set length(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== u)
      throw new Error("Invalid stale object from previous Wasm instance");
    o.__wbg_set_r2range_length(this.__wbg_ptr, !w(t), w(t) ? 0 : t);
  }
  set offset(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== u)
      throw new Error("Invalid stale object from previous Wasm instance");
    o.__wbg_set_r2range_offset(this.__wbg_ptr, !w(t), w(t) ? 0 : t);
  }
  set suffix(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== u)
      throw new Error("Invalid stale object from previous Wasm instance");
    o.__wbg_set_r2range_suffix(this.__wbg_ptr, !w(t), w(t) ? 0 : t);
  }
}, "k");
Symbol.dispose && (k.prototype[Symbol.dispose] = k.prototype.free);
function J() {
  u++, x = null, A = null, typeof numBytesDecoded < "u" && (numBytesDecoded = 0), typeof h < "u" && (h = 0), typeof l < "u" && (l = new Array(1024).fill(void 0), l = l.concat([void 0, null, true, false]), typeof v < "u" && (v = l.length)), o = new WebAssembly.Instance(X, K()).exports, o.__wbindgen_start();
}
__name(J, "J");
function G(r, t, e) {
  let n = o.fetch(s(r), s(t), s(e));
  return p(n);
}
__name(G, "G");
function D(r) {
  o.setPanicHook(s(r));
}
__name(D, "D");
function K() {
  return { __proto__: null, "./index_bg.js": { __proto__: null, __wbg_Error_83742b46f01ce22d: function(t, e) {
    let n = Error(y(t, e));
    return s(n);
  }, __wbg_Number_a5a435bd7bbec835: function(t) {
    return Number(_(t));
  }, __wbg_String_8564e559799eccda: function(t, e) {
    let n = String(_(e)), i = m(n, o.__wbindgen_export, o.__wbindgen_export2), c = h;
    a().setInt32(t + 4, c, true), a().setInt32(t + 0, i, true);
  }, __wbg___wbindgen_boolean_get_c0f3f60bac5a78d1: function(t) {
    let e = _(t), n = typeof e == "boolean" ? e : void 0;
    return w(n) ? 16777215 : n ? 1 : 0;
  }, __wbg___wbindgen_debug_string_5398f5bb970e0daa: function(t, e) {
    let n = L(_(e)), i = m(n, o.__wbindgen_export, o.__wbindgen_export2), c = h;
    a().setInt32(t + 4, c, true), a().setInt32(t + 0, i, true);
  }, __wbg___wbindgen_in_41dbb8413020e076: function(t, e) {
    return _(t) in _(e);
  }, __wbg___wbindgen_is_function_3c846841762788c1: function(t) {
    return typeof _(t) == "function";
  }, __wbg___wbindgen_is_object_781bc9f159099513: function(t) {
    let e = _(t);
    return typeof e == "object" && e !== null;
  }, __wbg___wbindgen_is_string_7ef6b97b02428fae: function(t) {
    return typeof _(t) == "string";
  }, __wbg___wbindgen_is_undefined_52709e72fb9f179c: function(t) {
    return _(t) === void 0;
  }, __wbg___wbindgen_jsval_loose_eq_5bcc3bed3c69e72b: function(t, e) {
    return _(t) == _(e);
  }, __wbg___wbindgen_number_get_34bb9d9dcfa21373: function(t, e) {
    let n = _(e), i = typeof n == "number" ? n : void 0;
    a().setFloat64(t + 8, w(i) ? 0 : i, true), a().setInt32(t + 0, !w(i), true);
  }, __wbg___wbindgen_string_get_395e606bd0ee4427: function(t, e) {
    let n = _(e), i = typeof n == "string" ? n : void 0;
    var c = w(i) ? 0 : m(i, o.__wbindgen_export, o.__wbindgen_export2), f = h;
    a().setInt32(t + 4, f, true), a().setInt32(t + 0, c, true);
  }, __wbg___wbindgen_throw_6ddd609b62940d55: function(t, e) {
    throw new Error(y(t, e));
  }, __wbg__wbg_cb_unref_6b5b6b8576d35cb1: function(t) {
    _(t)._wbg_cb_unref();
  }, __wbg_abort_5ef96933660780b7: function(t) {
    _(t).abort();
  }, __wbg_abort_6479c2d794ebf2ee: function(t, e) {
    _(t).abort(_(e));
  }, __wbg_append_608dfb635ee8998f: function() {
    return b(function(t, e, n, i, c) {
      _(t).append(y(e, n), y(i, c));
    }, arguments);
  }, __wbg_buffer_60b8043cd926067d: function(t) {
    let e = _(t).buffer;
    return s(e);
  }, __wbg_byobRequest_6342e5f2b232c0f9: function(t) {
    let e = _(t).byobRequest;
    return w(e) ? 0 : s(e);
  }, __wbg_byteLength_607b856aa6c5a508: function(t) {
    return _(t).byteLength;
  }, __wbg_byteOffset_b26b63681c83856c: function(t) {
    return _(t).byteOffset;
  }, __wbg_call_2d781c1f4d5c0ef8: function() {
    return b(function(t, e, n) {
      let i = _(t).call(_(e), _(n));
      return s(i);
    }, arguments);
  }, __wbg_call_dcc2662fa17a72cf: function() {
    return b(function(t, e, n, i) {
      let c = _(t).call(_(e), _(n), _(i));
      return s(c);
    }, arguments);
  }, __wbg_call_f858478a02f9600f: function() {
    return b(function(t, e, n, i, c) {
      let f = _(t).call(_(e), _(n), _(i), _(c));
      return s(f);
    }, arguments);
  }, __wbg_cause_f02a23068e3256fa: function(t) {
    let e = _(t).cause;
    return s(e);
  }, __wbg_cf_c5a23ee8e524d1e1: function() {
    return b(function(t) {
      let e = _(t).cf;
      return w(e) ? 0 : s(e);
    }, arguments);
  }, __wbg_clearTimeout_2256f1e7b94ef517: function(t) {
    let e = clearTimeout(p(t));
    return s(e);
  }, __wbg_close_690d36108c557337: function() {
    return b(function(t) {
      _(t).close();
    }, arguments);
  }, __wbg_close_737b4b1fbc658540: function() {
    return b(function(t) {
      _(t).close();
    }, arguments);
  }, __wbg_done_08ce71ee07e3bd17: function(t) {
    return _(t).done;
  }, __wbg_enqueue_ec3552838b4b7fbf: function() {
    return b(function(t, e) {
      _(t).enqueue(_(e));
    }, arguments);
  }, __wbg_entries_5b8fe91cea59610e: function(t) {
    let e = _(t).entries();
    return s(e);
  }, __wbg_error_8d9a8e04cd1d3588: function(t) {
    console.error(_(t));
  }, __wbg_error_a6fa202b58aa1cd3: function(t, e) {
    let n, i;
    try {
      n = t, i = e, console.error(y(t, e));
    } finally {
      o.__wbindgen_export4(n, i, 1);
    }
  }, __wbg_error_cfce0f619500de52: function(t, e) {
    console.error(_(t), _(e));
  }, __wbg_fetch_43b2f110608a59ff: function(t) {
    let e = fetch(_(t));
    return s(e);
  }, __wbg_fetch_5550a88cf343aaa9: function(t, e) {
    let n = _(t).fetch(_(e));
    return s(n);
  }, __wbg_get_3ef1eba1850ade27: function() {
    return b(function(t, e) {
      let n = Reflect.get(_(t), _(e));
      return s(n);
    }, arguments);
  }, __wbg_get_a8ee5c45dabc1b3b: function(t, e) {
    let n = _(t)[e >>> 0];
    return s(n);
  }, __wbg_get_with_ref_key_6412cf3094599694: function(t, e) {
    let n = _(t)[_(e)];
    return s(n);
  }, __wbg_has_926ef2ff40b308cf: function() {
    return b(function(t, e) {
      return Reflect.has(_(t), _(e));
    }, arguments);
  }, __wbg_headers_eb2234545f9ff993: function(t) {
    let e = _(t).headers;
    return s(e);
  }, __wbg_headers_fc8c672cd757e0fd: function(t) {
    let e = _(t).headers;
    return s(e);
  }, __wbg_instanceof_ArrayBuffer_101e2bf31071a9f6: function(t) {
    let e;
    try {
      e = _(t) instanceof ArrayBuffer;
    } catch {
      e = false;
    }
    return e;
  }, __wbg_instanceof_Error_4691a5b466e32a80: function(t) {
    let e;
    try {
      e = _(t) instanceof Error;
    } catch {
      e = false;
    }
    return e;
  }, __wbg_instanceof_Response_9b4d9fd451e051b1: function(t) {
    let e;
    try {
      e = _(t) instanceof Response;
    } catch {
      e = false;
    }
    return e;
  }, __wbg_instanceof_Uint8Array_740438561a5b956d: function(t) {
    let e;
    try {
      e = _(t) instanceof Uint8Array;
    } catch {
      e = false;
    }
    return e;
  }, __wbg_isArray_33b91feb269ff46e: function(t) {
    return Array.isArray(_(t));
  }, __wbg_isSafeInteger_ecd6a7f9c3e053cd: function(t) {
    return Number.isSafeInteger(_(t));
  }, __wbg_json_23d07e6730d48b96: function() {
    return b(function(t) {
      let e = _(t).json();
      return s(e);
    }, arguments);
  }, __wbg_length_ea16607d7b61445b: function(t) {
    return _(t).length;
  }, __wbg_method_23aa7d0d6ec9a08f: function(t, e) {
    let n = _(e).method, i = m(n, o.__wbindgen_export, o.__wbindgen_export2), c = h;
    a().setInt32(t + 4, c, true), a().setInt32(t + 0, i, true);
  }, __wbg_new_0837727332ac86ba: function() {
    return b(function() {
      let t = new Headers();
      return s(t);
    }, arguments);
  }, __wbg_new_227d7c05414eb861: function() {
    let t = new Error();
    return s(t);
  }, __wbg_new_49d5571bd3f0c4d4: function() {
    return s(/* @__PURE__ */ new Map());
  }, __wbg_new_5f486cdf45a04d78: function(t) {
    let e = new Uint8Array(_(t));
    return s(e);
  }, __wbg_new_a70fbab9066b301f: function() {
    let t = new Array();
    return s(t);
  }, __wbg_new_ab79df5bd7c26067: function() {
    let t = new Object();
    return s(t);
  }, __wbg_new_c518c60af666645b: function() {
    return b(function() {
      let t = new AbortController();
      return s(t);
    }, arguments);
  }, __wbg_new_d098e265629cd10f: function(t, e) {
    try {
      var n = { a: t, b: e }, i = /* @__PURE__ */ __name((f, g) => {
        let d = n.a;
        n.a = 0;
        try {
          return N(d, n.b, f, g);
        } finally {
          n.a = d;
        }
      }, "i");
      let c = new Promise(i);
      return s(c);
    } finally {
      n.a = n.b = 0;
    }
  }, __wbg_new_d15cb560a6a0e5f0: function(t, e) {
    let n = new Error(y(t, e));
    return s(n);
  }, __wbg_new_from_slice_22da9388ac046e50: function(t, e) {
    let n = new Uint8Array(q(t, e));
    return s(n);
  }, __wbg_new_typed_aaaeaf29cf802876: function(t, e) {
    try {
      var n = { a: t, b: e }, i = /* @__PURE__ */ __name((f, g) => {
        let d = n.a;
        n.a = 0;
        try {
          return N(d, n.b, f, g);
        } finally {
          n.a = d;
        }
      }, "i");
      let c = new Promise(i);
      return s(c);
    } finally {
      n.a = n.b = 0;
    }
  }, __wbg_new_with_byte_offset_and_length_b2ec5bf7b2f35743: function(t, e, n) {
    let i = new Uint8Array(_(t), e >>> 0, n >>> 0);
    return s(i);
  }, __wbg_new_with_headers_b74ae836d0e719e7: function() {
    return b(function(t) {
      let e = new Headers(_(t));
      return s(e);
    }, arguments);
  }, __wbg_new_with_length_825018a1616e9e55: function(t) {
    let e = new Uint8Array(t >>> 0);
    return s(e);
  }, __wbg_new_with_opt_buffer_source_and_init_cbf3b8468cedbba9: function() {
    return b(function(t, e) {
      let n = new Response(_(t), _(e));
      return s(n);
    }, arguments);
  }, __wbg_new_with_opt_readable_stream_and_init_15b79ab5fa39d080: function() {
    return b(function(t, e) {
      let n = new Response(_(t), _(e));
      return s(n);
    }, arguments);
  }, __wbg_new_with_opt_str_and_init_a1ea8e111a765950: function() {
    return b(function(t, e, n) {
      let i = new Response(t === 0 ? void 0 : y(t, e), _(n));
      return s(i);
    }, arguments);
  }, __wbg_new_with_str_and_init_b4b54d1a819bc724: function() {
    return b(function(t, e, n) {
      let i = new Request(y(t, e), _(n));
      return s(i);
    }, arguments);
  }, __wbg_next_11b99ee6237339e3: function() {
    return b(function(t) {
      let e = _(t).next();
      return s(e);
    }, arguments);
  }, __wbg_prototypesetcall_d62e5099504357e6: function(t, e, n) {
    Uint8Array.prototype.set.call(q(t, e), _(n));
  }, __wbg_queueMicrotask_0c399741342fb10f: function(t) {
    let e = _(t).queueMicrotask;
    return s(e);
  }, __wbg_queueMicrotask_a082d78ce798393e: function(t) {
    queueMicrotask(_(t));
  }, __wbg_resolve_ae8d83246e5bcc12: function(t) {
    let e = Promise.resolve(_(t));
    return s(e);
  }, __wbg_respond_e286ee502e7cf7e4: function() {
    return b(function(t, e) {
      _(t).respond(e >>> 0);
    }, arguments);
  }, __wbg_setTimeout_b188b3bcc8977c7d: function(t, e) {
    let n = setTimeout(_(t), e);
    return s(n);
  }, __wbg_set_282384002438957f: function(t, e, n) {
    _(t)[e >>> 0] = p(n);
  }, __wbg_set_6be42768c690e380: function(t, e, n) {
    _(t)[p(e)] = p(n);
  }, __wbg_set_7eaa4f96924fd6b3: function() {
    return b(function(t, e, n) {
      return Reflect.set(_(t), _(e), _(n));
    }, arguments);
  }, __wbg_set_8c0b3ffcf05d61c2: function(t, e, n) {
    _(t).set(q(e, n));
  }, __wbg_set_bf7251625df30a02: function(t, e, n) {
    let i = _(t).set(_(e), _(n));
    return s(i);
  }, __wbg_set_body_a3d856b097dfda04: function(t, e) {
    _(t).body = _(e);
  }, __wbg_set_cache_ec7e430c6056ebda: function(t, e) {
    _(t).cache = nt[e];
  }, __wbg_set_credentials_ed63183445882c65: function(t, e) {
    _(t).credentials = rt[e];
  }, __wbg_set_e09648bea3f1af1e: function() {
    return b(function(t, e, n, i, c) {
      _(t).set(y(e, n), y(i, c));
    }, arguments);
  }, __wbg_set_headers_3c8fecc693b75327: function(t, e) {
    _(t).headers = _(e);
  }, __wbg_set_headers_bf56980ea1a65acb: function(t, e) {
    _(t).headers = _(e);
  }, __wbg_set_method_8c015e8bcafd7be1: function(t, e, n) {
    _(t).method = y(e, n);
  }, __wbg_set_mode_5a87f2c809cf37c2: function(t, e) {
    _(t).mode = _t[e];
  }, __wbg_set_signal_0cebecb698f25d21: function(t, e) {
    _(t).signal = _(e);
  }, __wbg_set_status_b80d37d9d23276c4: function(t, e) {
    _(t).status = e;
  }, __wbg_signal_166e1da31adcac18: function(t) {
    let e = _(t).signal;
    return s(e);
  }, __wbg_stack_3b0d974bbf31e44f: function(t, e) {
    let n = _(e).stack, i = m(n, o.__wbindgen_export, o.__wbindgen_export2), c = h;
    a().setInt32(t + 4, c, true), a().setInt32(t + 0, i, true);
  }, __wbg_static_accessor_GLOBAL_8adb955bd33fac2f: function() {
    let t = typeof global > "u" ? null : global;
    return w(t) ? 0 : s(t);
  }, __wbg_static_accessor_GLOBAL_THIS_ad356e0db91c7913: function() {
    let t = typeof globalThis > "u" ? null : globalThis;
    return w(t) ? 0 : s(t);
  }, __wbg_static_accessor_SELF_f207c857566db248: function() {
    let t = typeof self > "u" ? null : self;
    return w(t) ? 0 : s(t);
  }, __wbg_static_accessor_WINDOW_bb9f1ba69d61b386: function() {
    let t = typeof window > "u" ? null : window;
    return w(t) ? 0 : s(t);
  }, __wbg_status_318629ab93a22955: function(t) {
    return _(t).status;
  }, __wbg_stringify_5ae93966a84901ac: function() {
    return b(function(t) {
      let e = JSON.stringify(_(t));
      return s(e);
    }, arguments);
  }, __wbg_text_372f5b91442c50f9: function() {
    return b(function(t) {
      let e = _(t).text();
      return s(e);
    }, arguments);
  }, __wbg_then_098abe61755d12f6: function(t, e) {
    let n = _(t).then(_(e));
    return s(n);
  }, __wbg_then_9e335f6dd892bc11: function(t, e, n) {
    let i = _(t).then(_(e), _(n));
    return s(i);
  }, __wbg_toString_fca8b5e46235cfb4: function(t) {
    let e = _(t).toString();
    return s(e);
  }, __wbg_url_7fefc1820fba4e0c: function(t, e) {
    let n = _(e).url, i = m(n, o.__wbindgen_export, o.__wbindgen_export2), c = h;
    a().setInt32(t + 4, c, true), a().setInt32(t + 0, i, true);
  }, __wbg_url_b6f96880b733816c: function(t, e) {
    let n = _(e).url, i = m(n, o.__wbindgen_export, o.__wbindgen_export2), c = h;
    a().setInt32(t + 4, c, true), a().setInt32(t + 0, i, true);
  }, __wbg_value_21fc78aab0322612: function(t) {
    let e = _(t).value;
    return s(e);
  }, __wbg_view_f68a712e7315f8b2: function(t) {
    let e = _(t).view;
    return w(e) ? 0 : s(e);
  }, __wbindgen_cast_0000000000000001: function(t, e) {
    let n = V(t, e, o.__wasm_bindgen_func_elem_2652, tt);
    return s(n);
  }, __wbindgen_cast_0000000000000002: function(t, e) {
    let n = V(t, e, o.__wasm_bindgen_func_elem_2011, Z);
    return s(n);
  }, __wbindgen_cast_0000000000000003: function(t) {
    return s(t);
  }, __wbindgen_cast_0000000000000004: function(t) {
    return s(t);
  }, __wbindgen_cast_0000000000000005: function(t, e) {
    let n = y(t, e);
    return s(n);
  }, __wbindgen_cast_0000000000000006: function(t) {
    let e = BigInt.asUintN(64, t);
    return s(e);
  }, __wbindgen_object_clone_ref: function(t) {
    let e = _(t);
    return s(e);
  }, __wbindgen_object_drop_ref: function(t) {
    p(t);
  } } };
}
__name(K, "K");
function Z(r, t) {
  o.__wasm_bindgen_func_elem_2012(r, t);
}
__name(Z, "Z");
function tt(r, t, e) {
  try {
    let c = o.__wbindgen_add_to_stack_pointer(-16);
    o.__wasm_bindgen_func_elem_889(c, r, t, s(e));
    var n = a().getInt32(c + 0, true), i = a().getInt32(c + 4, true);
    if (i)
      throw p(n);
  } finally {
    o.__wbindgen_add_to_stack_pointer(16);
  }
}
__name(tt, "tt");
function N(r, t, e, n) {
  o.__wasm_bindgen_func_elem_900(r, t, s(e), s(n));
}
__name(N, "N");
var et = ["bytes"];
var nt = ["default", "no-store", "reload", "no-cache", "force-cache", "only-if-cached"];
var rt = ["omit", "same-origin", "include"];
var _t = ["same-origin", "no-cors", "cors", "navigate"];
var u = 0;
var it = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry(({ ptr: r, instance: t }) => {
  t === u && o.__wbg_containerstartupoptions_free(r >>> 0, 1);
});
var ot = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry(({ ptr: r, instance: t }) => {
  t === u && o.__wbg_intounderlyingbytesource_free(r >>> 0, 1);
});
var st = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry(({ ptr: r, instance: t }) => {
  t === u && o.__wbg_intounderlyingsink_free(r >>> 0, 1);
});
var ct = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry(({ ptr: r, instance: t }) => {
  t === u && o.__wbg_intounderlyingsource_free(r >>> 0, 1);
});
var ut = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry(({ ptr: r, instance: t }) => {
  t === u && o.__wbg_minifyconfig_free(r >>> 0, 1);
});
var ft = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry(({ ptr: r, instance: t }) => {
  t === u && o.__wbg_r2range_free(r >>> 0, 1);
});
function s(r) {
  v === l.length && l.push(l.length + 1);
  let t = v;
  return v = l[t], l[t] = r, t;
}
__name(s, "s");
var $ = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((r) => {
  r.instance === u && r.dtor(r.a, r.b);
});
function L(r) {
  let t = typeof r;
  if (t == "number" || t == "boolean" || r == null)
    return `${r}`;
  if (t == "string")
    return `"${r}"`;
  if (t == "symbol") {
    let i = r.description;
    return i == null ? "Symbol" : `Symbol(${i})`;
  }
  if (t == "function") {
    let i = r.name;
    return typeof i == "string" && i.length > 0 ? `Function(${i})` : "Function";
  }
  if (Array.isArray(r)) {
    let i = r.length, c = "[";
    i > 0 && (c += L(r[0]));
    for (let f = 1; f < i; f++)
      c += ", " + L(r[f]);
    return c += "]", c;
  }
  let e = /\[object ([^\]]+)\]/.exec(toString.call(r)), n;
  if (e && e.length > 1)
    n = e[1];
  else
    return toString.call(r);
  if (n == "Object")
    try {
      return "Object(" + JSON.stringify(r) + ")";
    } catch {
      return "Object";
    }
  return r instanceof Error ? `${r.name}: ${r.message}
${r.stack}` : n;
}
__name(L, "L");
function at(r) {
  r < 1028 || (l[r] = v, v = r);
}
__name(at, "at");
function bt(r, t) {
  r = r >>> 0;
  let e = a(), n = [];
  for (let i = r; i < r + 4 * t; i += 4)
    n.push(p(e.getUint32(i, true)));
  return n;
}
__name(bt, "bt");
function q(r, t) {
  return r = r >>> 0, P().subarray(r / 1, r / 1 + t);
}
__name(q, "q");
var x = null;
function a() {
  return (x === null || x.buffer.detached === true || x.buffer.detached === void 0 && x.buffer !== o.memory.buffer) && (x = new DataView(o.memory.buffer)), x;
}
__name(a, "a");
function y(r, t) {
  return r = r >>> 0, wt(r, t);
}
__name(y, "y");
var A = null;
function P() {
  return (A === null || A.byteLength === 0) && (A = new Uint8Array(o.memory.buffer)), A;
}
__name(P, "P");
function _(r) {
  return l[r];
}
__name(_, "_");
function b(r, t) {
  try {
    return r.apply(this, t);
  } catch (e) {
    o.__wbindgen_export3(s(e));
  }
}
__name(b, "b");
var l = new Array(1024).fill(void 0);
l.push(void 0, null, true, false);
var v = l.length;
function w(r) {
  return r == null;
}
__name(w, "w");
function V(r, t, e, n) {
  let i = { a: r, b: t, cnt: 1, dtor: e, instance: u }, c = /* @__PURE__ */ __name((...f) => {
    if (i.instance !== u)
      throw new Error("Cannot invoke closure from previous WASM instance");
    i.cnt++;
    let g = i.a;
    i.a = 0;
    try {
      return n(g, i.b, ...f);
    } finally {
      i.a = g, c._wbg_cb_unref();
    }
  }, "c");
  return c._wbg_cb_unref = () => {
    --i.cnt === 0 && (i.dtor(i.a, i.b), i.a = 0, $.unregister(i));
  }, $.register(c, i, i), c;
}
__name(V, "V");
function gt(r, t) {
  let e = t(r.length * 4, 4) >>> 0, n = a();
  for (let i = 0; i < r.length; i++)
    n.setUint32(e + 4 * i, s(r[i]), true);
  return h = r.length, e;
}
__name(gt, "gt");
function m(r, t, e) {
  if (e === void 0) {
    let g = O.encode(r), d = t(g.length, 1) >>> 0;
    return P().subarray(d, d + g.length).set(g), h = g.length, d;
  }
  let n = r.length, i = t(n, 1) >>> 0, c = P(), f = 0;
  for (; f < n; f++) {
    let g = r.charCodeAt(f);
    if (g > 127)
      break;
    c[i + f] = g;
  }
  if (f !== n) {
    f !== 0 && (r = r.slice(f)), i = e(i, n, n = f + r.length * 3, 1) >>> 0;
    let g = P().subarray(i + f, i + n), d = O.encodeInto(r, g);
    f += d.written, i = e(i, n, f, 1) >>> 0;
  }
  return h = f, i;
}
__name(m, "m");
function p(r) {
  let t = _(r);
  return at(r), t;
}
__name(p, "p");
var Q = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
Q.decode();
function wt(r, t) {
  return Q.decode(P().subarray(r, r + t));
}
__name(wt, "wt");
var O = new TextEncoder();
"encodeInto" in O || (O.encodeInto = function(r, t) {
  let e = O.encode(r);
  return t.set(e), { read: r.length, written: e.length };
});
var h = 0;
var dt = new WebAssembly.Instance(X, K());
var o = dt.exports;
Error.stackTraceLimit = 100;
var z = false;
function Y() {
  D && D(function(r) {
    let t = new Error("Rust panic: " + r);
    console.error("Critical", t), z = true;
  });
}
__name(Y, "Y");
Y();
var U = 0;
function H() {
  z && (console.log("Reinitializing Wasm application"), J(), z = false, Y(), U++);
}
__name(H, "H");
addEventListener("error", (r) => {
  B(r.error);
});
function B(r) {
  r instanceof WebAssembly.RuntimeError && (console.error("Critical", r), z = true);
}
__name(B, "B");
var M = /* @__PURE__ */ __name(class extends pt {
}, "M");
M.prototype.fetch = function(t) {
  return G.call(this, t, this.env, this.ctx);
};
var ht = { set: (r, t, e, n) => Reflect.set(r.instance, t, e, n), has: (r, t) => Reflect.has(r.instance, t), deleteProperty: (r, t) => Reflect.deleteProperty(r.instance, t), apply: (r, t, e) => Reflect.apply(r.instance, t, e), construct: (r, t, e) => Reflect.construct(r.instance, t, e), getPrototypeOf: (r) => Reflect.getPrototypeOf(r.instance), setPrototypeOf: (r, t) => Reflect.setPrototypeOf(r.instance, t), isExtensible: (r) => Reflect.isExtensible(r.instance), preventExtensions: (r) => Reflect.preventExtensions(r.instance), getOwnPropertyDescriptor: (r, t) => Reflect.getOwnPropertyDescriptor(r.instance, t), defineProperty: (r, t, e) => Reflect.defineProperty(r.instance, t, e), ownKeys: (r) => Reflect.ownKeys(r.instance) };
var I = { construct(r, t, e) {
  try {
    H();
    let n = { instance: Reflect.construct(r, t, e), instanceId: U, ctor: r, args: t, newTarget: e };
    return new Proxy(n, { ...ht, get(i, c, f) {
      i.instanceId !== U && (i.instance = Reflect.construct(i.ctor, i.args, i.newTarget), i.instanceId = U);
      let g = Reflect.get(i.instance, c, f);
      return typeof g != "function" ? g : g.constructor === Function ? new Proxy(g, { apply(d, T, C) {
        H();
        try {
          return d.apply(T, C);
        } catch (W) {
          throw B(W), W;
        }
      } }) : new Proxy(g, { async apply(d, T, C) {
        H();
        try {
          return await d.apply(T, C);
        } catch (W) {
          throw B(W), W;
        }
      } });
    } });
  } catch (n) {
    throw z = true, n;
  }
} };
var xt = new Proxy(M, I);
var vt = new Proxy(R, I);
var It = new Proxy(E, I);
var Rt = new Proxy(j, I);
var Et = new Proxy(F, I);
var jt = new Proxy(S, I);
var Ft = new Proxy(k, I);
export {
  vt as ContainerStartupOptions,
  It as IntoUnderlyingByteSource,
  Rt as IntoUnderlyingSink,
  Et as IntoUnderlyingSource,
  jt as MinifyConfig,
  Ft as R2Range,
  xt as default
};
//# sourceMappingURL=shim.js.map
