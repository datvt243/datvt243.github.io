export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('vue:error', (error, instance, info) => {
        console.error('VUE:ERROR -----');
        /* console.log({ info }); */
        /*  console.log({ error, instance, info }); */
        // navigateTo('/');
    });
});
