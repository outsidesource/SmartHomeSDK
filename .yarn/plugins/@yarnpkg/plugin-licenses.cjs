/* eslint-disable */
//prettier-ignore
module.exports = {
name: "@yarnpkg/plugin-licenses",
factory: function (require) {
"use strict";var plugin=(()=>{var ie=Object.create;var et=Object.defineProperty;var se=Object.getOwnPropertyDescriptor;var ne=Object.getOwnPropertyNames;var re=Object.getPrototypeOf,oe=Object.prototype.hasOwnProperty;var v=(i=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(i,{get:(t,e)=>(typeof require<"u"?require:t)[e]}):i)(function(i){if(typeof require<"u")return require.apply(this,arguments);throw new Error('Dynamic require of "'+i+'" is not supported')});var X=(i,t)=>()=>(t||i((t={exports:{}}).exports,t),t.exports),it=(i,t)=>{for(var e in t)et(i,e,{get:t[e],enumerable:!0})},Tt=(i,t,e,s)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of ne(t))!oe.call(i,n)&&n!==e&&et(i,n,{get:()=>t[n],enumerable:!(s=se(t,n))||s.enumerable});return i};var ae=(i,t,e)=>(e=i!=null?ie(re(i)):{},Tt(t||!i||!i.__esModule?et(e,"default",{value:i,enumerable:!0}):e,i)),le=i=>Tt(et({},"__esModule",{value:!0}),i);var At=(i,t,e)=>{if(!t.has(i))throw TypeError("Cannot "+e)};var O=(i,t,e)=>(At(i,t,"read from private field"),e?e.call(i):t.get(i)),st=(i,t,e)=>{if(t.has(i))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(i):t.set(i,e)};var x=(i,t,e)=>(At(i,t,"access private method"),e);var Et=X((je,Ot)=>{var Q=typeof performance=="object"&&performance&&typeof performance.now=="function"?performance:Date,ce=typeof AbortController=="function",nt=ce?AbortController:class{constructor(){this.signal=new _t}abort(t=new Error("This operation was aborted")){this.signal.reason=this.signal.reason||t,this.signal.aborted=!0,this.signal.dispatchEvent({type:"abort",target:this.signal})}},he=typeof AbortSignal=="function",de=typeof nt.AbortSignal=="function",_t=he?AbortSignal:de?nt.AbortController:class{constructor(){this.reason=void 0,this.aborted=!1,this._listeners=[]}dispatchEvent(t){t.type==="abort"&&(this.aborted=!0,this.onabort(t),this._listeners.forEach(e=>e(t),this))}onabort(){}addEventListener(t,e){t==="abort"&&this._listeners.push(e)}removeEventListener(t,e){t==="abort"&&(this._listeners=this._listeners.filter(s=>s!==e))}},gt=new Set,pt=(i,t)=>{let e=`LRU_CACHE_OPTION_${i}`;rt(e)&&yt(e,`${i} option`,`options.${t}`,F)},ut=(i,t)=>{let e=`LRU_CACHE_METHOD_${i}`;if(rt(e)){let{prototype:s}=F,{get:n}=Object.getOwnPropertyDescriptor(s,i);yt(e,`${i} method`,`cache.${t}()`,n)}},fe=(i,t)=>{let e=`LRU_CACHE_PROPERTY_${i}`;if(rt(e)){let{prototype:s}=F,{get:n}=Object.getOwnPropertyDescriptor(s,i);yt(e,`${i} property`,`cache.${t}`,n)}},zt=(...i)=>{typeof process=="object"&&process&&typeof process.emitWarning=="function"?process.emitWarning(...i):console.error(...i)},rt=i=>!gt.has(i),yt=(i,t,e,s)=>{gt.add(i);let n=`The ${t} is deprecated. Please use ${e} instead.`;zt(n,"DeprecationWarning",i,s)},E=i=>i&&i===Math.floor(i)&&i>0&&isFinite(i),Ft=i=>E(i)?i<=Math.pow(2,8)?Uint8Array:i<=Math.pow(2,16)?Uint16Array:i<=Math.pow(2,32)?Uint32Array:i<=Number.MAX_SAFE_INTEGER?N:null:null,N=class extends Array{constructor(t){super(t),this.fill(0)}},mt=class{constructor(t){if(t===0)return[];let e=Ft(t);this.heap=new e(t),this.length=0}push(t){this.heap[this.length++]=t}pop(){return this.heap[--this.length]}},F=class{constructor(t={}){let{max:e=0,ttl:s,ttlResolution:n=1,ttlAutopurge:r,updateAgeOnGet:o,updateAgeOnHas:a,allowStale:d,dispose:c,disposeAfter:l,noDisposeOnSet:u,noUpdateTTL:h,maxSize:f=0,maxEntrySize:y=0,sizeCalculation:p,fetchMethod:m,fetchContext:L,noDeleteOnFetchRejection:k,noDeleteOnStaleGet:w,allowStaleOnFetchRejection:A,allowStaleOnFetchAbort:W,ignoreFetchAbort:z}=t,{length:D,maxAge:J,stale:K}=t instanceof F?{}:t;if(e!==0&&!E(e))throw new TypeError("max option must be a nonnegative integer");let dt=e?Ft(e):Array;if(!dt)throw new Error("invalid max value: "+e);if(this.max=e,this.maxSize=f,this.maxEntrySize=y||this.maxSize,this.sizeCalculation=p||D,this.sizeCalculation){if(!this.maxSize&&!this.maxEntrySize)throw new TypeError("cannot set sizeCalculation without setting maxSize or maxEntrySize");if(typeof this.sizeCalculation!="function")throw new TypeError("sizeCalculation set to non-function")}if(this.fetchMethod=m||null,this.fetchMethod&&typeof this.fetchMethod!="function")throw new TypeError("fetchMethod must be a function if specified");if(this.fetchContext=L,!this.fetchMethod&&L!==void 0)throw new TypeError("cannot set fetchContext without fetchMethod");if(this.keyMap=new Map,this.keyList=new Array(e).fill(null),this.valList=new Array(e).fill(null),this.next=new dt(e),this.prev=new dt(e),this.head=0,this.tail=0,this.free=new mt(e),this.initialFill=1,this.size=0,typeof c=="function"&&(this.dispose=c),typeof l=="function"?(this.disposeAfter=l,this.disposed=[]):(this.disposeAfter=null,this.disposed=null),this.noDisposeOnSet=!!u,this.noUpdateTTL=!!h,this.noDeleteOnFetchRejection=!!k,this.allowStaleOnFetchRejection=!!A,this.allowStaleOnFetchAbort=!!W,this.ignoreFetchAbort=!!z,this.maxEntrySize!==0){if(this.maxSize!==0&&!E(this.maxSize))throw new TypeError("maxSize must be a positive integer if specified");if(!E(this.maxEntrySize))throw new TypeError("maxEntrySize must be a positive integer if specified");this.initializeSizeTracking()}if(this.allowStale=!!d||!!K,this.noDeleteOnStaleGet=!!w,this.updateAgeOnGet=!!o,this.updateAgeOnHas=!!a,this.ttlResolution=E(n)||n===0?n:1,this.ttlAutopurge=!!r,this.ttl=s||J||0,this.ttl){if(!E(this.ttl))throw new TypeError("ttl must be a positive integer if specified");this.initializeTTLTracking()}if(this.max===0&&this.ttl===0&&this.maxSize===0)throw new TypeError("At least one of max, maxSize, or ttl is required");if(!this.ttlAutopurge&&!this.max&&!this.maxSize){let ft="LRU_CACHE_UNBOUNDED";rt(ft)&&(gt.add(ft),zt("TTL caching without ttlAutopurge, max, or maxSize can result in unbounded memory consumption.","UnboundedCacheWarning",ft,F))}K&&pt("stale","allowStale"),J&&pt("maxAge","ttl"),D&&pt("length","sizeCalculation")}getRemainingTTL(t){return this.has(t,{updateAgeOnHas:!1})?1/0:0}initializeTTLTracking(){this.ttls=new N(this.max),this.starts=new N(this.max),this.setItemTTL=(s,n,r=Q.now())=>{if(this.starts[s]=n!==0?r:0,this.ttls[s]=n,n!==0&&this.ttlAutopurge){let o=setTimeout(()=>{this.isStale(s)&&this.delete(this.keyList[s])},n+1);o.unref&&o.unref()}},this.updateItemAge=s=>{this.starts[s]=this.ttls[s]!==0?Q.now():0},this.statusTTL=(s,n)=>{s&&(s.ttl=this.ttls[n],s.start=this.starts[n],s.now=t||e(),s.remainingTTL=s.now+s.ttl-s.start)};let t=0,e=()=>{let s=Q.now();if(this.ttlResolution>0){t=s;let n=setTimeout(()=>t=0,this.ttlResolution);n.unref&&n.unref()}return s};this.getRemainingTTL=s=>{let n=this.keyMap.get(s);return n===void 0?0:this.ttls[n]===0||this.starts[n]===0?1/0:this.starts[n]+this.ttls[n]-(t||e())},this.isStale=s=>this.ttls[s]!==0&&this.starts[s]!==0&&(t||e())-this.starts[s]>this.ttls[s]}updateItemAge(t){}statusTTL(t,e){}setItemTTL(t,e,s){}isStale(t){return!1}initializeSizeTracking(){this.calculatedSize=0,this.sizes=new N(this.max),this.removeItemSize=t=>{this.calculatedSize-=this.sizes[t],this.sizes[t]=0},this.requireSize=(t,e,s,n)=>{if(this.isBackgroundFetch(e))return 0;if(!E(s))if(n){if(typeof n!="function")throw new TypeError("sizeCalculation must be a function");if(s=n(e,t),!E(s))throw new TypeError("sizeCalculation return invalid (expect positive integer)")}else throw new TypeError("invalid size value (must be positive integer). When maxSize or maxEntrySize is used, sizeCalculation or size must be set.");return s},this.addItemSize=(t,e,s)=>{if(this.sizes[t]=e,this.maxSize){let n=this.maxSize-this.sizes[t];for(;this.calculatedSize>n;)this.evict(!0)}this.calculatedSize+=this.sizes[t],s&&(s.entrySize=e,s.totalCalculatedSize=this.calculatedSize)}}removeItemSize(t){}addItemSize(t,e){}requireSize(t,e,s,n){if(s||n)throw new TypeError("cannot set size without setting maxSize or maxEntrySize on cache")}*indexes({allowStale:t=this.allowStale}={}){if(this.size)for(let e=this.tail;!(!this.isValidIndex(e)||((t||!this.isStale(e))&&(yield e),e===this.head));)e=this.prev[e]}*rindexes({allowStale:t=this.allowStale}={}){if(this.size)for(let e=this.head;!(!this.isValidIndex(e)||((t||!this.isStale(e))&&(yield e),e===this.tail));)e=this.next[e]}isValidIndex(t){return t!==void 0&&this.keyMap.get(this.keyList[t])===t}*entries(){for(let t of this.indexes())this.valList[t]!==void 0&&this.keyList[t]!==void 0&&!this.isBackgroundFetch(this.valList[t])&&(yield[this.keyList[t],this.valList[t]])}*rentries(){for(let t of this.rindexes())this.valList[t]!==void 0&&this.keyList[t]!==void 0&&!this.isBackgroundFetch(this.valList[t])&&(yield[this.keyList[t],this.valList[t]])}*keys(){for(let t of this.indexes())this.keyList[t]!==void 0&&!this.isBackgroundFetch(this.valList[t])&&(yield this.keyList[t])}*rkeys(){for(let t of this.rindexes())this.keyList[t]!==void 0&&!this.isBackgroundFetch(this.valList[t])&&(yield this.keyList[t])}*values(){for(let t of this.indexes())this.valList[t]!==void 0&&!this.isBackgroundFetch(this.valList[t])&&(yield this.valList[t])}*rvalues(){for(let t of this.rindexes())this.valList[t]!==void 0&&!this.isBackgroundFetch(this.valList[t])&&(yield this.valList[t])}[Symbol.iterator](){return this.entries()}find(t,e){for(let s of this.indexes()){let n=this.valList[s],r=this.isBackgroundFetch(n)?n.__staleWhileFetching:n;if(r!==void 0&&t(r,this.keyList[s],this))return this.get(this.keyList[s],e)}}forEach(t,e=this){for(let s of this.indexes()){let n=this.valList[s],r=this.isBackgroundFetch(n)?n.__staleWhileFetching:n;r!==void 0&&t.call(e,r,this.keyList[s],this)}}rforEach(t,e=this){for(let s of this.rindexes()){let n=this.valList[s],r=this.isBackgroundFetch(n)?n.__staleWhileFetching:n;r!==void 0&&t.call(e,r,this.keyList[s],this)}}get prune(){return ut("prune","purgeStale"),this.purgeStale}purgeStale(){let t=!1;for(let e of this.rindexes({allowStale:!0}))this.isStale(e)&&(this.delete(this.keyList[e]),t=!0);return t}dump(){let t=[];for(let e of this.indexes({allowStale:!0})){let s=this.keyList[e],n=this.valList[e],r=this.isBackgroundFetch(n)?n.__staleWhileFetching:n;if(r===void 0)continue;let o={value:r};if(this.ttls){o.ttl=this.ttls[e];let a=Q.now()-this.starts[e];o.start=Math.floor(Date.now()-a)}this.sizes&&(o.size=this.sizes[e]),t.unshift([s,o])}return t}load(t){this.clear();for(let[e,s]of t){if(s.start){let n=Date.now()-s.start;s.start=Q.now()-n}this.set(e,s.value,s)}}dispose(t,e,s){}set(t,e,{ttl:s=this.ttl,start:n,noDisposeOnSet:r=this.noDisposeOnSet,size:o=0,sizeCalculation:a=this.sizeCalculation,noUpdateTTL:d=this.noUpdateTTL,status:c}={}){if(o=this.requireSize(t,e,o,a),this.maxEntrySize&&o>this.maxEntrySize)return c&&(c.set="miss",c.maxEntrySizeExceeded=!0),this.delete(t),this;let l=this.size===0?void 0:this.keyMap.get(t);if(l===void 0)l=this.newIndex(),this.keyList[l]=t,this.valList[l]=e,this.keyMap.set(t,l),this.next[this.tail]=l,this.prev[l]=this.tail,this.tail=l,this.size++,this.addItemSize(l,o,c),c&&(c.set="add"),d=!1;else{this.moveToTail(l);let u=this.valList[l];if(e!==u){if(this.isBackgroundFetch(u)?u.__abortController.abort(new Error("replaced")):r||(this.dispose(u,t,"set"),this.disposeAfter&&this.disposed.push([u,t,"set"])),this.removeItemSize(l),this.valList[l]=e,this.addItemSize(l,o,c),c){c.set="replace";let h=u&&this.isBackgroundFetch(u)?u.__staleWhileFetching:u;h!==void 0&&(c.oldValue=h)}}else c&&(c.set="update")}if(s!==0&&this.ttl===0&&!this.ttls&&this.initializeTTLTracking(),d||this.setItemTTL(l,s,n),this.statusTTL(c,l),this.disposeAfter)for(;this.disposed.length;)this.disposeAfter(...this.disposed.shift());return this}newIndex(){return this.size===0?this.tail:this.size===this.max&&this.max!==0?this.evict(!1):this.free.length!==0?this.free.pop():this.initialFill++}pop(){if(this.size){let t=this.valList[this.head];return this.evict(!0),t}}evict(t){let e=this.head,s=this.keyList[e],n=this.valList[e];return this.isBackgroundFetch(n)?n.__abortController.abort(new Error("evicted")):(this.dispose(n,s,"evict"),this.disposeAfter&&this.disposed.push([n,s,"evict"])),this.removeItemSize(e),t&&(this.keyList[e]=null,this.valList[e]=null,this.free.push(e)),this.head=this.next[e],this.keyMap.delete(s),this.size--,e}has(t,{updateAgeOnHas:e=this.updateAgeOnHas,status:s}={}){let n=this.keyMap.get(t);if(n!==void 0)if(this.isStale(n))s&&(s.has="stale",this.statusTTL(s,n));else return e&&this.updateItemAge(n),s&&(s.has="hit"),this.statusTTL(s,n),!0;else s&&(s.has="miss");return!1}peek(t,{allowStale:e=this.allowStale}={}){let s=this.keyMap.get(t);if(s!==void 0&&(e||!this.isStale(s))){let n=this.valList[s];return this.isBackgroundFetch(n)?n.__staleWhileFetching:n}}backgroundFetch(t,e,s,n){let r=e===void 0?void 0:this.valList[e];if(this.isBackgroundFetch(r))return r;let o=new nt;s.signal&&s.signal.addEventListener("abort",()=>o.abort(s.signal.reason));let a={signal:o.signal,options:s,context:n},d=(f,y=!1)=>{let{aborted:p}=o.signal,m=s.ignoreFetchAbort&&f!==void 0;return s.status&&(p&&!y?(s.status.fetchAborted=!0,s.status.fetchError=o.signal.reason,m&&(s.status.fetchAbortIgnored=!0)):s.status.fetchResolved=!0),p&&!m&&!y?l(o.signal.reason):(this.valList[e]===h&&(f===void 0?h.__staleWhileFetching?this.valList[e]=h.__staleWhileFetching:this.delete(t):(s.status&&(s.status.fetchUpdated=!0),this.set(t,f,a.options))),f)},c=f=>(s.status&&(s.status.fetchRejected=!0,s.status.fetchError=f),l(f)),l=f=>{let{aborted:y}=o.signal,p=y&&s.allowStaleOnFetchAbort,m=p||s.allowStaleOnFetchRejection,L=m||s.noDeleteOnFetchRejection;if(this.valList[e]===h&&(!L||h.__staleWhileFetching===void 0?this.delete(t):p||(this.valList[e]=h.__staleWhileFetching)),m)return s.status&&h.__staleWhileFetching!==void 0&&(s.status.returnedStale=!0),h.__staleWhileFetching;if(h.__returned===h)throw f},u=(f,y)=>{this.fetchMethod(t,r,a).then(p=>f(p),y),o.signal.addEventListener("abort",()=>{(!s.ignoreFetchAbort||s.allowStaleOnFetchAbort)&&(f(),s.allowStaleOnFetchAbort&&(f=p=>d(p,!0)))})};s.status&&(s.status.fetchDispatched=!0);let h=new Promise(u).then(d,c);return h.__abortController=o,h.__staleWhileFetching=r,h.__returned=null,e===void 0?(this.set(t,h,{...a.options,status:void 0}),e=this.keyMap.get(t)):this.valList[e]=h,h}isBackgroundFetch(t){return t&&typeof t=="object"&&typeof t.then=="function"&&Object.prototype.hasOwnProperty.call(t,"__staleWhileFetching")&&Object.prototype.hasOwnProperty.call(t,"__returned")&&(t.__returned===t||t.__returned===null)}async fetch(t,{allowStale:e=this.allowStale,updateAgeOnGet:s=this.updateAgeOnGet,noDeleteOnStaleGet:n=this.noDeleteOnStaleGet,ttl:r=this.ttl,noDisposeOnSet:o=this.noDisposeOnSet,size:a=0,sizeCalculation:d=this.sizeCalculation,noUpdateTTL:c=this.noUpdateTTL,noDeleteOnFetchRejection:l=this.noDeleteOnFetchRejection,allowStaleOnFetchRejection:u=this.allowStaleOnFetchRejection,ignoreFetchAbort:h=this.ignoreFetchAbort,allowStaleOnFetchAbort:f=this.allowStaleOnFetchAbort,fetchContext:y=this.fetchContext,forceRefresh:p=!1,status:m,signal:L}={}){if(!this.fetchMethod)return m&&(m.fetch="get"),this.get(t,{allowStale:e,updateAgeOnGet:s,noDeleteOnStaleGet:n,status:m});let k={allowStale:e,updateAgeOnGet:s,noDeleteOnStaleGet:n,ttl:r,noDisposeOnSet:o,size:a,sizeCalculation:d,noUpdateTTL:c,noDeleteOnFetchRejection:l,allowStaleOnFetchRejection:u,allowStaleOnFetchAbort:f,ignoreFetchAbort:h,status:m,signal:L},w=this.keyMap.get(t);if(w===void 0){m&&(m.fetch="miss");let A=this.backgroundFetch(t,w,k,y);return A.__returned=A}else{let A=this.valList[w];if(this.isBackgroundFetch(A)){let K=e&&A.__staleWhileFetching!==void 0;return m&&(m.fetch="inflight",K&&(m.returnedStale=!0)),K?A.__staleWhileFetching:A.__returned=A}let W=this.isStale(w);if(!p&&!W)return m&&(m.fetch="hit"),this.moveToTail(w),s&&this.updateItemAge(w),this.statusTTL(m,w),A;let z=this.backgroundFetch(t,w,k,y),D=z.__staleWhileFetching!==void 0,J=D&&e;return m&&(m.fetch=D&&W?"stale":"refresh",J&&W&&(m.returnedStale=!0)),J?z.__staleWhileFetching:z.__returned=z}}get(t,{allowStale:e=this.allowStale,updateAgeOnGet:s=this.updateAgeOnGet,noDeleteOnStaleGet:n=this.noDeleteOnStaleGet,status:r}={}){let o=this.keyMap.get(t);if(o!==void 0){let a=this.valList[o],d=this.isBackgroundFetch(a);return this.statusTTL(r,o),this.isStale(o)?(r&&(r.get="stale"),d?(r&&(r.returnedStale=e&&a.__staleWhileFetching!==void 0),e?a.__staleWhileFetching:void 0):(n||this.delete(t),r&&(r.returnedStale=e),e?a:void 0)):(r&&(r.get="hit"),d?a.__staleWhileFetching:(this.moveToTail(o),s&&this.updateItemAge(o),a))}else r&&(r.get="miss")}connect(t,e){this.prev[e]=t,this.next[t]=e}moveToTail(t){t!==this.tail&&(t===this.head?this.head=this.next[t]:this.connect(this.prev[t],this.next[t]),this.connect(this.tail,t),this.tail=t)}get del(){return ut("del","delete"),this.delete}delete(t){let e=!1;if(this.size!==0){let s=this.keyMap.get(t);if(s!==void 0)if(e=!0,this.size===1)this.clear();else{this.removeItemSize(s);let n=this.valList[s];this.isBackgroundFetch(n)?n.__abortController.abort(new Error("deleted")):(this.dispose(n,t,"delete"),this.disposeAfter&&this.disposed.push([n,t,"delete"])),this.keyMap.delete(t),this.keyList[s]=null,this.valList[s]=null,s===this.tail?this.tail=this.prev[s]:s===this.head?this.head=this.next[s]:(this.next[this.prev[s]]=this.next[s],this.prev[this.next[s]]=this.prev[s]),this.size--,this.free.push(s)}}if(this.disposed)for(;this.disposed.length;)this.disposeAfter(...this.disposed.shift());return e}clear(){for(let t of this.rindexes({allowStale:!0})){let e=this.valList[t];if(this.isBackgroundFetch(e))e.__abortController.abort(new Error("deleted"));else{let s=this.keyList[t];this.dispose(e,s,"delete"),this.disposeAfter&&this.disposed.push([e,s,"delete"])}}if(this.keyMap.clear(),this.valList.fill(null),this.keyList.fill(null),this.ttls&&(this.ttls.fill(0),this.starts.fill(0)),this.sizes&&this.sizes.fill(0),this.head=0,this.tail=0,this.initialFill=1,this.free.length=0,this.calculatedSize=0,this.size=0,this.disposed)for(;this.disposed.length;)this.disposeAfter(...this.disposed.shift())}get reset(){return ut("reset","clear"),this.clear}get length(){return fe("length","size"),this.size}static get AbortController(){return nt}static get AbortSignal(){return _t}};Ot.exports=F});var Mt=X((Re,Ct)=>{"use strict";var g=(...i)=>i.every(t=>t)?i.join(""):"",$=i=>i?encodeURIComponent(i):"",It=i=>i.toLowerCase().replace(/^\W+|\/|\W+$/g,"").replace(/\W+/g,"-"),pe={sshtemplate:({domain:i,user:t,project:e,committish:s})=>`git@${i}:${t}/${e}.git${g("#",s)}`,sshurltemplate:({domain:i,user:t,project:e,committish:s})=>`git+ssh://git@${i}/${t}/${e}.git${g("#",s)}`,edittemplate:({domain:i,user:t,project:e,committish:s,editpath:n,path:r})=>`https://${i}/${t}/${e}${g("/",n,"/",$(s||"HEAD"),"/",r)}`,browsetemplate:({domain:i,user:t,project:e,committish:s,treepath:n})=>`https://${i}/${t}/${e}${g("/",n,"/",$(s))}`,browsetreetemplate:({domain:i,user:t,project:e,committish:s,treepath:n,path:r,fragment:o,hashformat:a})=>`https://${i}/${t}/${e}/${n}/${$(s||"HEAD")}/${r}${g("#",a(o||""))}`,browseblobtemplate:({domain:i,user:t,project:e,committish:s,blobpath:n,path:r,fragment:o,hashformat:a})=>`https://${i}/${t}/${e}/${n}/${$(s||"HEAD")}/${r}${g("#",a(o||""))}`,docstemplate:({domain:i,user:t,project:e,treepath:s,committish:n})=>`https://${i}/${t}/${e}${g("/",s,"/",$(n))}#readme`,httpstemplate:({auth:i,domain:t,user:e,project:s,committish:n})=>`git+https://${g(i,"@")}${t}/${e}/${s}.git${g("#",n)}`,filetemplate:({domain:i,user:t,project:e,committish:s,path:n})=>`https://${i}/${t}/${e}/raw/${$(s||"HEAD")}/${n}`,shortcuttemplate:({type:i,user:t,project:e,committish:s})=>`${i}:${t}/${e}${g("#",s)}`,pathtemplate:({user:i,project:t,committish:e})=>`${i}/${t}${g("#",e)}`,bugstemplate:({domain:i,user:t,project:e})=>`https://${i}/${t}/${e}/issues`,hashformat:It},I={};I.github={protocols:["git:","http:","git+ssh:","git+https:","ssh:","https:"],domain:"github.com",treepath:"tree",blobpath:"blob",editpath:"edit",filetemplate:({auth:i,user:t,project:e,committish:s,path:n})=>`https://${g(i,"@")}raw.githubusercontent.com/${t}/${e}/${$(s||"HEAD")}/${n}`,gittemplate:({auth:i,domain:t,user:e,project:s,committish:n})=>`git://${g(i,"@")}${t}/${e}/${s}.git${g("#",n)}`,tarballtemplate:({domain:i,user:t,project:e,committish:s})=>`https://codeload.${i}/${t}/${e}/tar.gz/${$(s||"HEAD")}`,extract:i=>{let[,t,e,s,n]=i.pathname.split("/",5);if(!(s&&s!=="tree")&&(s||(n=i.hash.slice(1)),e&&e.endsWith(".git")&&(e=e.slice(0,-4)),!(!t||!e)))return{user:t,project:e,committish:n}}};I.bitbucket={protocols:["git+ssh:","git+https:","ssh:","https:"],domain:"bitbucket.org",treepath:"src",blobpath:"src",editpath:"?mode=edit",edittemplate:({domain:i,user:t,project:e,committish:s,treepath:n,path:r,editpath:o})=>`https://${i}/${t}/${e}${g("/",n,"/",$(s||"HEAD"),"/",r,o)}`,tarballtemplate:({domain:i,user:t,project:e,committish:s})=>`https://${i}/${t}/${e}/get/${$(s||"HEAD")}.tar.gz`,extract:i=>{let[,t,e,s]=i.pathname.split("/",4);if(!["get"].includes(s)&&(e&&e.endsWith(".git")&&(e=e.slice(0,-4)),!(!t||!e)))return{user:t,project:e,committish:i.hash.slice(1)}}};I.gitlab={protocols:["git+ssh:","git+https:","ssh:","https:"],domain:"gitlab.com",treepath:"tree",blobpath:"tree",editpath:"-/edit",httpstemplate:({auth:i,domain:t,user:e,project:s,committish:n})=>`git+https://${g(i,"@")}${t}/${e}/${s}.git${g("#",n)}`,tarballtemplate:({domain:i,user:t,project:e,committish:s})=>`https://${i}/${t}/${e}/repository/archive.tar.gz?ref=${$(s||"HEAD")}`,extract:i=>{let t=i.pathname.slice(1);if(t.includes("/-/")||t.includes("/archive.tar.gz"))return;let e=t.split("/"),s=e.pop();s.endsWith(".git")&&(s=s.slice(0,-4));let n=e.join("/");if(!(!n||!s))return{user:n,project:s,committish:i.hash.slice(1)}}};I.gist={protocols:["git:","git+ssh:","git+https:","ssh:","https:"],domain:"gist.github.com",editpath:"edit",sshtemplate:({domain:i,project:t,committish:e})=>`git@${i}:${t}.git${g("#",e)}`,sshurltemplate:({domain:i,project:t,committish:e})=>`git+ssh://git@${i}/${t}.git${g("#",e)}`,edittemplate:({domain:i,user:t,project:e,committish:s,editpath:n})=>`https://${i}/${t}/${e}${g("/",$(s))}/${n}`,browsetemplate:({domain:i,project:t,committish:e})=>`https://${i}/${t}${g("/",$(e))}`,browsetreetemplate:({domain:i,project:t,committish:e,path:s,hashformat:n})=>`https://${i}/${t}${g("/",$(e))}${g("#",n(s))}`,browseblobtemplate:({domain:i,project:t,committish:e,path:s,hashformat:n})=>`https://${i}/${t}${g("/",$(e))}${g("#",n(s))}`,docstemplate:({domain:i,project:t,committish:e})=>`https://${i}/${t}${g("/",$(e))}`,httpstemplate:({domain:i,project:t,committish:e})=>`git+https://${i}/${t}.git${g("#",e)}`,filetemplate:({user:i,project:t,committish:e,path:s})=>`https://gist.githubusercontent.com/${i}/${t}/raw${g("/",$(e))}/${s}`,shortcuttemplate:({type:i,project:t,committish:e})=>`${i}:${t}${g("#",e)}`,pathtemplate:({project:i,committish:t})=>`${i}${g("#",t)}`,bugstemplate:({domain:i,project:t})=>`https://${i}/${t}`,gittemplate:({domain:i,project:t,committish:e})=>`git://${i}/${t}.git${g("#",e)}`,tarballtemplate:({project:i,committish:t})=>`https://codeload.github.com/gist/${i}/tar.gz/${$(t||"HEAD")}`,extract:i=>{let[,t,e,s]=i.pathname.split("/",4);if(s!=="raw"){if(!e){if(!t)return;e=t,t=null}return e.endsWith(".git")&&(e=e.slice(0,-4)),{user:t,project:e,committish:i.hash.slice(1)}}},hashformat:function(i){return i&&"file-"+It(i)}};I.sourcehut={protocols:["git+ssh:","https:"],domain:"git.sr.ht",treepath:"tree",blobpath:"tree",filetemplate:({domain:i,user:t,project:e,committish:s,path:n})=>`https://${i}/${t}/${e}/blob/${$(s)||"HEAD"}/${n}`,httpstemplate:({domain:i,user:t,project:e,committish:s})=>`https://${i}/${t}/${e}.git${g("#",s)}`,tarballtemplate:({domain:i,user:t,project:e,committish:s})=>`https://${i}/${t}/${e}/archive/${$(s)||"HEAD"}.tar.gz`,bugstemplate:({user:i,project:t})=>`https://todo.sr.ht/${i}/${t}`,extract:i=>{let[,t,e,s]=i.pathname.split("/",4);if(!["archive"].includes(s)&&(e&&e.endsWith(".git")&&(e=e.slice(0,-4)),!(!t||!e)))return{user:t,project:e,committish:i.hash.slice(1)}}};for(let[i,t]of Object.entries(I))I[i]=Object.assign({},pe,t);Ct.exports=I});var wt=X((Ne,Wt)=>{var ue=v("url"),bt=(i,t,e)=>{let s=i.indexOf(e);return i.lastIndexOf(t,s>-1?s:1/0)},Ut=i=>{try{return new ue.URL(i)}catch{}},me=(i,t)=>{let e=i.indexOf(":"),s=i.slice(0,e+1);if(Object.prototype.hasOwnProperty.call(t,s))return i;let n=i.indexOf("@");return n>-1?n>e?`git+ssh://${i}`:i:i.indexOf("//")===e+1?i:`${i.slice(0,e+1)}//${i.slice(e+1)}`},ge=i=>{let t=bt(i,"@","#"),e=bt(i,":","#");return e>t&&(i=i.slice(0,e)+"/"+i.slice(e+1)),bt(i,":","#")===-1&&i.indexOf("//")===-1&&(i=`git+ssh://${i}`),i};Wt.exports=(i,t)=>{let e=t?me(i,t):i;return Ut(e)||Ut(ge(e))}});var jt=X((He,Dt)=>{"use strict";var ye=wt(),be=i=>{let t=i.indexOf("#"),e=i.indexOf("/"),s=i.indexOf("/",e+1),n=i.indexOf(":"),r=/\s/.exec(i),o=i.indexOf("@"),a=!r||t>-1&&r.index>t,d=o===-1||t>-1&&o>t,c=n===-1||t>-1&&n>t,l=s===-1||t>-1&&s>t,u=e>0,h=t>-1?i[t-1]!=="/":!i.endsWith("/"),f=!i.startsWith(".");return a&&u&&h&&f&&d&&c&&l};Dt.exports=(i,t,{gitHosts:e,protocols:s})=>{if(!i)return;let n=be(i)?`github:${i}`:i,r=ye(n,s);if(!r)return;let o=e.byShortcut[r.protocol],a=e.byDomain[r.hostname.startsWith("www.")?r.hostname.slice(4):r.hostname],d=o||a;if(!d)return;let c=e[o||a],l=null;s[r.protocol]?.auth&&(r.username||r.password)&&(l=`${r.username}${r.password?":"+r.password:""}`);let u=null,h=null,f=null,y=null;try{if(o){let p=r.pathname.startsWith("/")?r.pathname.slice(1):r.pathname,m=p.indexOf("@");m>-1&&(p=p.slice(m+1));let L=p.lastIndexOf("/");L>-1?(h=decodeURIComponent(p.slice(0,L)),h||(h=null),f=decodeURIComponent(p.slice(L+1))):f=decodeURIComponent(p),f.endsWith(".git")&&(f=f.slice(0,-4)),r.hash&&(u=decodeURIComponent(r.hash.slice(1))),y="shortcut"}else{if(!c.protocols.includes(r.protocol))return;let p=c.extract(r);if(!p)return;h=p.user&&decodeURIComponent(p.user),f=decodeURIComponent(p.project),u=decodeURIComponent(p.committish),y=s[r.protocol]?.name||r.protocol.slice(0,-1)}}catch(p){if(p instanceof URIError)return;throw p}return[d,h,l,f,u,y,t]}});var Nt=X((Be,Rt)=>{"use strict";var we=Et(),$e=Mt(),Se=jt(),ve=wt(),$t=new we({max:1e3}),C,Z,S,P,_=class{constructor(t,e,s,n,r,o,a={}){st(this,S);Object.assign(this,O(_,C)[t],{type:t,user:e,auth:s,project:n,committish:r,default:o,opts:a})}static addHost(t,e){O(_,C)[t]=e,O(_,C).byDomain[e.domain]=t,O(_,C).byShortcut[`${t}:`]=t,O(_,Z)[`${t}:`]={name:t}}static fromUrl(t,e){if(typeof t!="string")return;let s=t+JSON.stringify(e||{});if(!$t.has(s)){let n=Se(t,e,{gitHosts:O(_,C),protocols:O(_,Z)});$t.set(s,n?new _(...n):void 0)}return $t.get(s)}static parseUrl(t){return ve(t)}hash(){return this.committish?`#${this.committish}`:""}ssh(t){return x(this,S,P).call(this,this.sshtemplate,t)}sshurl(t){return x(this,S,P).call(this,this.sshurltemplate,t)}browse(t,...e){return typeof t!="string"?x(this,S,P).call(this,this.browsetemplate,t):typeof e[0]!="string"?x(this,S,P).call(this,this.browsetreetemplate,{...e[0],path:t}):x(this,S,P).call(this,this.browsetreetemplate,{...e[1],fragment:e[0],path:t})}browseFile(t,...e){return typeof e[0]!="string"?x(this,S,P).call(this,this.browseblobtemplate,{...e[0],path:t}):x(this,S,P).call(this,this.browseblobtemplate,{...e[1],fragment:e[0],path:t})}docs(t){return x(this,S,P).call(this,this.docstemplate,t)}bugs(t){return x(this,S,P).call(this,this.bugstemplate,t)}https(t){return x(this,S,P).call(this,this.httpstemplate,t)}git(t){return x(this,S,P).call(this,this.gittemplate,t)}shortcut(t){return x(this,S,P).call(this,this.shortcuttemplate,t)}path(t){return x(this,S,P).call(this,this.pathtemplate,t)}tarball(t){return x(this,S,P).call(this,this.tarballtemplate,{...t,noCommittish:!1})}file(t,e){return x(this,S,P).call(this,this.filetemplate,{...e,path:t})}edit(t,e){return x(this,S,P).call(this,this.edittemplate,{...e,path:t})}getDefaultRepresentation(){return this.default}toString(t){return this.default&&typeof this[this.default]=="function"?this[this.default](t):this.sshurl(t)}},H=_;C=new WeakMap,Z=new WeakMap,S=new WeakSet,P=function(t,e){if(typeof t!="function")return null;let s={...this,...this.opts,...e};s.path||(s.path=""),s.path.startsWith("/")&&(s.path=s.path.slice(1)),s.noCommittish&&(s.committish=null);let n=t(s);return s.noGitPlus&&n.startsWith("git+")?n.slice(4):n},st(H,C,{byShortcut:{},byDomain:{}}),st(H,Z,{"git+ssh:":{name:"sshurl"},"ssh:":{name:"sshurl"},"git+https:":{name:"https",auth:!0},"git:":{auth:!0},"http:":{auth:!0},"https:":{auth:!0},"git+http:":{auth:!0}});for(let[i,t]of Object.entries($e))H.addHost(i,t);Rt.exports=H});var Ce={};it(Ce,{default:()=>Ie});var te=v("@yarnpkg/cli"),q=v("@yarnpkg/core"),U=v("clipanion");var b=v("@yarnpkg/core"),T=v("@yarnpkg/fslib"),Gt=ae(Nt());var vt={};it(vt,{fs:()=>Le,getPackagePath:()=>xe});var Ht=v("@yarnpkg/plugin-pnp"),ot=v("@yarnpkg/core"),Bt=v("@yarnpkg/fslib"),at=v("@yarnpkg/libzip");var B=()=>({os:[process.platform],cpu:[process.arch],libc:[]});var xe=async(i,t)=>{if(Pe(i),!ot.structUtils.isPackageCompatible(t,B()))return null;let e=ot.structUtils.convertPackageToLocator(t),s={name:ot.structUtils.stringifyIdent(e),reference:e.reference},n=St.getPackageInformation(s);if(!n)return null;let{packageLocation:r}=n;return r},St,Pe=i=>{St||(St=module.require((0,Ht.getPnpPath)(i).cjs))},Le=new Bt.VirtualFS({baseFs:new at.ZipOpenFS({libzip:(0,at.getLibzipSync)(),readOnlyArchives:!0})});var xt={};it(xt,{_getYarnStateAliases:()=>Yt,fs:()=>Ae,getPackagePath:()=>ke});var j=v("@yarnpkg/core"),Vt=v("@yarnpkg/parsers"),M=v("@yarnpkg/fslib");var ke=async(i,t)=>{if(await Te(i),!j.structUtils.isPackageCompatible(t,B()))return null;let e=j.structUtils.convertPackageToLocator(t),s=j.structUtils.stringifyLocator(e),n=lt[s]||qt[s];if(!n)return null;let r=n.locations[0];return r?M.ppath.join(i.cwd,r):i.cwd},lt,qt,Te=async i=>{if(!lt){let t=M.ppath.join(i.configuration.projectCwd,M.Filename.nodeModules,".yarn-state.yml");lt=(0,Vt.parseSyml)(await M.xfs.readFilePromise(t,"utf8")),qt=Yt(lt)}},Ae=M.xfs,Yt=i=>Object.entries(i).reduce((t,[e,s])=>{if(!s.aliases)return t;let n=j.structUtils.parseLocator(e);for(let r of s.aliases){let o=j.structUtils.makeLocator(n,r),a=j.structUtils.stringifyLocator(o);t[a]=s}return t},{});var Pt={};it(Pt,{fs:()=>ze,getPackagePath:()=>_e});var tt=v("@yarnpkg/core"),R=v("@yarnpkg/fslib");var _e=async(i,t)=>{if(!tt.structUtils.isPackageCompatible(t,B()))return null;let e=tt.structUtils.convertPackageToLocator(t),s=tt.structUtils.slugifyLocator(e),n=tt.structUtils.stringifyIdent(e),r=i.tryWorkspaceByLocator(e);return r?r.cwd:R.ppath.join(i.configuration.projectCwd,R.Filename.nodeModules,".store",s,R.Filename.nodeModules,n)},ze=R.xfs;var Lt=i=>{switch(i){case"pnp":return vt;case"node-modules":return xt;case"pnpm":return Pt;default:throw new Error("Unsupported linker")}};var fi=T.npath.basename(__dirname)==="@yarnpkg"?T.ppath.join(T.npath.toPortablePath(__dirname),"../.."):T.ppath.join(T.npath.toPortablePath(__dirname),".."),Jt=async(i,t,e,s,n)=>{let r={},o={children:r},a=await Kt(i,e,s),d=Lt(i.configuration.get("nodeLinker"));for(let[c,l]of a.entries()){let u=await d.getPackagePath(i,l);if(u===null)continue;let h=JSON.parse(await d.fs.readFilePromise(T.ppath.join(u,T.Filename.manifest),"utf8")),{license:f,url:y,vendorName:p,vendorUrl:m}=Oe(h);r[f]||(r[f]={value:b.formatUtils.tuple(b.formatUtils.Type.NO_HINT,f),children:{}});let L=b.structUtils.convertPackageToLocator(l),k=b.formatUtils.tuple(b.formatUtils.Type.DEPENDENT,{locator:L,descriptor:c}),w=n?{}:{...y?{url:{value:b.formatUtils.tuple(b.formatUtils.Type.NO_HINT,kt("URL",y,t))}}:{},...p?{vendorName:{value:b.formatUtils.tuple(b.formatUtils.Type.NO_HINT,kt("VendorName",p,t))}}:{},...m?{vendorUrl:{value:b.formatUtils.tuple(b.formatUtils.Type.NO_HINT,kt("VendorUrl",m,t))}}:{}},A={value:k,children:w},W=b.structUtils.stringifyLocator(L),z=r[f];if(z){let D=z.children;D[W]=A}}return o},Kt=async(i,t,e)=>{let s=new Map,n;if(t){if(e){for(let d of i.workspaces)d.manifest.devDependencies.clear();let a=await b.Cache.find(i.configuration);await i.resolveEverything({report:new b.ThrowReport,cache:a})}n=i.storedDescriptors.values()}else n=i.workspaces.flatMap(a=>{let d=[a.anchoredDescriptor];for(let[c,l]of a.anchoredPackage.dependencies.entries())e&&a.manifest.devDependencies.has(c)||d.push(l);return d});let r=b.miscUtils.sortMap(n,[a=>b.structUtils.stringifyIdent(a),a=>b.structUtils.isVirtualDescriptor(a)?"0":"1",a=>a.range]),o=new Set;for(let a of r.values()){let d=i.storedResolutions.get(a.descriptorHash);if(!d)continue;let c=i.storedPackages.get(d);if(!c)continue;let{descriptorHash:l}=b.structUtils.isVirtualDescriptor(a)?b.structUtils.devirtualizeDescriptor(a):a;o.has(l)||(o.add(l),s.set(a,c))}return s};function Fe(i){let t={},e=i.match(/^([^(<]+)/);if(e){let r=e[0].trim();r&&(t.name=r)}let s=i.match(/<([^>]+)>/);s&&(t.email=s[1]);let n=i.match(/\(([^)]+)\)/);return n&&(t.url=n[1]),t}var Oe=i=>{let{license:t,licenses:e,repository:s,homepage:n,author:r}=i,o=typeof r=="string"?Fe(r):r;return{license:(()=>{if(t)return ct(t);if(e){if(!Array.isArray(e))return ct(e);if(e.length===1)return ct(e[0]);if(e.length>1)return`(${e.map(ct).join(" OR ")})`}return Xt})(),url:Qt(s)||n,vendorName:o?.name,vendorUrl:n||o?.url}},Xt="UNKNOWN",ct=i=>(typeof i!="string"?i.type:i)||Xt,Qt=i=>{let t=typeof i=="string"?i:i?.url;if(!t)return t;let e=Gt.fromUrl(t);return!e||e.getDefaultRepresentation()!=="shortcut"?t:e.https()},kt=(i,t,e)=>e?t:`${i}: ${t}`,Zt=async(i,t,e)=>{let s=await Kt(i,t,e),n=Lt(i.configuration.get("nodeLinker")),r=new Map;for(let a of s.values()){let d=await n.getPackagePath(i,a);if(d===null)continue;let c=JSON.parse(await n.fs.readFilePromise(T.ppath.join(d,T.Filename.manifest),"utf8")),u=(await n.fs.readdirPromise(d,{withFileTypes:!0})).filter(k=>k.isFile()).map(({name:k})=>k),h=u.find(k=>{let w=k.toLowerCase();return w==="license"||w.startsWith("license.")||w==="unlicense"||w.startsWith("unlicense.")});if(!h)continue;let f=await n.fs.readFilePromise(T.ppath.join(d,h),"utf8"),y=u.find(k=>{let w=k.toLowerCase();return w==="notice"||w.startsWith("notice.")}),p;y&&(p=await n.fs.readFilePromise(T.ppath.join(d,y),"utf8"));let m=p?`${f}

NOTICE

${p}`:f,L=r.get(m);L?L.set(c.name,c):r.set(m,new Map([[c.name,c]]))}let o=`THE FOLLOWING SETS FORTH ATTRIBUTION NOTICES FOR THIRD PARTY SOFTWARE THAT MAY BE CONTAINED IN PORTIONS OF THE ${String(i.topLevelWorkspace.manifest.raw.name).toUpperCase().replace(/-/g," ")} PRODUCT.

`;for(let[a,d]of r.entries()){o+=`-----

`;let c=[],l=[];for(let{name:h,repository:f}of d.values()){c.push(h);let y=Qt(f);y&&l.push(d.size===1?y:`${y} (${h})`)}let u=[];u.push(`The following software may be included in this product: ${c.join(", ")}.`),l.length>0&&u.push(`A copy of the source code may be downloaded from ${l.join(", ")}.`),u.push("This software contains the following license and notice below:"),o+=`${u.join(" ")}

`,o+=`${a.trim()}

`}return o};var V=class extends U.Command{constructor(){super(...arguments);this.recursive=U.Option.Boolean("-R,--recursive",!1,{description:"Include transitive dependencies (dependencies of direct dependencies)"});this.production=U.Option.Boolean("--production",!1,{description:"Exclude development dependencies"});this.json=U.Option.Boolean("--json",!1,{description:"Format output as JSON"});this.excludeMetadata=U.Option.Boolean("--exclude-metadata",!1,{description:"Exclude dependency metadata from output"})}async execute(){let e=await q.Configuration.find(this.context.cwd,this.context.plugins),{project:s,workspace:n}=await q.Project.find(e,this.context.cwd);if(!n)throw new te.WorkspaceRequiredError(s.cwd,this.context.cwd);await s.restoreInstallState();let r=await Jt(s,this.json,this.recursive,this.production,this.excludeMetadata);q.treeUtils.emitTree(r,{configuration:e,stdout:this.context.stdout,json:this.json,separators:1})}};V.paths=[["licenses","list"]],V.usage=U.Command.Usage({description:"display the licenses for all packages in the project",details:`
      This command prints the license information for packages in the project. By default, only direct dependencies are listed.

      If \`-R,--recursive\` is set, the listing will include transitive dependencies (dependencies of direct dependencies).

      If \`--production\` is set, the listing will exclude development dependencies.
    `,examples:[["List all licenses of direct dependencies","$0 licenses list"],["List all licenses of direct and transitive dependencies","$0 licenses list --recursive"],["List all licenses of production dependencies only","$0 licenses list --production"]]});var ee=v("@yarnpkg/cli"),ht=v("@yarnpkg/core"),G=v("clipanion");var Y=class extends G.Command{constructor(){super(...arguments);this.recursive=G.Option.Boolean("-R,--recursive",!1,{description:"Include transitive dependencies (dependencies of direct dependencies)"});this.production=G.Option.Boolean("--production",!1,{description:"Exclude development dependencies"})}async execute(){let e=await ht.Configuration.find(this.context.cwd,this.context.plugins),{project:s,workspace:n}=await ht.Project.find(e,this.context.cwd);if(!n)throw new ee.WorkspaceRequiredError(s.cwd,this.context.cwd);await s.restoreInstallState();let r=await Zt(s,this.recursive,this.production);this.context.stdout.write(r)}};Y.paths=[["licenses","generate-disclaimer"]],Y.usage=G.Command.Usage({description:"display the license disclaimer including all packages in the project",details:`
      This command prints the license disclaimer for packages in the project. By default, only direct dependencies are listed.

      If \`-R,--recursive\` is set, the disclaimer will include transitive dependencies (dependencies of direct dependencies).

      If \`--production\` is set, the disclaimer will exclude development dependencies.
    `,examples:[["Include licenses of direct dependencies","$0 licenses generate-disclaimer"],["Include licenses of direct and transitive dependencies","$0 licenses generate-disclaimer --recursive"],["Include licenses of production dependencies only","$0 licenses list --production"]]});var Ee={commands:[V,Y]},Ie=Ee;return le(Ce);})();
return plugin;
}
};