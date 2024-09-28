export default defineAppConfig({
    AppHeading: 'Hello world',
    MY_EMAIL: 'votan.it@gmail.com',
    API_RESUME: 'https://nodejs-resume-api-ts.onrender.com',
    SERVICE_RESUME: 'api/resume',
    menu: [
        {
            page: 'Resume',
            link: '/',
        },
        {
            page: 'Blogs',
            link: '/blogs',
        },
        {
            page: 'Contact',
            link: '/contact',
        },
        /* {
            page: 'Static',
            link: '/static',
        },
        {
            page: 'SSR',
            link: '/ssr',
        },
        {
            page: 'SSR false',
            link: '/ssr-false',
        },
        {
            page: 'SWR',
            link: '/swr',
        },
        {
            page: 'SWR 3000',
            link: '/swr-3000',
        },
        {
            page: 'ISR',
            link: '/isr',
        },
        {
            page: 'ISR 3000',
            link: '/isr-3000',
        }, */
    ],
    contact: {
        phone: '0385262510',
        address: 'Tân Bình, Hồ Chí Minh',
        email: 'votan.it@gmail.com',
        social: {
            github: 'https://github.com/datvt243',
            linkedin: 'https://www.linkedin.com/in/datvt243/',
            website: 'https://datvt243.github.io',
        },
        google_map:
            'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31028.537744975543!2d106.63287150003738!3d10.803360191242497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175293818af3a73%3A0xcd8d16d1180acc8b!2zVMOibiBCw6xuaCwgSOG7kyBDaMOtIE1pbmgsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1727518723765!5m2!1svi!2s',
    },
});
