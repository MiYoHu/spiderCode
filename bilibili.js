

function uuu(e, t, r) {
    if (r - t < 1)
        return "";
    for (var n, i = null, o = [], a = 0; t < r;)
        (n = e[t++]) < 128 ? o[a++] = n : n > 191 && n < 224 ? o[a++] = (31 & n) << 6 | 63 & e[t++] : n > 239 && n < 365 ? (n = ((7 & n) << 18 | (63 & e[t++]) << 12 | (63 & e[t++]) << 6 | 63 & e[t++]) - 65536,
            o[a++] = 55296 + (n >> 10),
            o[a++] = 56320 + (1023 & n)) : o[a++] = (15 & n) << 12 | (63 & e[t++]) << 6 | 63 & e[t++],
            a > 8191 && ((i || (i = [])).push(String.fromCharCode.apply(String, o)),
                a = 0);
    return i ? (a && i.push(String.fromCharCode.apply(String, o.slice(0, a))),
        i.join("")) : String.fromCharCode.apply(String, o.slice(0, a))
}
function toolsd(e) {
    this.buf = e,
        this.pos = 0,
        this.len = e.length
}
toolsd.create = function (e) {
    if (e instanceof Uint8Array || Array.isArray(e))
        return new toolsd(e);
    throw Error("illegal buffer")
}

toolsd.prototype.uint32 = (l = 4294967295,
    function () {
        if (l = (127 & this.buf[this.pos]) >>> 0,
            this.buf[this.pos++] < 128)
            return l;
        if (l = (l | (127 & this.buf[this.pos]) << 7) >>> 0,
            this.buf[this.pos++] < 128)
            return l;
        if (l = (l | (127 & this.buf[this.pos]) << 14) >>> 0,
            this.buf[this.pos++] < 128)
            return l;
        if (l = (l | (127 & this.buf[this.pos]) << 21) >>> 0,
            this.buf[this.pos++] < 128)
            return l;
        if (l = (l | (15 & this.buf[this.pos]) << 28) >>> 0,
            this.buf[this.pos++] < 128)
            return l;
        if ((this.pos += 5) > this.len)
            throw this.pos = this.len,
            s(this, 10);
        return l
    }
)
toolsd.prototype._slice = Uint8Array.prototype.subarray || Uint8Array.prototype.slice
toolsd.prototype.skip = function (e) {
    if ("number" == typeof e) {
        if (this.pos + e > this.len)
            throw s(this, e);
        this.pos += e
    } else
        do {
            if (this.pos >= this.len)
                throw s(this)
        } while (128 & this.buf[this.pos++]);
    return this
}


toolsd.prototype.int32 = function () {
    return 0 | this.uint32()
}
    ,
    toolsd.prototype.sint32 = function () {
        var e = this.uint32();
        return e >>> 1 ^ -(1 & e) | 0
    }
    ,
    toolsd.prototype.bool = function () {
        return 0 !== this.uint32()
    }


toolsd.prototype.bytes = function () {
    var e = this.uint32()
        , t = this.pos
        , r = this.pos + e;
    if (r > this.len)
        throw s(this, e);
    return this.pos += e,
        Array.isArray(this.buf) ? this.buf.slice(t, r) : t === r ? new this.buf.constructor(0) : this._slice.call(this.buf, t, r)
}
    ,
    toolsd.prototype.string = function () {
        var e = this.bytes();
        return uuu(e, 0, e.length)
    }

toolsd.prototype.skipType = function (e) {
    switch (e) {
        case 0:
            this.skip();
            break;
        case 1:
            this.skip(8);
            break;
        case 2:
            this.skip(this.uint32());
            break;
        case 3:
            for (; 4 != (e = 7 & this.uint32());)
                this.skipType(e);
            break;
        case 5:
            this.skip(4);
            break;
        default:
            throw Error("invalid wire type " + e + " at offset " + this.pos)
    }
    return this
}



function i(e, t) {
    this.lo = e >>> 0,
        this.hi = t >>> 0
}
var o = i.zero = new i(0, 0);
o.toNumber = function () {
    return 0
}
    ,
    o.zzEncode = o.zzDecode = function () {
        return this
    }
    ,
    o.length = function () {
        return 1
    }
    ;
var a = i.zeroHash = "\0\0\0\0\0\0\0\0";
i.fromNumber = function (e) {
    if (0 === e)
        return o;
    var t = e < 0;
    t && (e = -e);
    var r = e >>> 0
        , n = (e - r) / 4294967296 >>> 0;
    return t && (n = ~n >>> 0,
        r = ~r >>> 0,
        ++r > 4294967295 && (r = 0,
            ++n > 4294967295 && (n = 0))),
        new i(r, n)
}
    ,
    i.from = function (e) {
        if ("number" == typeof e)
            return i.fromNumber(e);
        if (n.isString(e)) {
            if (!n.Long)
                return i.fromNumber(parseInt(e, 10));
            e = n.Long.fromString(e)
        }
        return e.low || e.high ? new i(e.low >>> 0, e.high >>> 0) : o
    }
    ,
    i.prototype.toNumber = function (e) {
        if (!e && this.hi >>> 31) {
            var t = 1 + ~this.lo >>> 0
                , r = ~this.hi >>> 0;
            return t || (r = r + 1 >>> 0),
                -(t + 4294967296 * r)
        }
        return this.lo + 4294967296 * this.hi
    }
    ,
    i.prototype.toLong = function (e) {
        return n.Long ? new n.Long(0 | this.lo, 0 | this.hi, Boolean(e)) : {
            low: 0 | this.lo,
            high: 0 | this.hi,
            unsigned: Boolean(e)
        }
    }
    ;
