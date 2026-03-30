(function () {
    const service = document.querySelector('meta[name="service"]')?.content || 'Rosea';
    const env = document.querySelector('meta[name="env"]')?.content || 'development';
    const endpoint = '/api/clientlogs';
    const correlationId = (function () {
        const existing = (document.cookie.match(/(^|;)\\s*correlationId=([^;]+)/) || [])[2];
        if (existing) return existing;
        const id = cryptoRandomUUID();
        document.cookie = `correlationId=${id}; path=/; SameSite=Lax`;
        return id;
    })();

    function cryptoRandomUUID() {
        if (crypto && crypto.randomUUID) return crypto.randomUUID();
        return 'cid-' + Math.random().toString(36).slice(2) + Date.now();
    }

    function send(log) {

        const payload = {
            level: log.level || 'ERROR',
            message: log.message,
            correlationId: correlationId,
            userId: log.userId || null,
            method: log.method || null,
            path: log.path || window.location.pathname + window.location.search,
            status: log.status || null,
            responseTimeMs: log.responseTimeMs || null,
            context: log.context || null
        };
        //const payload = {
        //    timestamp: new Date().toISOString(),
        //    level: log.level || 'ERROR',
        //    service,
        //    env,
        //    message: log.message,
        //    correlationId: correlationId,
        //    userId: log.userId || null,
        //    method: log.method || null,
        //    path: log.path || window.location.pathname + window.location.search,
        //    status: log.status || null,
        //    responseTimeMs: log.responseTimeMs || null,
        //    context: log.context || null
        //};

        try {
            const body = JSON.stringify(payload);
            if (navigator.sendBeacon) {
                navigator.sendBeacon(endpoint, body);
            } else {
                fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body,
                    keepalive: true
                }).catch(() => { /* swallow */ });
            }
        } catch { /* swallow */ }
    }

    // global errors
    window.addEventListener('error', (e) => {
        send({
            level: 'ERROR',
            message: `${e.message} at ${e.filename}:${e.lineno}:${e.colno}`,
            context: { stack: (e.error && e.error.stack) || null }
        });
    });

    window.addEventListener('unhandledrejection', (ev) => {
        const reason = ev.reason;
        send({
            level: 'ERROR',
            message: `Unhandled Rejection: ${reason && reason.message ? reason.message : String(reason)}`,
            context: { stack: reason && reason.stack ? reason.stack : null }
        });
    });

    // instrument UI events (elements with data-log attribute)
    document.addEventListener('click', (e) => {
        const el = e.target.closest && e.target.closest('[data-log]');
        if (!el) return;
        const ctx = el.getAttribute('data-log-context');
        let parsed = null;
        try { parsed = ctx ? JSON.parse(ctx) : null; } catch { parsed = ctx; }
        send({
            level: 'INFO',
            message: `UI event: ${el.getAttribute('data-log')}`,
            context: parsed
        });
    });

    // SPA route changes (history API)
    (function () {
        const push = history.pushState;
        history.pushState = function (...args) {
            push.apply(this, args);
            send({ level: 'INFO', message: 'route_change', path: location.pathname + location.search });
            window.dispatchEvent(new Event('location-changed'));
        };
        window.addEventListener('popstate', () => {
            send({ level: 'INFO', message: 'route_change', path: location.pathname + location.search });
        });
    })();

    // basic page load metrics
    window.addEventListener('load', () => {
        setTimeout(() => {
            try {
                const p = performance.timing;
                const metrics = {
                    dnsMs: p.domainLookupEnd - p.domainLookupStart,
                    tcpMs: p.connectEnd - p.connectStart,
                    ttfbMs: p.responseStart - p.requestStart,
                    domContentLoadedMs: p.domContentLoadedEventEnd - p.domContentLoadedEventStart,
                    loadMs: p.loadEventEnd - p.navigationStart,
                };
                send({ level: 'INFO', message: 'page_load_metrics', context: metrics });
            } catch { /* ignore */ }
        }, 0);
    });

    // expose minimal API
    window.RoseaLogger = {
        send: (payload) => send(payload)
    };
})();