export const useResumeStore = defineStore('resumeStore', () => {
    const email = ref('votan.it@gmail.com');
    const resume = ref({});

    const getResume = computed(() => resume.value);

    async function fetchResume() {
        resume.value = await $fetch(`https://nodejs-resume-api-ts.onrender.com/api/me/${email.value}`);
    }

    return {
        fetchResume,
        getResume,
    };
});
