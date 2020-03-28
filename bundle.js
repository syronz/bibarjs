(function (exports) {
    'use strict';

    class App {
        constructor() {
            this._events = {};
        }
        on(name, fn, options = {}) {
            this._events[name] = this._events[name] || [];
            this._events[name].push({ fn, options });
        }
        off(name, fn) {
            const subscribers = this._events[name] || [];
            this._events[name] = subscribers.filter((sub) => sub.fn !== fn);
        }
        find(name) {
            return this._events[name];
        }
        run(name, ...args) {
            const subscribers = this._events[name] || [];
            console.assert(subscribers && subscribers.length > 0, 'No subscriber for event: ' + name);
            // Update the list of subscribers by pulling out those which will run once.
            // We must do this update prior to running any of the events in case they
            // cause additional events to be turned off or on.
            this._events[name] = subscribers.filter((sub) => {
                return !sub.options.once;
            });
            subscribers.forEach((sub) => {
                const { fn, options } = sub;
                if (options.delay) {
                    this.delay(name, fn, args, options);
                }
                else {
                    fn.apply(this, args);
                }
                return !sub.options.once;
            });
            return subscribers.length;
        }
        once(name, fn, options = {}) {
            this.on(name, fn, Object.assign(Object.assign({}, options), { once: true }));
        }
        delay(name, fn, args, options) {
            if (options._t)
                clearTimeout(options._t);
            options._t = setTimeout(() => {
                clearTimeout(options._t);
                fn.apply(this, args);
            }, options.delay);
        }
    }
    const AppRunVersions = 'AppRun-2';
    let app;
    const root = (typeof self === 'object' && self.self === self && self) ||
        (typeof global === 'object' && global.global === global && global);
    if (root['app'] && root['_AppRunVersions']) {
        app = root['app'];
    }
    else {
        app = new App();
        root['app'] = app;
        root['_AppRunVersions'] = AppRunVersions;
    }
    var app$1 = app;

    function render(node, parent, idx) {
        const { tag, props, children } = node;
        let key = `_${idx}`;
        let id = props && props['id'];
        if (!id)
            id = `_${idx}${Date.now()}`;
        else
            key = id;
        if (!parent.__componentCache)
            parent.__componentCache = {};
        let component = parent.__componentCache[key];
        if (!component) {
            component = parent.__componentCache[key] = new tag(Object.assign(Object.assign({}, props), { children })).mount(id);
            component['__eid'] = id;
        }
        else {
            id = component['__eid'];
        }
        let state = component.state;
        if (component.mounted) {
            const new_state = component.mounted(props, children, state);
            if (typeof new_state !== 'undefined')
                state = component.state = new_state;
        }
        if (state instanceof Promise) {
            const render = el => {
                component.element = el;
                component.setState(state);
            };
            return app$1.createElement("section", Object.assign({}, props, { id: id, ref: e => render(e) }));
        }
        else {
            const vdom = component._view(state, props);
            const render = el => {
                component.element = el;
                component.renderState(state, vdom);
            };
            return app$1.createElement("section", Object.assign({}, props, { id: id, ref: e => render(e) }), vdom);
        }
    }
    let _idx = 0;
    function createComponent(node, parent, idx = 0) {
        if (idx === 0)
            _idx = 0;
        if (typeof node === 'string')
            return node;
        if (Array.isArray(node))
            return node.map(child => createComponent(child, parent, _idx));
        let vdom = node;
        if (node && typeof node.tag === 'function' && Object.getPrototypeOf(node.tag).__isAppRunComponent)
            vdom = render(node, parent, _idx++);
        if (vdom && Array.isArray(vdom.children))
            vdom.children = vdom.children.map(child => createComponent(child, parent, _idx));
        return vdom;
    }

    const ATTR_PROPS = '_props';
    function collect(children) {
        const ch = [];
        const push = (c) => {
            if (c !== null && c !== undefined && c !== '' && c !== false) {
                ch.push((typeof c === 'function' || typeof c === 'object') ? c : `${c}`);
            }
        };
        children && children.forEach(c => {
            if (Array.isArray(c)) {
                c.forEach(i => push(i));
            }
            else {
                push(c);
            }
        });
        return ch;
    }
    function createElement(tag, props, ...children) {
        const ch = collect(children);
        if (typeof tag === 'string')
            return { tag, props, children: ch };
        else if (Array.isArray(tag))
            return tag; // JSX fragments - babel
        else if (tag === undefined && children)
            return ch; // JSX fragments - typescript
        else if (Object.getPrototypeOf(tag).__isAppRunComponent)
            return { tag, props, children: ch }; // createComponent(tag, { ...props, children });
        else if (typeof tag === 'function')
            return tag(props, ch);
        else
            throw new Error(`Unknown tag in vdom ${tag}`);
    }
    const keyCache = {};
    const updateElement = render$1;
    function render$1(element, nodes, parent = {}) {
        // console.log('render', element, node);
        // tslint:disable-next-line
        if (nodes == null || nodes === false)
            return;
        nodes = createComponent(nodes, parent);
        const isSvg = (element === null || element === void 0 ? void 0 : element.nodeName) === "SVG";
        if (!element)
            return;
        if (Array.isArray(nodes)) {
            updateChildren(element, nodes, isSvg);
        }
        else {
            updateChildren(element, [nodes], isSvg);
        }
    }
    function same(el, node) {
        // if (!el || !node) return false;
        const key1 = el.nodeName;
        const key2 = `${node.tag || ''}`;
        return key1.toUpperCase() === key2.toUpperCase();
    }
    function update(element, node, isSvg) {
        console.assert(!!element);
        isSvg = isSvg || node.tag === "svg";
        //console.log('update', element, node);
        if (!same(element, node)) {
            element.parentNode.replaceChild(create(node, isSvg), element);
            return;
        }
        updateChildren(element, node.children, isSvg);
        updateProps(element, node.props);
    }
    function updateChildren(element, children, isSvg) {
        const len = Math.min(element.childNodes.length, children.length);
        for (let i = 0; i < len; i++) {
            const child = children[i];
            const el = element.childNodes[i];
            if (child instanceof HTMLElement || child instanceof SVGElement) {
                element.insertBefore(child, el);
            }
            else if (typeof child === 'string') {
                if (el.textContent !== child) {
                    if (el.nodeType === 3) {
                        el.textContent = child;
                    }
                    else {
                        element.replaceChild(createText(child), el);
                    }
                }
            }
            else {
                const key = child.props && child.props['key'];
                if (key) {
                    if (el.key === key) {
                        update(element.childNodes[i], child, isSvg);
                    }
                    else {
                        const old = keyCache[key];
                        if (old) {
                            element.insertBefore(old, el);
                            element.appendChild(el);
                            update(element.childNodes[i], child, isSvg);
                        }
                        else {
                            element.insertBefore(create(child, isSvg), el);
                        }
                    }
                }
                else {
                    update(element.childNodes[i], child, isSvg);
                }
            }
        }
        let n = element.childNodes.length;
        while (n > len) {
            element.removeChild(element.lastChild);
            n--;
        }
        if (children.length > len) {
            const d = document.createDocumentFragment();
            for (let i = len; i < children.length; i++) {
                d.appendChild(create(children[i], isSvg));
            }
            element.appendChild(d);
        }
    }
    function createText(node) {
        if (node.indexOf('_html:') === 0) { // ?
            const div = document.createElement('div');
            div.insertAdjacentHTML('afterbegin', node.substring(6));
            return div;
        }
        else {
            return document.createTextNode(node);
        }
    }
    function create(node, isSvg) {
        console.assert(node !== null && node !== undefined);
        // console.log('create', node, typeof node);
        if ((node instanceof HTMLElement) || (node instanceof SVGElement))
            return node;
        if (typeof node === "string")
            return createText(node);
        if (!node.tag || (typeof node.tag === 'function'))
            return createText(JSON.stringify(node));
        isSvg = isSvg || node.tag === "svg";
        const element = isSvg
            ? document.createElementNS("http://www.w3.org/2000/svg", node.tag)
            : document.createElement(node.tag);
        updateProps(element, node.props);
        if (node.children)
            node.children.forEach(child => element.appendChild(create(child, isSvg)));
        return element;
    }
    function mergeProps(oldProps, newProps) {
        newProps['class'] = newProps['class'] || newProps['className'];
        delete newProps['className'];
        const props = {};
        if (oldProps)
            Object.keys(oldProps).forEach(p => props[p] = null);
        if (newProps)
            Object.keys(newProps).forEach(p => props[p] = newProps[p]);
        return props;
    }
    function updateProps(element, props) {
        console.assert(!!element);
        // console.log('updateProps', element, props);
        const cached = element[ATTR_PROPS] || {};
        props = mergeProps(cached, props || {});
        element[ATTR_PROPS] = props;
        for (const name in props) {
            const value = props[name];
            // if (cached[name] === value) continue;
            // console.log('updateProps', name, value);
            if (name === 'style') {
                if (element.style.cssText)
                    element.style.cssText = '';
                for (const s in value) {
                    if (element.style[s] !== value[s])
                        element.style[s] = value[s];
                }
            }
            else if (name.startsWith('data-')) {
                const dname = name.substring(5);
                const cname = dname.replace(/-(\w)/g, (match) => match[1].toUpperCase());
                if (element.dataset[cname] !== value) {
                    if (value || value === "")
                        element.dataset[cname] = value;
                    else
                        delete element.dataset[cname];
                }
            }
            else if (name === 'id' || name === 'class' || name.startsWith("role") || name.indexOf("-") > 0 ||
                element instanceof SVGElement) {
                if (element.getAttribute(name) !== value) {
                    if (value)
                        element.setAttribute(name, value);
                    else
                        element.removeAttribute(name);
                }
            }
            else if (element[name] !== value) {
                element[name] = value;
            }
            if (name === 'key' && value)
                keyCache[value] = element;
        }
        if (props && typeof props['ref'] === 'function') {
            window.requestAnimationFrame(() => props['ref'](element));
        }
    }
    function Fragment(props, ...children) {
        return collect(children);
    }

    function render$2(element, html, parent) {
        updateElement(element, html, parent);
    }

    const customElement = (componentClass, options = {}) => class extends HTMLElement {
        constructor() {
            super();
        }
        get component() { return this._component; }
        get state() { return this._component.state; }
        static get observedAttributes() {
            return Object.assign({}, options)['observedAttributes'];
        }
        connectedCallback() {
            if (this.isConnected && !this._component) {
                const opts = options || {};
                this._shadowRoot = opts.shadow ? this.attachShadow({ mode: 'open' }) : this;
                const props = {};
                Array.from(this.attributes).forEach(item => props[item.name] = item.value);
                const children = this.children ? Array.from(this.children) : [];
                children.forEach(el => el.parentElement.removeChild(el));
                this._component = new componentClass(Object.assign(Object.assign({}, props), { children })).mount(this._shadowRoot, opts);
                if (this._component.mounted) {
                    const new_state = this._component.mounted(props, children, this._component.state);
                    if (typeof new_state !== 'undefined')
                        this._component.state = new_state;
                }
                this.on = this._component.on.bind(this._component);
                this.run = this._component.run.bind(this._component);
                if (!(opts.render === false))
                    this._component.run('.');
            }
        }
        disconnectedCallback() {
            var _a, _b, _c, _d;
            (_b = (_a = this._component) === null || _a === void 0 ? void 0 : _a.unload) === null || _b === void 0 ? void 0 : _b.call(_a);
            (_d = (_c = this._component) === null || _c === void 0 ? void 0 : _c.unmount) === null || _d === void 0 ? void 0 : _d.call(_c);
            this._component = null;
        }
        attributeChangedCallback(...args) {
            var _a;
            (_a = this._component) === null || _a === void 0 ? void 0 : _a.run('attributeChanged', ...args);
        }
    };
    var webComponent = (name, componentClass, options) => {
        (typeof customElements !== 'undefined') && customElements.define(name, customElement(componentClass, options));
    };

    // tslint:disable:no-invalid-this
    const Reflect = {
        meta: new WeakMap(),
        defineMetadata(metadataKey, metadataValue, target) {
            if (!this.meta.has(target))
                this.meta.set(target, {});
            this.meta.get(target)[metadataKey] = metadataValue;
        },
        getMetadataKeys(target) {
            target = Object.getPrototypeOf(target);
            return this.meta.get(target) ? Object.keys(this.meta.get(target)) : [];
        },
        getMetadata(metadataKey, target) {
            target = Object.getPrototypeOf(target);
            return this.meta.get(target) ? this.meta.get(target)[metadataKey] : null;
        }
    };
    function update$1(events, options = {}) {
        return (target, key, descriptor) => {
            const name = events ? events.toString() : key;
            Reflect.defineMetadata(`apprun-update:${name}`, { name, key, options }, target);
            return descriptor;
        };
    }
    function on(events, options = {}) {
        return function (target, key) {
            const name = events ? events.toString() : key;
            Reflect.defineMetadata(`apprun-update:${name}`, { name, key, options }, target);
        };
    }
    function customElement$1(name, options) {
        return function _customElement(constructor) {
            webComponent(name, constructor, options);
            return constructor;
        };
    }

    const getStateValue = (component, name) => {
        return (name ? component['state'][name] : component['state']) || '';
    };
    const setStateValue = (component, name, value) => {
        if (name) {
            const state = Object.assign({}, component['state']);
            state[name] = value;
            component.setState(state);
        }
        else {
            component.setState(value);
        }
    };
    var directive = (key, props, tag, component) => {
        if (key.startsWith('$on')) {
            const event = props[key];
            key = key.substring(1);
            if (typeof event === 'boolean') {
                props[key] = e => component.run(key, e);
            }
            else if (typeof event === 'string') {
                props[key] = e => component.run(event, e);
            }
            else if (typeof event === 'function') {
                props[key] = e => component.setState(event(component.state, e));
            }
            else if (Array.isArray(event)) {
                const [handler, ...p] = event;
                if (typeof handler === 'string') {
                    props[key] = e => component.run(handler, ...p, e);
                }
                else if (typeof handler === 'function') {
                    props[key] = e => component.setState(handler(component.state, ...p, e));
                }
            }
        }
        else if (key === '$bind') {
            const type = props['type'] || 'text';
            const name = typeof props[key] === 'string' ? props[key] : props['name'];
            if (tag === 'input') {
                switch (type) {
                    case 'checkbox':
                        props['checked'] = getStateValue(component, name);
                        props['onclick'] = e => setStateValue(component, name || e.target.name, e.target.checked);
                        break;
                    case 'radio':
                        props['checked'] = getStateValue(component, name) === props['value'];
                        props['onclick'] = e => setStateValue(component, name || e.target.name, e.target.value);
                        break;
                    case 'number':
                    case 'range':
                        props['value'] = getStateValue(component, name);
                        props['oninput'] = e => setStateValue(component, name || e.target.name, Number(e.target.value));
                        break;
                    default:
                        props['value'] = getStateValue(component, name);
                        props['oninput'] = e => setStateValue(component, name || e.target.name, e.target.value);
                }
            }
            else if (tag === 'select') {
                props['value'] = getStateValue(component, name);
                props['onchange'] = e => {
                    if (!e.target.multiple) { // multiple selection use $bind on option
                        setStateValue(component, name || e.target.name, e.target.value);
                    }
                };
            }
            else if (tag === 'option') {
                props['selected'] = getStateValue(component, name);
                props['onclick'] = e => setStateValue(component, name || e.target.name, e.target.selected);
            }
        }
        else {
            app$1.run('$', { key, tag, props, component });
        }
    };

    const componentCache = {};
    app$1.on('get-components', o => o.components = componentCache);
    const REFRESH = state => state;
    class Component {
        constructor(state, view, update, options) {
            this.state = state;
            this.view = view;
            this.update = update;
            this.options = options;
            this._app = new App();
            this._actions = [];
            this._global_events = [];
            this._history = [];
            this._history_idx = -1;
            this._history_prev = () => {
                this._history_idx--;
                if (this._history_idx >= 0) {
                    this.setState(this._history[this._history_idx], { render: true, history: false });
                }
                else {
                    this._history_idx = 0;
                }
            };
            this._history_next = () => {
                this._history_idx++;
                if (this._history_idx < this._history.length) {
                    this.setState(this._history[this._history_idx], { render: true, history: false });
                }
                else {
                    this._history_idx = this._history.length - 1;
                }
            };
            this.start = (element = null, options) => {
                return this.mount(element, Object.assign(Object.assign({}, options), { render: true }));
            };
        }
        render(element, node) {
            app$1.render(element, node, this);
        }
        _view(state, p = null) {
            if (!this.view)
                return;
            const h = app$1.createElement;
            app$1.createElement = (tag, props, ...children) => {
                props && Object.keys(props).forEach(key => {
                    if (key.startsWith('$')) {
                        directive(key, props, tag, this);
                        delete props[key];
                    }
                });
                return h(tag, props, ...children);
            };
            const html = p ? this.view(state, p) : this.view(state);
            app$1.createElement = h;
            return html;
        }
        renderState(state, vdom = null) {
            if (!this.view)
                return;
            const html = vdom || this._view(state);
            app$1['debug'] && app$1.run('debug', {
                component: this,
                state,
                vdom: html || '[vdom is null - no render]',
            });
            if (typeof document !== 'object')
                return;
            const el = (typeof this.element === 'string') ?
                document.getElementById(this.element) : this.element;
            if (el) {
                const tracking_attr = '_c';
                if (!this.unload) {
                    el.removeAttribute && el.removeAttribute(tracking_attr);
                }
                else if (el['_component'] !== this || el.getAttribute(tracking_attr) !== this.tracking_id) {
                    this.tracking_id = new Date().valueOf().toString();
                    el.setAttribute(tracking_attr, this.tracking_id);
                    if (typeof MutationObserver !== 'undefined') {
                        if (!this.observer)
                            this.observer = new MutationObserver(changes => {
                                if (changes[0].oldValue === this.tracking_id || !document.body.contains(el)) {
                                    this.unload(this.state);
                                    this.observer.disconnect();
                                    this.observer = null;
                                }
                            });
                        this.observer.observe(document.body, {
                            childList: true, subtree: true,
                            attributes: true, attributeOldValue: true, attributeFilter: [tracking_attr]
                        });
                    }
                }
                el['_component'] = this;
            }
            if (!vdom)
                this.render(el, html);
            this.rendered && this.rendered(this.state);
        }
        setState(state, options = { render: true, history: false }) {
            if (state instanceof Promise) {
                // Promise will not be saved or rendered
                // state will be saved and rendered when promise is resolved
                state.then(s => {
                    this.setState(s, options);
                }).catch(err => {
                    console.error(err);
                    throw err;
                });
                this._state = state;
            }
            else {
                this._state = state;
                if (state == null)
                    return;
                this.state = state;
                if (options.render !== false)
                    this.renderState(state);
                if (options.history !== false && this.enable_history) {
                    this._history = [...this._history, state];
                    this._history_idx = this._history.length - 1;
                }
                if (typeof options.callback === 'function')
                    options.callback(this.state);
            }
        }
        mount(element = null, options) {
            var _a, _b;
            console.assert(!this.element, 'Component already mounted.');
            this.options = options = Object.assign(Object.assign({}, this.options), options);
            this.element = element;
            this.global_event = options.global_event;
            this.enable_history = !!options.history;
            if (this.enable_history) {
                this.on(options.history.prev || 'history-prev', this._history_prev);
                this.on(options.history.next || 'history-next', this._history_next);
            }
            this.add_actions();
            this.state = (_b = (_a = this.state) !== null && _a !== void 0 ? _a : this['model']) !== null && _b !== void 0 ? _b : {};
            if (options.render) {
                this.setState(this.state, { render: true, history: true });
            }
            else {
                this.setState(this.state, { render: false, history: true });
            }
            if (app$1['debug']) {
                const id = typeof element === 'string' ? element : element.id;
                componentCache[id] = componentCache[id] || [];
                componentCache[id].push(this);
            }
            return this;
        }
        is_global_event(name) {
            return name && (this.global_event ||
                this._global_events.indexOf(name) >= 0 ||
                name.startsWith('#') || name.startsWith('/') || name.startsWith('@'));
        }
        add_action(name, action, options = {}) {
            if (!action || typeof action !== 'function')
                return;
            if (options.global)
                this._global_events.push(name);
            this.on(name, (...p) => {
                const newState = action(this.state, ...p);
                app$1['debug'] && app$1.run('debug', {
                    component: this,
                    'event': name,
                    e: p,
                    state: this.state,
                    newState,
                    options
                });
                this.setState(newState, options);
            }, options);
        }
        add_actions() {
            const actions = this.update || {};
            Reflect.getMetadataKeys(this).forEach(key => {
                if (key.startsWith('apprun-update:')) {
                    const meta = Reflect.getMetadata(key, this);
                    actions[meta.name] = [this[meta.key].bind(this), meta.options];
                }
            });
            const all = {};
            if (Array.isArray(actions)) {
                actions.forEach(act => {
                    const [name, action, opts] = act;
                    const names = name.toString();
                    names.split(',').forEach(n => all[n.trim()] = [action, opts]);
                });
            }
            else {
                Object.keys(actions).forEach(name => {
                    const action = actions[name];
                    if (typeof action === 'function' || Array.isArray(action)) {
                        name.split(',').forEach(n => all[n.trim()] = action);
                    }
                });
            }
            if (!all['.'])
                all['.'] = REFRESH;
            Object.keys(all).forEach(name => {
                const action = all[name];
                if (typeof action === 'function') {
                    this.add_action(name, action);
                }
                else if (Array.isArray(action)) {
                    this.add_action(name, action[0], action[1]);
                }
            });
        }
        run(event, ...args) {
            const name = event.toString();
            return this.is_global_event(name) ?
                app$1.run(name, ...args) :
                this._app.run(name, ...args);
        }
        on(event, fn, options) {
            const name = event.toString();
            this._actions.push({ name, fn });
            return this.is_global_event(name) ?
                app$1.on(name, fn, options) :
                this._app.on(name, fn, options);
        }
        unmount() {
            var _a;
            (_a = this.observer) === null || _a === void 0 ? void 0 : _a.disconnect();
            this._actions.forEach(action => {
                const { name, fn } = action;
                this.is_global_event(name) ?
                    app$1.off(name, fn) :
                    this._app.off(name, fn);
            });
        }
    }
    Component.__isAppRunComponent = true;

    const ROUTER_EVENT = '//';
    const ROUTER_404_EVENT = '///';
    const route = (url) => {
        if (!url)
            url = '#';
        if (url.startsWith('#')) {
            const [name, ...rest] = url.split('/');
            app$1.run(name, ...rest) || app$1.run(ROUTER_404_EVENT, name, ...rest);
            app$1.run(ROUTER_EVENT, name, ...rest);
        }
        else if (url.startsWith('/')) {
            const [_, name, ...rest] = url.split('/');
            app$1.run('/' + name, ...rest) || app$1.run(ROUTER_404_EVENT, '/' + name, ...rest);
            app$1.run(ROUTER_EVENT, '/' + name, ...rest);
        }
        else {
            app$1.run(url) || app$1.run(ROUTER_404_EVENT, url);
            app$1.run(ROUTER_EVENT, url);
        }
    };

    app$1.h = app$1.createElement = createElement;
    app$1.render = render$2;
    app$1.Fragment = Fragment;
    app$1.webComponent = webComponent;
    app$1.start = (element, model, view, update, options) => {
        const opts = Object.assign(Object.assign({}, options), { render: true, global_event: true });
        const component = new Component(model, view, update);
        if (options && options.rendered)
            component.rendered = options.rendered;
        component.mount(element, opts);
        return component;
    };
    const NOOP = _ => { };
    app$1.on('$', NOOP);
    app$1.on('debug', _ => NOOP);
    app$1.on(ROUTER_EVENT, NOOP);
    app$1.on('#', NOOP);
    app$1['route'] = route;
    app$1.on('route', url => app$1['route'] && app$1['route'](url));
    if (typeof document === 'object') {
        document.addEventListener("DOMContentLoaded", () => {
            if (app$1['route'] === route) {
                window.onpopstate = () => route(location.hash);
                route(location.hash);
            }
        });
    }
    if (typeof window === 'object') {
        window['Component'] = Component;
        window['React'] = app$1;
        window['on'] = on;
        window['customElement'] = customElement$1;
    }

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    const directives = new WeakMap();
    /**
     * Brands a function as a directive factory function so that lit-html will call
     * the function during template rendering, rather than passing as a value.
     *
     * A _directive_ is a function that takes a Part as an argument. It has the
     * signature: `(part: Part) => void`.
     *
     * A directive _factory_ is a function that takes arguments for data and
     * configuration and returns a directive. Users of directive usually refer to
     * the directive factory as the directive. For example, "The repeat directive".
     *
     * Usually a template author will invoke a directive factory in their template
     * with relevant arguments, which will then return a directive function.
     *
     * Here's an example of using the `repeat()` directive factory that takes an
     * array and a function to render an item:
     *
     * ```js
     * html`<ul><${repeat(items, (item) => html`<li>${item}</li>`)}</ul>`
     * ```
     *
     * When `repeat` is invoked, it returns a directive function that closes over
     * `items` and the template function. When the outer template is rendered, the
     * return directive function is called with the Part for the expression.
     * `repeat` then performs it's custom logic to render multiple items.
     *
     * @param f The directive factory function. Must be a function that returns a
     * function of the signature `(part: Part) => void`. The returned function will
     * be called with the part object.
     *
     * @example
     *
     * import {directive, html} from 'lit-html';
     *
     * const immutable = directive((v) => (part) => {
     *   if (part.value !== v) {
     *     part.setValue(v)
     *   }
     * });
     */
    const directive$1 = (f) => ((...args) => {
        const d = f(...args);
        directives.set(d, true);
        return d;
    });
    const isDirective = (o) => {
        return typeof o === 'function' && directives.has(o);
    };

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    /**
     * True if the custom elements polyfill is in use.
     */
    const isCEPolyfill = typeof window !== 'undefined' &&
        window.customElements != null &&
        window.customElements.polyfillWrapFlushCallback !==
            undefined;
    /**
     * Reparents nodes, starting from `start` (inclusive) to `end` (exclusive),
     * into another container (could be the same container), before `before`. If
     * `before` is null, it appends the nodes to the container.
     */
    const reparentNodes = (container, start, end = null, before = null) => {
        while (start !== end) {
            const n = start.nextSibling;
            container.insertBefore(start, before);
            start = n;
        }
    };
    /**
     * Removes nodes, starting from `start` (inclusive) to `end` (exclusive), from
     * `container`.
     */
    const removeNodes = (container, start, end = null) => {
        while (start !== end) {
            const n = start.nextSibling;
            container.removeChild(start);
            start = n;
        }
    };

    /**
     * @license
     * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    /**
     * A sentinel value that signals that a value was handled by a directive and
     * should not be written to the DOM.
     */
    const noChange = {};
    /**
     * A sentinel value that signals a NodePart to fully clear its content.
     */
    const nothing = {};

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    /**
     * An expression marker with embedded unique key to avoid collision with
     * possible text in templates.
     */
    const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
    /**
     * An expression marker used text-positions, multi-binding attributes, and
     * attributes with markup-like text values.
     */
    const nodeMarker = `<!--${marker}-->`;
    const markerRegex = new RegExp(`${marker}|${nodeMarker}`);
    /**
     * Suffix appended to all bound attribute names.
     */
    const boundAttributeSuffix = '$lit$';
    /**
     * An updatable Template that tracks the location of dynamic parts.
     */
    class Template {
        constructor(result, element) {
            this.parts = [];
            this.element = element;
            const nodesToRemove = [];
            const stack = [];
            // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
            const walker = document.createTreeWalker(element.content, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
            // Keeps track of the last index associated with a part. We try to delete
            // unnecessary nodes, but we never want to associate two different parts
            // to the same index. They must have a constant node between.
            let lastPartIndex = 0;
            let index = -1;
            let partIndex = 0;
            const { strings, values: { length } } = result;
            while (partIndex < length) {
                const node = walker.nextNode();
                if (node === null) {
                    // We've exhausted the content inside a nested template element.
                    // Because we still have parts (the outer for-loop), we know:
                    // - There is a template in the stack
                    // - The walker will find a nextNode outside the template
                    walker.currentNode = stack.pop();
                    continue;
                }
                index++;
                if (node.nodeType === 1 /* Node.ELEMENT_NODE */) {
                    if (node.hasAttributes()) {
                        const attributes = node.attributes;
                        const { length } = attributes;
                        // Per
                        // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
                        // attributes are not guaranteed to be returned in document order.
                        // In particular, Edge/IE can return them out of order, so we cannot
                        // assume a correspondence between part index and attribute index.
                        let count = 0;
                        for (let i = 0; i < length; i++) {
                            if (endsWith(attributes[i].name, boundAttributeSuffix)) {
                                count++;
                            }
                        }
                        while (count-- > 0) {
                            // Get the template literal section leading up to the first
                            // expression in this attribute
                            const stringForPart = strings[partIndex];
                            // Find the attribute name
                            const name = lastAttributeNameRegex.exec(stringForPart)[2];
                            // Find the corresponding attribute
                            // All bound attributes have had a suffix added in
                            // TemplateResult#getHTML to opt out of special attribute
                            // handling. To look up the attribute value we also need to add
                            // the suffix.
                            const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
                            const attributeValue = node.getAttribute(attributeLookupName);
                            node.removeAttribute(attributeLookupName);
                            const statics = attributeValue.split(markerRegex);
                            this.parts.push({ type: 'attribute', index, name, strings: statics });
                            partIndex += statics.length - 1;
                        }
                    }
                    if (node.tagName === 'TEMPLATE') {
                        stack.push(node);
                        walker.currentNode = node.content;
                    }
                }
                else if (node.nodeType === 3 /* Node.TEXT_NODE */) {
                    const data = node.data;
                    if (data.indexOf(marker) >= 0) {
                        const parent = node.parentNode;
                        const strings = data.split(markerRegex);
                        const lastIndex = strings.length - 1;
                        // Generate a new text node for each literal section
                        // These nodes are also used as the markers for node parts
                        for (let i = 0; i < lastIndex; i++) {
                            let insert;
                            let s = strings[i];
                            if (s === '') {
                                insert = createMarker();
                            }
                            else {
                                const match = lastAttributeNameRegex.exec(s);
                                if (match !== null && endsWith(match[2], boundAttributeSuffix)) {
                                    s = s.slice(0, match.index) + match[1] +
                                        match[2].slice(0, -boundAttributeSuffix.length) + match[3];
                                }
                                insert = document.createTextNode(s);
                            }
                            parent.insertBefore(insert, node);
                            this.parts.push({ type: 'node', index: ++index });
                        }
                        // If there's no text, we must insert a comment to mark our place.
                        // Else, we can trust it will stick around after cloning.
                        if (strings[lastIndex] === '') {
                            parent.insertBefore(createMarker(), node);
                            nodesToRemove.push(node);
                        }
                        else {
                            node.data = strings[lastIndex];
                        }
                        // We have a part for each match found
                        partIndex += lastIndex;
                    }
                }
                else if (node.nodeType === 8 /* Node.COMMENT_NODE */) {
                    if (node.data === marker) {
                        const parent = node.parentNode;
                        // Add a new marker node to be the startNode of the Part if any of
                        // the following are true:
                        //  * We don't have a previousSibling
                        //  * The previousSibling is already the start of a previous part
                        if (node.previousSibling === null || index === lastPartIndex) {
                            index++;
                            parent.insertBefore(createMarker(), node);
                        }
                        lastPartIndex = index;
                        this.parts.push({ type: 'node', index });
                        // If we don't have a nextSibling, keep this node so we have an end.
                        // Else, we can remove it to save future costs.
                        if (node.nextSibling === null) {
                            node.data = '';
                        }
                        else {
                            nodesToRemove.push(node);
                            index--;
                        }
                        partIndex++;
                    }
                    else {
                        let i = -1;
                        while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
                            // Comment node has a binding marker inside, make an inactive part
                            // The binding won't work, but subsequent bindings will
                            // TODO (justinfagnani): consider whether it's even worth it to
                            // make bindings in comments work
                            this.parts.push({ type: 'node', index: -1 });
                            partIndex++;
                        }
                    }
                }
            }
            // Remove text binding nodes after the walk to not disturb the TreeWalker
            for (const n of nodesToRemove) {
                n.parentNode.removeChild(n);
            }
        }
    }
    const endsWith = (str, suffix) => {
        const index = str.length - suffix.length;
        return index >= 0 && str.slice(index) === suffix;
    };
    const isTemplatePartActive = (part) => part.index !== -1;
    // Allows `document.createComment('')` to be renamed for a
    // small manual size-savings.
    const createMarker = () => document.createComment('');
    /**
     * This regex extracts the attribute name preceding an attribute-position
     * expression. It does this by matching the syntax allowed for attributes
     * against the string literal directly preceding the expression, assuming that
     * the expression is in an attribute-value position.
     *
     * See attributes in the HTML spec:
     * https://www.w3.org/TR/html5/syntax.html#elements-attributes
     *
     * " \x09\x0a\x0c\x0d" are HTML space characters:
     * https://www.w3.org/TR/html5/infrastructure.html#space-characters
     *
     * "\0-\x1F\x7F-\x9F" are Unicode control characters, which includes every
     * space character except " ".
     *
     * So an attribute is:
     *  * The name: any character except a control character, space character, ('),
     *    ("), ">", "=", or "/"
     *  * Followed by zero or more space characters
     *  * Followed by "="
     *  * Followed by zero or more space characters
     *  * Followed by:
     *    * Any character except space, ('), ("), "<", ">", "=", (`), or
     *    * (") then any non-("), or
     *    * (') then any non-(')
     */
    const lastAttributeNameRegex = 
    // eslint-disable-next-line no-control-regex
    /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    /**
     * An instance of a `Template` that can be attached to the DOM and updated
     * with new values.
     */
    class TemplateInstance {
        constructor(template, processor, options) {
            this.__parts = [];
            this.template = template;
            this.processor = processor;
            this.options = options;
        }
        update(values) {
            let i = 0;
            for (const part of this.__parts) {
                if (part !== undefined) {
                    part.setValue(values[i]);
                }
                i++;
            }
            for (const part of this.__parts) {
                if (part !== undefined) {
                    part.commit();
                }
            }
        }
        _clone() {
            // There are a number of steps in the lifecycle of a template instance's
            // DOM fragment:
            //  1. Clone - create the instance fragment
            //  2. Adopt - adopt into the main document
            //  3. Process - find part markers and create parts
            //  4. Upgrade - upgrade custom elements
            //  5. Update - set node, attribute, property, etc., values
            //  6. Connect - connect to the document. Optional and outside of this
            //     method.
            //
            // We have a few constraints on the ordering of these steps:
            //  * We need to upgrade before updating, so that property values will pass
            //    through any property setters.
            //  * We would like to process before upgrading so that we're sure that the
            //    cloned fragment is inert and not disturbed by self-modifying DOM.
            //  * We want custom elements to upgrade even in disconnected fragments.
            //
            // Given these constraints, with full custom elements support we would
            // prefer the order: Clone, Process, Adopt, Upgrade, Update, Connect
            //
            // But Safari does not implement CustomElementRegistry#upgrade, so we
            // can not implement that order and still have upgrade-before-update and
            // upgrade disconnected fragments. So we instead sacrifice the
            // process-before-upgrade constraint, since in Custom Elements v1 elements
            // must not modify their light DOM in the constructor. We still have issues
            // when co-existing with CEv0 elements like Polymer 1, and with polyfills
            // that don't strictly adhere to the no-modification rule because shadow
            // DOM, which may be created in the constructor, is emulated by being placed
            // in the light DOM.
            //
            // The resulting order is on native is: Clone, Adopt, Upgrade, Process,
            // Update, Connect. document.importNode() performs Clone, Adopt, and Upgrade
            // in one step.
            //
            // The Custom Elements v1 polyfill supports upgrade(), so the order when
            // polyfilled is the more ideal: Clone, Process, Adopt, Upgrade, Update,
            // Connect.
            const fragment = isCEPolyfill ?
                this.template.element.content.cloneNode(true) :
                document.importNode(this.template.element.content, true);
            const stack = [];
            const parts = this.template.parts;
            // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
            const walker = document.createTreeWalker(fragment, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
            let partIndex = 0;
            let nodeIndex = 0;
            let part;
            let node = walker.nextNode();
            // Loop through all the nodes and parts of a template
            while (partIndex < parts.length) {
                part = parts[partIndex];
                if (!isTemplatePartActive(part)) {
                    this.__parts.push(undefined);
                    partIndex++;
                    continue;
                }
                // Progress the tree walker until we find our next part's node.
                // Note that multiple parts may share the same node (attribute parts
                // on a single element), so this loop may not run at all.
                while (nodeIndex < part.index) {
                    nodeIndex++;
                    if (node.nodeName === 'TEMPLATE') {
                        stack.push(node);
                        walker.currentNode = node.content;
                    }
                    if ((node = walker.nextNode()) === null) {
                        // We've exhausted the content inside a nested template element.
                        // Because we still have parts (the outer for-loop), we know:
                        // - There is a template in the stack
                        // - The walker will find a nextNode outside the template
                        walker.currentNode = stack.pop();
                        node = walker.nextNode();
                    }
                }
                // We've arrived at our part's node.
                if (part.type === 'node') {
                    const part = this.processor.handleTextExpression(this.options);
                    part.insertAfterNode(node.previousSibling);
                    this.__parts.push(part);
                }
                else {
                    this.__parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options));
                }
                partIndex++;
            }
            if (isCEPolyfill) {
                document.adoptNode(fragment);
                customElements.upgrade(fragment);
            }
            return fragment;
        }
    }

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    const commentMarker = ` ${marker} `;
    /**
     * The return type of `html`, which holds a Template and the values from
     * interpolated expressions.
     */
    class TemplateResult {
        constructor(strings, values, type, processor) {
            this.strings = strings;
            this.values = values;
            this.type = type;
            this.processor = processor;
        }
        /**
         * Returns a string of HTML used to create a `<template>` element.
         */
        getHTML() {
            const l = this.strings.length - 1;
            let html = '';
            let isCommentBinding = false;
            for (let i = 0; i < l; i++) {
                const s = this.strings[i];
                // For each binding we want to determine the kind of marker to insert
                // into the template source before it's parsed by the browser's HTML
                // parser. The marker type is based on whether the expression is in an
                // attribute, text, or comment position.
                //   * For node-position bindings we insert a comment with the marker
                //     sentinel as its text content, like <!--{{lit-guid}}-->.
                //   * For attribute bindings we insert just the marker sentinel for the
                //     first binding, so that we support unquoted attribute bindings.
                //     Subsequent bindings can use a comment marker because multi-binding
                //     attributes must be quoted.
                //   * For comment bindings we insert just the marker sentinel so we don't
                //     close the comment.
                //
                // The following code scans the template source, but is *not* an HTML
                // parser. We don't need to track the tree structure of the HTML, only
                // whether a binding is inside a comment, and if not, if it appears to be
                // the first binding in an attribute.
                const commentOpen = s.lastIndexOf('<!--');
                // We're in comment position if we have a comment open with no following
                // comment close. Because <-- can appear in an attribute value there can
                // be false positives.
                isCommentBinding = (commentOpen > -1 || isCommentBinding) &&
                    s.indexOf('-->', commentOpen + 1) === -1;
                // Check to see if we have an attribute-like sequence preceding the
                // expression. This can match "name=value" like structures in text,
                // comments, and attribute values, so there can be false-positives.
                const attributeMatch = lastAttributeNameRegex.exec(s);
                if (attributeMatch === null) {
                    // We're only in this branch if we don't have a attribute-like
                    // preceding sequence. For comments, this guards against unusual
                    // attribute values like <div foo="<!--${'bar'}">. Cases like
                    // <!-- foo=${'bar'}--> are handled correctly in the attribute branch
                    // below.
                    html += s + (isCommentBinding ? commentMarker : nodeMarker);
                }
                else {
                    // For attributes we use just a marker sentinel, and also append a
                    // $lit$ suffix to the name to opt-out of attribute-specific parsing
                    // that IE and Edge do for style and certain SVG attributes.
                    html += s.substr(0, attributeMatch.index) + attributeMatch[1] +
                        attributeMatch[2] + boundAttributeSuffix + attributeMatch[3] +
                        marker;
                }
            }
            html += this.strings[l];
            return html;
        }
        getTemplateElement() {
            const template = document.createElement('template');
            template.innerHTML = this.getHTML();
            return template;
        }
    }
    /**
     * A TemplateResult for SVG fragments.
     *
     * This class wraps HTML in an `<svg>` tag in order to parse its contents in the
     * SVG namespace, then modifies the template to remove the `<svg>` tag so that
     * clones only container the original fragment.
     */
    class SVGTemplateResult extends TemplateResult {
        getHTML() {
            return `<svg>${super.getHTML()}</svg>`;
        }
        getTemplateElement() {
            const template = super.getTemplateElement();
            const content = template.content;
            const svgElement = content.firstChild;
            content.removeChild(svgElement);
            reparentNodes(content, svgElement.firstChild);
            return template;
        }
    }

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    const isPrimitive = (value) => {
        return (value === null ||
            !(typeof value === 'object' || typeof value === 'function'));
    };
    const isIterable = (value) => {
        return Array.isArray(value) ||
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            !!(value && value[Symbol.iterator]);
    };
    /**
     * Writes attribute values to the DOM for a group of AttributeParts bound to a
     * single attribute. The value is only set once even if there are multiple parts
     * for an attribute.
     */
    class AttributeCommitter {
        constructor(element, name, strings) {
            this.dirty = true;
            this.element = element;
            this.name = name;
            this.strings = strings;
            this.parts = [];
            for (let i = 0; i < strings.length - 1; i++) {
                this.parts[i] = this._createPart();
            }
        }
        /**
         * Creates a single part. Override this to create a differnt type of part.
         */
        _createPart() {
            return new AttributePart(this);
        }
        _getValue() {
            const strings = this.strings;
            const l = strings.length - 1;
            let text = '';
            for (let i = 0; i < l; i++) {
                text += strings[i];
                const part = this.parts[i];
                if (part !== undefined) {
                    const v = part.value;
                    if (isPrimitive(v) || !isIterable(v)) {
                        text += typeof v === 'string' ? v : String(v);
                    }
                    else {
                        for (const t of v) {
                            text += typeof t === 'string' ? t : String(t);
                        }
                    }
                }
            }
            text += strings[l];
            return text;
        }
        commit() {
            if (this.dirty) {
                this.dirty = false;
                this.element.setAttribute(this.name, this._getValue());
            }
        }
    }
    /**
     * A Part that controls all or part of an attribute value.
     */
    class AttributePart {
        constructor(committer) {
            this.value = undefined;
            this.committer = committer;
        }
        setValue(value) {
            if (value !== noChange && (!isPrimitive(value) || value !== this.value)) {
                this.value = value;
                // If the value is a not a directive, dirty the committer so that it'll
                // call setAttribute. If the value is a directive, it'll dirty the
                // committer if it calls setValue().
                if (!isDirective(value)) {
                    this.committer.dirty = true;
                }
            }
        }
        commit() {
            while (isDirective(this.value)) {
                const directive = this.value;
                this.value = noChange;
                directive(this);
            }
            if (this.value === noChange) {
                return;
            }
            this.committer.commit();
        }
    }
    /**
     * A Part that controls a location within a Node tree. Like a Range, NodePart
     * has start and end locations and can set and update the Nodes between those
     * locations.
     *
     * NodeParts support several value types: primitives, Nodes, TemplateResults,
     * as well as arrays and iterables of those types.
     */
    class NodePart {
        constructor(options) {
            this.value = undefined;
            this.__pendingValue = undefined;
            this.options = options;
        }
        /**
         * Appends this part into a container.
         *
         * This part must be empty, as its contents are not automatically moved.
         */
        appendInto(container) {
            this.startNode = container.appendChild(createMarker());
            this.endNode = container.appendChild(createMarker());
        }
        /**
         * Inserts this part after the `ref` node (between `ref` and `ref`'s next
         * sibling). Both `ref` and its next sibling must be static, unchanging nodes
         * such as those that appear in a literal section of a template.
         *
         * This part must be empty, as its contents are not automatically moved.
         */
        insertAfterNode(ref) {
            this.startNode = ref;
            this.endNode = ref.nextSibling;
        }
        /**
         * Appends this part into a parent part.
         *
         * This part must be empty, as its contents are not automatically moved.
         */
        appendIntoPart(part) {
            part.__insert(this.startNode = createMarker());
            part.__insert(this.endNode = createMarker());
        }
        /**
         * Inserts this part after the `ref` part.
         *
         * This part must be empty, as its contents are not automatically moved.
         */
        insertAfterPart(ref) {
            ref.__insert(this.startNode = createMarker());
            this.endNode = ref.endNode;
            ref.endNode = this.startNode;
        }
        setValue(value) {
            this.__pendingValue = value;
        }
        commit() {
            if (this.startNode.parentNode === null) {
                return;
            }
            while (isDirective(this.__pendingValue)) {
                const directive = this.__pendingValue;
                this.__pendingValue = noChange;
                directive(this);
            }
            const value = this.__pendingValue;
            if (value === noChange) {
                return;
            }
            if (isPrimitive(value)) {
                if (value !== this.value) {
                    this.__commitText(value);
                }
            }
            else if (value instanceof TemplateResult) {
                this.__commitTemplateResult(value);
            }
            else if (value instanceof Node) {
                this.__commitNode(value);
            }
            else if (isIterable(value)) {
                this.__commitIterable(value);
            }
            else if (value === nothing) {
                this.value = nothing;
                this.clear();
            }
            else {
                // Fallback, will render the string representation
                this.__commitText(value);
            }
        }
        __insert(node) {
            this.endNode.parentNode.insertBefore(node, this.endNode);
        }
        __commitNode(value) {
            if (this.value === value) {
                return;
            }
            this.clear();
            this.__insert(value);
            this.value = value;
        }
        __commitText(value) {
            const node = this.startNode.nextSibling;
            value = value == null ? '' : value;
            // If `value` isn't already a string, we explicitly convert it here in case
            // it can't be implicitly converted - i.e. it's a symbol.
            const valueAsString = typeof value === 'string' ? value : String(value);
            if (node === this.endNode.previousSibling &&
                node.nodeType === 3 /* Node.TEXT_NODE */) {
                // If we only have a single text node between the markers, we can just
                // set its value, rather than replacing it.
                // TODO(justinfagnani): Can we just check if this.value is primitive?
                node.data = valueAsString;
            }
            else {
                this.__commitNode(document.createTextNode(valueAsString));
            }
            this.value = value;
        }
        __commitTemplateResult(value) {
            const template = this.options.templateFactory(value);
            if (this.value instanceof TemplateInstance &&
                this.value.template === template) {
                this.value.update(value.values);
            }
            else {
                // Make sure we propagate the template processor from the TemplateResult
                // so that we use its syntax extension, etc. The template factory comes
                // from the render function options so that it can control template
                // caching and preprocessing.
                const instance = new TemplateInstance(template, value.processor, this.options);
                const fragment = instance._clone();
                instance.update(value.values);
                this.__commitNode(fragment);
                this.value = instance;
            }
        }
        __commitIterable(value) {
            // For an Iterable, we create a new InstancePart per item, then set its
            // value to the item. This is a little bit of overhead for every item in
            // an Iterable, but it lets us recurse easily and efficiently update Arrays
            // of TemplateResults that will be commonly returned from expressions like:
            // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
            // If _value is an array, then the previous render was of an
            // iterable and _value will contain the NodeParts from the previous
            // render. If _value is not an array, clear this part and make a new
            // array for NodeParts.
            if (!Array.isArray(this.value)) {
                this.value = [];
                this.clear();
            }
            // Lets us keep track of how many items we stamped so we can clear leftover
            // items from a previous render
            const itemParts = this.value;
            let partIndex = 0;
            let itemPart;
            for (const item of value) {
                // Try to reuse an existing part
                itemPart = itemParts[partIndex];
                // If no existing part, create a new one
                if (itemPart === undefined) {
                    itemPart = new NodePart(this.options);
                    itemParts.push(itemPart);
                    if (partIndex === 0) {
                        itemPart.appendIntoPart(this);
                    }
                    else {
                        itemPart.insertAfterPart(itemParts[partIndex - 1]);
                    }
                }
                itemPart.setValue(item);
                itemPart.commit();
                partIndex++;
            }
            if (partIndex < itemParts.length) {
                // Truncate the parts array so _value reflects the current state
                itemParts.length = partIndex;
                this.clear(itemPart && itemPart.endNode);
            }
        }
        clear(startNode = this.startNode) {
            removeNodes(this.startNode.parentNode, startNode.nextSibling, this.endNode);
        }
    }
    /**
     * Implements a boolean attribute, roughly as defined in the HTML
     * specification.
     *
     * If the value is truthy, then the attribute is present with a value of
     * ''. If the value is falsey, the attribute is removed.
     */
    class BooleanAttributePart {
        constructor(element, name, strings) {
            this.value = undefined;
            this.__pendingValue = undefined;
            if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
                throw new Error('Boolean attributes can only contain a single expression');
            }
            this.element = element;
            this.name = name;
            this.strings = strings;
        }
        setValue(value) {
            this.__pendingValue = value;
        }
        commit() {
            while (isDirective(this.__pendingValue)) {
                const directive = this.__pendingValue;
                this.__pendingValue = noChange;
                directive(this);
            }
            if (this.__pendingValue === noChange) {
                return;
            }
            const value = !!this.__pendingValue;
            if (this.value !== value) {
                if (value) {
                    this.element.setAttribute(this.name, '');
                }
                else {
                    this.element.removeAttribute(this.name);
                }
                this.value = value;
            }
            this.__pendingValue = noChange;
        }
    }
    /**
     * Sets attribute values for PropertyParts, so that the value is only set once
     * even if there are multiple parts for a property.
     *
     * If an expression controls the whole property value, then the value is simply
     * assigned to the property under control. If there are string literals or
     * multiple expressions, then the strings are expressions are interpolated into
     * a string first.
     */
    class PropertyCommitter extends AttributeCommitter {
        constructor(element, name, strings) {
            super(element, name, strings);
            this.single =
                (strings.length === 2 && strings[0] === '' && strings[1] === '');
        }
        _createPart() {
            return new PropertyPart(this);
        }
        _getValue() {
            if (this.single) {
                return this.parts[0].value;
            }
            return super._getValue();
        }
        commit() {
            if (this.dirty) {
                this.dirty = false;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                this.element[this.name] = this._getValue();
            }
        }
    }
    class PropertyPart extends AttributePart {
    }
    // Detect event listener options support. If the `capture` property is read
    // from the options object, then options are supported. If not, then the third
    // argument to add/removeEventListener is interpreted as the boolean capture
    // value so we should only pass the `capture` property.
    let eventOptionsSupported = false;
    // Wrap into an IIFE because MS Edge <= v41 does not support having try/catch
    // blocks right into the body of a module
    (() => {
        try {
            const options = {
                get capture() {
                    eventOptionsSupported = true;
                    return false;
                }
            };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            window.addEventListener('test', options, options);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            window.removeEventListener('test', options, options);
        }
        catch (_e) {
            // event options not supported
        }
    })();
    class EventPart {
        constructor(element, eventName, eventContext) {
            this.value = undefined;
            this.__pendingValue = undefined;
            this.element = element;
            this.eventName = eventName;
            this.eventContext = eventContext;
            this.__boundHandleEvent = (e) => this.handleEvent(e);
        }
        setValue(value) {
            this.__pendingValue = value;
        }
        commit() {
            while (isDirective(this.__pendingValue)) {
                const directive = this.__pendingValue;
                this.__pendingValue = noChange;
                directive(this);
            }
            if (this.__pendingValue === noChange) {
                return;
            }
            const newListener = this.__pendingValue;
            const oldListener = this.value;
            const shouldRemoveListener = newListener == null ||
                oldListener != null &&
                    (newListener.capture !== oldListener.capture ||
                        newListener.once !== oldListener.once ||
                        newListener.passive !== oldListener.passive);
            const shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);
            if (shouldRemoveListener) {
                this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options);
            }
            if (shouldAddListener) {
                this.__options = getOptions(newListener);
                this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options);
            }
            this.value = newListener;
            this.__pendingValue = noChange;
        }
        handleEvent(event) {
            if (typeof this.value === 'function') {
                this.value.call(this.eventContext || this.element, event);
            }
            else {
                this.value.handleEvent(event);
            }
        }
    }
    // We copy options because of the inconsistent behavior of browsers when reading
    // the third argument of add/removeEventListener. IE11 doesn't support options
    // at all. Chrome 41 only reads `capture` if the argument is an object.
    const getOptions = (o) => o &&
        (eventOptionsSupported ?
            { capture: o.capture, passive: o.passive, once: o.once } :
            o.capture);

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    /**
     * Creates Parts when a template is instantiated.
     */
    class DefaultTemplateProcessor {
        /**
         * Create parts for an attribute-position binding, given the event, attribute
         * name, and string literals.
         *
         * @param element The element containing the binding
         * @param name  The attribute name
         * @param strings The string literals. There are always at least two strings,
         *   event for fully-controlled bindings with a single expression.
         */
        handleAttributeExpressions(element, name, strings, options) {
            const prefix = name[0];
            if (prefix === '.') {
                const committer = new PropertyCommitter(element, name.slice(1), strings);
                return committer.parts;
            }
            if (prefix === '@') {
                return [new EventPart(element, name.slice(1), options.eventContext)];
            }
            if (prefix === '?') {
                return [new BooleanAttributePart(element, name.slice(1), strings)];
            }
            const committer = new AttributeCommitter(element, name, strings);
            return committer.parts;
        }
        /**
         * Create parts for a text-position binding.
         * @param templateFactory
         */
        handleTextExpression(options) {
            return new NodePart(options);
        }
    }
    const defaultTemplateProcessor = new DefaultTemplateProcessor();

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    /**
     * The default TemplateFactory which caches Templates keyed on
     * result.type and result.strings.
     */
    function templateFactory(result) {
        let templateCache = templateCaches.get(result.type);
        if (templateCache === undefined) {
            templateCache = {
                stringsArray: new WeakMap(),
                keyString: new Map()
            };
            templateCaches.set(result.type, templateCache);
        }
        let template = templateCache.stringsArray.get(result.strings);
        if (template !== undefined) {
            return template;
        }
        // If the TemplateStringsArray is new, generate a key from the strings
        // This key is shared between all templates with identical content
        const key = result.strings.join(marker);
        // Check if we already have a Template for this key
        template = templateCache.keyString.get(key);
        if (template === undefined) {
            // If we have not seen this key before, create a new Template
            template = new Template(result, result.getTemplateElement());
            // Cache the Template for this key
            templateCache.keyString.set(key, template);
        }
        // Cache all future queries for this TemplateStringsArray
        templateCache.stringsArray.set(result.strings, template);
        return template;
    }
    const templateCaches = new Map();

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    const parts = new WeakMap();
    /**
     * Renders a template result or other value to a container.
     *
     * To update a container with new values, reevaluate the template literal and
     * call `render` with the new result.
     *
     * @param result Any value renderable by NodePart - typically a TemplateResult
     *     created by evaluating a template tag like `html` or `svg`.
     * @param container A DOM parent to render to. The entire contents are either
     *     replaced, or efficiently updated if the same result type was previous
     *     rendered there.
     * @param options RenderOptions for the entire render tree rendered to this
     *     container. Render options must *not* change between renders to the same
     *     container, as those changes will not effect previously rendered DOM.
     */
    const render$3 = (result, container, options) => {
        let part = parts.get(container);
        if (part === undefined) {
            removeNodes(container, container.firstChild);
            parts.set(container, part = new NodePart(Object.assign({ templateFactory }, options)));
            part.appendInto(container);
        }
        part.setValue(result);
        part.commit();
    };

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    // IMPORTANT: do not change the property name or the assignment expression.
    // This line will be used in regexes to search for lit-html usage.
    // TODO(justinfagnani): inject version number at build time
    if (typeof window !== 'undefined') {
        (window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.2.1');
    }
    /**
     * Interprets a template literal as an HTML template that can efficiently
     * render to and update a container.
     */
    const html = (strings, ...values) => new TemplateResult(strings, values, 'html', defaultTemplateProcessor);
    /**
     * Interprets a template literal as an SVG template that can efficiently
     * render to and update a container.
     */
    const svg = (strings, ...values) => new SVGTemplateResult(strings, values, 'svg', defaultTemplateProcessor);

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    // For each part, remember the value that was last rendered to the part by the
    // unsafeHTML directive, and the DocumentFragment that was last set as a value.
    // The DocumentFragment is used as a unique key to check if the last value
    // rendered to the part was with unsafeHTML. If not, we'll always re-render the
    // value passed to unsafeHTML.
    const previousValues = new WeakMap();
    /**
     * Renders the result as HTML, rather than text.
     *
     * Note, this is unsafe to use with any user-provided input that hasn't been
     * sanitized or escaped, as it may lead to cross-site-scripting
     * vulnerabilities.
     */
    const unsafeHTML = directive$1((value) => (part) => {
        if (!(part instanceof NodePart)) {
            throw new Error('unsafeHTML can only be used in text bindings');
        }
        const previousValue = previousValues.get(part);
        if (previousValue !== undefined && isPrimitive(value) &&
            value === previousValue.value && part.value === previousValue.fragment) {
            return;
        }
        const template = document.createElement('template');
        template.innerHTML = value; // innerHTML casts to string internally
        const fragment = document.importNode(template.content, true);
        part.setValue(fragment);
        previousValues.set(part, { value, fragment });
    });

    function _render(element, vdom, parent) {
        if (typeof vdom === 'string') {
            render$3(html `${unsafeHTML(vdom)}`, element);
        }
        else if (vdom instanceof TemplateResult) {
            render$3(vdom, element);
        }
        else {
            updateElement(element, vdom, parent);
        }
    }
    const run = directive$1((event, ...args) => (part) => {
        if (!(part instanceof EventPart)) {
            throw new Error('${run} can only be used in event handlers');
        }
        let { element, eventName } = part;
        const getComponent = () => {
            let component = element['_component'];
            while (!component && element) {
                element = element.parentElement;
                component = element && element['_component'];
            }
            console.assert(!!component, 'Component not found.');
            return component;
        };
        if (typeof event === 'string') {
            element[`on${eventName}`] = e => getComponent().run(event, ...args, e);
        }
        else if (typeof event === 'function') {
            element[`on${eventName}`] = e => getComponent().setState(event(getComponent().state, ...args, e));
        }
    });

    app$1.createElement = createElement;
    app$1.render = _render;
    app$1.Fragment = Fragment;
    if (typeof window === 'object') {
        window['html'] = html;
        window['svg'] = svg;
        window['run'] = run;
    }

    exports.Component = Component;
    exports.ROUTER_404_EVENT = ROUTER_404_EVENT;
    exports.ROUTER_EVENT = ROUTER_EVENT;
    exports.app = app$1;
    exports.customElement = customElement$1;
    exports.default = app$1;
    exports.event = update$1;
    exports.html = html;
    exports.on = on;
    exports.render = _render;
    exports.run = run;
    exports.svg = svg;
    exports.update = update$1;

    return exports;

}({}));
