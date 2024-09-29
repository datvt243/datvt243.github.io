export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('render:html', (html, { event }) => {
        html.bodyAttrs.push('class="bg-slate-900 text-white"');
    });
});