var s = String.prototype.charCodeAt;
i.fromHash = function (e) {
    return e === a ? o : new i((s.call(e, 0) | s.call(e, 1) << 8 | s.call(e, 2) << 16 | s.call(e, 3) << 24) >>> 0, (s.call(e, 4) | s.call(e, 5) << 8 | s.call(e, 6) << 16 | s.call(e, 7) << 24) >>> 0)
}
    ,
    i.prototype.toHash = function () {
        return String.fromCharCode(255 & this.lo, this.lo >>> 8 & 255, this.lo >>> 16 & 255, this.lo >>> 24, 255 & this.hi, this.hi >>> 8 & 255, this.hi >>> 16 & 255, this.hi >>> 24)
    }
    ,
    i.prototype.zzEncode = function () {
        var e = this.hi >> 31;
        return this.hi = ((this.hi << 1 | this.lo >>> 31) ^ e) >>> 0,
            this.lo = (this.lo << 1 ^ e) >>> 0,
            this
    }
    ,
    i.prototype.zzDecode = function () {
        var e = -(1 & this.lo);
        return this.lo = ((this.lo >>> 1 | this.hi << 31) ^ e) >>> 0,
            this.hi = (this.hi >>> 1 ^ e) >>> 0,
            this
    }
    ,
    i.prototype.length = function () {
        var e = this.lo
            , t = (this.lo >>> 28 | this.hi << 4) >>> 0
            , r = this.hi >>> 24;
        return 0 === r ? 0 === t ? e < 16384 ? e < 128 ? 1 : 2 : e < 2097152 ? 3 : 4 : t < 16384 ? t < 128 ? 5 : 6 : t < 2097152 ? 7 : 8 : r < 128 ? 9 : 10
    }








function d() {
    var e = new i(0, 0)
        , t = 0;
    if (!(this.len - this.pos > 4)) {
        for (; t < 3; ++t) {
            if (this.pos >= this.len)
                throw s(this);
            if (e.lo = (e.lo | (127 & this.buf[this.pos]) << 7 * t) >>> 0,
                this.buf[this.pos++] < 128)
                return e
        }
        return e.lo = (e.lo | (127 & this.buf[this.pos++]) << 7 * t) >>> 0,
            e
    }
    for (; t < 4; ++t)
        if (e.lo = (e.lo | (127 & this.buf[this.pos]) << 7 * t) >>> 0,
            this.buf[this.pos++] < 128)
            return e;
    if (e.lo = (e.lo | (127 & this.buf[this.pos]) << 28) >>> 0,
        e.hi = (e.hi | (127 & this.buf[this.pos]) >> 4) >>> 0,
        this.buf[this.pos++] < 128)
        return e;
    if (t = 0,
        this.len - this.pos > 4) {
        for (; t < 5; ++t)
            if (e.hi = (e.hi | (127 & this.buf[this.pos]) << 7 * t + 3) >>> 0,
                this.buf[this.pos++] < 128)
                return e
    } else
        for (; t < 5; ++t) {
            if (this.pos >= this.len)
                throw s(this);
            if (e.hi = (e.hi | (127 & this.buf[this.pos]) << 7 * t + 3) >>> 0,
                this.buf[this.pos++] < 128)
                return e
        }
    throw Error("invalid varint encoding")
}





toolsd.prototype.int64 = function () {
    return d.call(this)['toNumber'](!1)
},
    toolsd.prototype.uint64 = function () {
        return d.call(this)['toNumber'](!0)
    },
    toolsd.prototype.sint64 = function () {
        return d.call(this).zzDecode()[t](!1)
    },
    toolsd.prototype.fixed64 = function () {
        return p.call(this)['toNumber'](!0)
    },
    toolsd.prototype.sfixed64 = function () {
        return p.call(this)['toNumber'](!1)
    }






function DanmakuElem$decode(r, l) {
    if (!(r instanceof toolsd))
        r = toolsd.create(r)
    var c = l === undefined ? r.len : r.pos + l, m = {};
    while (r.pos < c) {
        var t = r.uint32()
        switch (t >>> 3) {
            case 2:
                m.progress = r.int32()
                break
            case 3:
                m.mode = r.int32()
                break
            case 4:
                m.fontsize = r.int32()
                break
            case 5:
                m.color = r.uint32()
                break
            case 6:
                m.midHash = r.string()
                break
            case 7:
                m.content = r.string()
                break
            case 8:
                m.ctime = r.int64()
                break
            case 9:
                m.weight = r.int32()
                break
            case 10:
                m.action = r.string()
                break
            case 11:
                m.pool = r.int32()
                break
            case 12:
                m.dmid = r.string()
                break
            case 13:
                m.attr = r.int32()
                break
            case 22:
                m.animation = r.string()
                break
            default:
                r.skipType(t & 7)
                break
        }
    }
    return m
}
function DmSegMobileReply$decode(r, l) {
    if (!(r instanceof toolsd))
        r = toolsd.create(r)
    var c = l === undefined ? r.len : r.pos + l, m = { elems: new Array() };
    while (r.pos < c) {
        var t = r.uint32()
        switch (t >>> 3) {
            case 1:
                if (!(m.elems && m.elems.length))
                    m.elems = []
                m.elems.push(DanmakuElem$decode(r, r.uint32()))
                break
            default:
                r.skipType(t & 7)
                break
        }
    }
    return m
}
function getdanmu(aa) {

    return DmSegMobileReply$decode(aa);
}
getdanmu(/*https://api.bilibili.com/x/v2/dm/web/history/seg.so?type=1&oid=182078162&date=2022-10-09*/)


