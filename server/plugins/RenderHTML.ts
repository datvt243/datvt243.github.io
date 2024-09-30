export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('render:html', (html, { event }) => {
        html.bodyAttrs.push('class="bg-[#333333] text-white"');
    });
});
